<thinking>
The objective is to design a production-grade, zero-knowledge (ZK) / client-encrypted persistence layer for OmniSwarm PROv1. This system must handle run history, user accounts, and an audit trail while ensuring the server never sees plaintext sensitive data.

**Architectural Constraints:**
1. **Zero-Knowledge Posture**: User data (run history, prompts, outputs) must be encrypted on the client. The server stores only encrypted blobs and metadata.
2. **Replayability**: Run history must be stored such that a user can "replay" a swarm execution.
3. **Audit Trail**: A tamper-evident log of system actions (auth changes, data deletions) is required for compliance (DPDP/GDPR).
4. **Performance**: High-velocity Cerebras streams generate massive event logs; the schema must support efficient writes and cursor-based reads.

**Encryption Strategy:**
- **KMS**: Use a hybrid approach. A Master Key (derived from user password via Argon2id) encrypts a Data Encryption Key (DEK).
- **Algorithm**: AES-256-GCM for authenticated encryption.
- **Key Rotation**: DEKs are stored encrypted in the DB; rotating the master key only requires re-encrypting the DEK, not the entire history.

**Data Model Design:**
- `users`: Standard auth, but stores the encrypted DEK.
- `runs`: Metadata about a swarm execution (status, timestamps).
- `run_events`: The "meat" of the history. Encrypted payloads containing prompts, agent thoughts, and final artifacts.
- `audit_log`: Immutable, server-side log of administrative events.

**Indexing Strategy:**
- B-Tree on `(user_id, created_at DESC)` for history listing.
- Composite index on `(run_id, sequence_number)` for event replay.
- Partial index for "active" runs to optimize the current dashboard.

**Migration Strategy:**
- Use a versioned migration approach (e.g., `001_init.sql`).
- Ensure additive changes to avoid downtime.
</thinking>

# OmniSwarm PROv1: Encrypted Persistence Specification

## 1. Architectural Design: Zero-Knowledge Posture

To fulfill the privacy promise, OmniSwarm implements **Client-Side Field Level Encryption (CSFLE)**.

### Encryption Flow
1. **Key Derivation**: User password $\rightarrow$ Argon2id $\rightarrow$ `MasterKey`.
2. **DEK Management**: A random 256-bit `DataEncryptionKey` (DEK) is generated per user.
3. **Storage**: The `MasterKey` is never sent to the server. The `DEK` is encrypted with the `MasterKey` and stored in the `users` table.
4. **Data Flow**: 
   - **Write**: Client encrypts `payload` using `DEK` $\rightarrow$ Sends `ciphertext` + `nonce` + `tag` to server.
   - **Read**: Server sends `ciphertext` $\rightarrow$ Client decrypts using `DEK` in memory.

---

