<thinking>
The objective is to provide a high-throughput messaging database design for the OmniSwarm PROv1 build. This is a specialized extension of the previous "User Auth DB" request, shifting focus from low-frequency auth lookups to high-velocity messaging (likely for the agent-to-agent and agent-to-user communication streams).

**Key Requirements:**
1. **High Throughput**: Cerebras generates tokens at 3000+ tok/s. The DB must handle massive write bursts and sequential reads for replay.
2. **Partitioning**: Messaging tables grow linearly and rapidly. We need a strategy to prevent index bloat and allow efficient archival.
3. **Indexing**: Optimized for "Get latest messages for conversation" and "Replay specific run/session."
4. **Explain Plan Analysis**: Validation of the "Hot Paths."

**Architectural Strategy:**
- **Storage Engine**: PostgreSQL.
- **Partitioning Strategy**: Declarative Range Partitioning based on `created_at`. This allows dropping old partitions (TTL) without `DELETE` overhead (which causes vacuuming storms).
- **Indexing**: Composite B-trees for conversation lookups; BRIN (Block Range Index) for massive time-series data where B-trees become too large.
- **Data Types**: `UUIDv7` for IDs (time-sortable, prevents B-tree fragmentation).

**Hot Path Analysis:**
- **Write Path**: `INSERT INTO messages` $\rightarrow$ Must be append-only, minimal index overhead.
- **Read Path (Latest)**: `SELECT ... WHERE conversation_id = X ORDER BY created_at DESC LIMIT 50`.
- **Read Path (Replay)**: `SELECT ... WHERE run_id = Y ORDER BY sequence_number ASC`.

**Plan:**
1. Define the `messages` and `conversations` schema.
2. Implement Range Partitioning logic.
3. Design a tiered indexing strategy (B-tree for lookups, BRIN for archives).
4. Provide `EXPLAIN ANALYZE` simulations for the critical paths.
5. Recommend connection pooling and write-optimization settings.
</thinking>

# 🗄️ OmniSwarm PROv1: High-Throughput Messaging Engine

For a system utilizing Cerebras-level velocity (3000+ tok/s), a standard relational table will eventually collapse under index maintenance and VACUUM overhead. This design implements **Time-Series Partitioning** and **Sequential Access Optimization** to ensure the database remains a conduit, not a bottleneck.

## 1. Optimized Schema Design
We separate the **Conversation Metadata** (slow-changing) from the **Message Stream** (high-velocity).

```sql
-- =============================================================================
-- OmniSwarm Messaging Engine
-- Strategy: Range Partitioning + UUIDv7 + BRIN Indexing
-- =============================================================================

BEGIN;

-- 1. Conversation Metadata (Standard Table)
CREATE TABLE conversations (
    conversation_id UUID PRIMARY KEY, -- UUIDv7 recommended
    user_id UUID NOT NULL,
    swarm_id UUID, 
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Message Stream (Partitioned Table)
-- We use PARTITION BY RANGE on created_at to allow instant archival/deletion
CREATE TABLE messages (
    message_id UUID NOT NULL, 
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content_type VARCHAR(20) NOT NULL, -- 'thought', 'token_chunk', 'tool_call', 'final'
    payload JSONB NOT NULL,
    sequence_number BIGINT NOT NULL,   -- Absolute order within the conversation
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Primary key must include the partition key in Postgres
    PRIMARY KEY (message_id, created_at)
) PARTITION BY RANGE (created_at);

-- -----------------------------------------------------------------------------
-- PARTITION MANAGEMENT
-- -----------------------------------------------------------------------------
-- Example: Monthly partitions. In production, automate this via pg_partman.
CREATE TABLE messages_2025_01 PARTITION OF messages 
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE messages_2025_02 PARTITION OF messages 
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- -----------------------------------------------------------------------------
-- INDEXING STRATEGY
-- -----------------------------------------------------------------------------

-- A. The "Latest Messages" Hot Path (B-Tree)
-- Optimized for: SELECT ... WHERE conversation_id = X ORDER BY created_at DESC
CREATE INDEX idx_messages_conv_time 
ON messages (conversation_id, created_at DESC);

-- B. The "Replay/Sequence" Path (B-Tree)
-- Optimized for: SELECT ... WHERE conversation_id = X ORDER BY sequence_number ASC
CREATE INDEX idx_messages_conv_seq 
ON messages (conversation_id, sequence_number ASC);

-- C. The "Archive/Audit" Path (BRIN)
-- Block Range Indexes are 1% the size of B-Trees. 
-- Perfect for massive time-series data where we query ranges of time.
CREATE INDEX idx_messages_brin_time 
ON messages USING BRIN (created_at);

COMMIT;
```

---

## 2. Partition Key & Strategy Recommendations

### Why Range Partitioning on `created_at`?
1. **Zero-Cost Deletion**: Instead of `DELETE FROM messages WHERE created_at < '2024-01-01'` (which generates massive WAL logs and requires VACUUM), you simply run `DROP TABLE messages_2024_01`.
2. **Partition Pruning**: The Postgres query planner will ignore all partitions that don't match the `WHERE created_at` filter, drastically reducing the index search space.
3. **Index Locality**: New messages are written to the "head" partition, keeping the active index pages in RAM (Buffer Cache).

### ID Recommendation: UUIDv7
**Do not use UUIDv4** for high-throughput messaging. UUIDv4 is random, causing "B-tree fragmentation" (random inserts force page splits). 
**Use UUIDv7**: It is time-sortable. Inserts happen at the end of the index, resulting in $O(1)$ append performance and significantly higher cache hit ratios.

---

## 3. Explain Plan Analysis (Hot Paths)

### Path A: Fetching the latest 50 messages for a UI
**Query:**
```sql
EXPLAIN ANALYZE
SELECT * FROM messages 
WHERE conversation_id = 'uuid-v7-here' 
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC 
LIMIT 50;
```
**Analysis:**
- **Plan**: `Index Scan using idx_messages_conv_time` $\rightarrow$ `Partition Pruning`.
- **Execution**: The planner identifies which monthly partition contains the last 7 days. It performs a backward index scan on `(conversation_id, created_at)`.
- **Complexity**: $O(\log N)$ where $N$ is the size of a *single partition*, not the whole dataset.

### Path B: Full Session Replay (The "Time Machine")
**Query:**
```sql
EXPLAIN ANALYZE
SELECT * FROM messages 
WHERE conversation_id = 'uuid-v7-here' 
ORDER BY sequence_number ASC;
```
**Analysis:**
- **Plan**: `Index Scan using idx_messages_conv_seq`.
- **Execution**: Since `sequence_number` is indexed alongside `conversation_id`, Postgres performs a sequential read of the index.
- **Complexity**: $O(K)$ where $K$ is the number of messages in that specific conversation.

---

## 4. High-Throughput Tuning (The "Cerebras" Config)

To handle 3000+ tokens/sec streaming into the DB, apply these `postgresql.conf` and architectural tweaks:

### Database Configuration
| Parameter | Value | Justification |
| :--- | :--- | :--- |
| `synchronous_commit` | `off` | Allows the DB to acknowledge the write before it hits disk. Critical for streaming. |
| `max_wal_size` | `4GB` - `16GB` | Prevents frequent checkpoints during high-velocity bursts. |
| `checkpoint_timeout` | `15min` | Reduces I/O spikes by spreading writes over a longer window. |
| `work_mem` | `16MB` - `64MB` | Ensures that `ORDER BY` operations for replay happen in RAM, not on disk. |

### Application Layer (Go/Node/Python)
1. **Batch Inserts**: Never `INSERT` one token at a time. Buffer tokens in the application layer and use `COPY` or multi-row inserts:
   ```sql
   INSERT INTO messages (...) VALUES (...), (...), (...); -- Batch of 100-500
   ```
2. **Connection Pooling**: Use **PgBouncer** in `transaction` mode. High-throughput messaging creates many short-lived connections; pooling prevents the "forking" overhead of Postgres processes.
3. **Write-Ahead Log (WAL) Disk**: Place the WAL on a separate NVMe drive from the data files to eliminate I/O contention between sequential writes (WAL) and random reads (Indexes).