## 2. Database Schema (DDL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. User Accounts
-- Stores identity and the encrypted Data Encryption Key (DEK)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Argon2id hash for auth
    encrypted_dek BYTEA NOT NULL, -- DEK encrypted by User's MasterKey
    dek_nonce BYTEA NOT NULL,     -- Nonce for DEK encryption
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Run History (Metadata)
-- Non-sensitive metadata for listing and filtering
CREATE TABLE runs (
    run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('planning', 'executing', 'synthesizing', 'completed', 'failed')),
    model_used VARCHAR(50) NOT NULL,
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3. Run Events (Encrypted Payload)
-- The actual history of the swarm. Payload is AES-256-GCM ciphertext.
CREATE TABLE run_events (
    event_id BIGSERIAL PRIMARY KEY,
    run_id UUID NOT NULL REFERENCES runs(run_id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL, -- Ensures strict order for replay
    event_type VARCHAR(50) NOT NULL,  -- 'prompt', 'thought', 'tool_call', 'artifact'
    
    -- Encryption Bundle
    ciphertext BYTEA NOT NULL,       -- The encrypted content
    nonce BYTEA NOT NULL,            -- GCM Nonce
    auth_tag BYTEA NOT NULL,         -- GCM Auth Tag
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (run_id, sequence_number)
);

-- 4. Audit Trail (Immutable)
-- Server-side log for compliance. Not encrypted (contains system events).
CREATE TABLE audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,    -- 'PASSWORD_CHANGE', 'DATA_PURGE', 'LOGIN_FAILURE'
    ip_address INET,
    user_agent TEXT,
    payload JSONB,                   -- Context of the change
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Indexing Strategy & Justification

| Index Name | Definition | Justification |
| :--- | :--- | :--- |
| `idx_users_email` | `(email)` | O(1) lookup for authentication. |
| `idx_runs_user_time` | `(user_id, created_at DESC)` | Optimizes "My Recent Runs" list. Prevents full table scan. |
| `idx_events_run_seq` | `(run_id, sequence_number ASC)` | Critical for **Replay**. Allows streaming events in exact order. |
| `idx_runs_active` | `(user_id) WHERE status != 'completed'` | Partial index to quickly find currently running swarms for the HUD. |
| `idx_audit_user` | `(user_id, created_at DESC)` | Compliance reporting for specific users. |

---

## 4. Access Pattern Analysis & Example Queries

### Pattern A: Fetching User History (Paginated)
**Requirement**: List the last 20 runs for a user.
```sql
SELECT run_id, status, model_used, created_at 
FROM runs 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT 20 OFFSET $2;
```
*Execution Plan: Index Scan on `idx_runs_user_time` $\rightarrow$ O(log N).*

### Pattern B: Replaying a Run (The "Time Machine")
**Requirement**: Stream all encrypted events for a specific run in order.
```sql
SELECT sequence_number, event_type, ciphertext, nonce, auth_tag 
FROM run_events 
WHERE run_id = $1 
ORDER BY sequence_number ASC;
```
*Execution Plan: Index Only Scan on `idx_events_run_seq` $\rightarrow$ Sequential read of the index.*

### Pattern C: Compliance Purge (Right to be Forgotten)
**Requirement**: Delete all user data and log the action.
```sql
BEGIN;
  INSERT INTO audit_log (user_id, action, payload) 
  VALUES ($1, 'DATA_PURGE', '{"reason": "user_request"}');
  
  DELETE FROM users WHERE user_id = $1; -- Cascades to runs and run_events
COMMIT;
```

---

## 5. Retention & Migration Strategy

### Retention Policy
- **Run Metadata**: Retained for 1 year.
- **Run Events**: Retained for 90 days (due to high volume of Cerebras streams).
- **Audit Log**: Retained for 7 years (Legal/Compliance requirement).
- **Implementation**: A daily cron job executing:
  `DELETE FROM run_events WHERE created_at < NOW() - INTERVAL '90 days';`

### Migration Strategy
We use a **Versioned Migration Path** to ensure zero-downtime.

1. **Phase 1 (Additive)**: Deploy the `users`, `runs`, and `run_events` tables.
2. **Phase 2 (Client Update)**: Deploy the updated frontend that handles `WebCrypto` encryption before sending data.
3. **Phase 3 (Constraint Enforcement)**: Once the client is updated, apply `NOT NULL` constraints to the `ciphertext` columns.

**Rollback Plan**:
- Every migration is paired with a `.down.sql` script.
- Since the schema is additive, rolling back the application code does not require dropping tables, preventing data loss.

---

## 6. Summary of Privacy Guarantees

| Threat | Mitigation |
| :--- | :--- |
| **DB Leak** | Attacker gets `ciphertext`. Without the user's `MasterKey` (which is never stored), the data is useless. |
| **Server Compromise** | The server cannot decrypt run history because it lacks the `MasterKey`. |
| **Insider Threat** | DB Admins can see *that* a run happened (metadata), but not *what* was discussed (payload). |
| **Replay Attack** | GCM `nonce` ensures that the same prompt encrypted twice results in different ciphertexts. |