<thinking>
The user is requesting a detailed cryptographic review of a **Client-Side Zero-Knowledge (ZK) Encryption** system, specifically focusing on **Key Derivation (KDF)** and **Rotation Protocols**.

**Context Analysis:**
- **System**: OmniSwarm PROv1.
- **Goal**: Zero-Knowledge. This means the server *never* sees the plaintext password or the master encryption key.
- **Threat Model**:
    - Server compromise (attacker gets the encrypted blobs and the salt/iterations).
    - Client-side XSS (attacker tries to steal the key from memory).
    - Brute-force/Dictionary attacks on the user's password.
    - Key compromise (user's device is stolen; need for rotation without re-encrypting all data).

**Technical Requirements for ZK Encryption:**
1. **KDF**: Must be computationally expensive (memory-hard) to thwart GPUs/ASICs. Argon2id is the gold standard; PBKDF2 is the legacy baseline.
2. **Key Hierarchy**:
    - `Password` $\rightarrow$ `Master Key (MK)` (via KDF).
    - `Master Key` $\rightarrow$ `Data Encryption Key (DEK)` (via HKDF).
    - This allows rotating the MK (password change) by only re-encrypting the DEK, not the entire dataset.
3. **Rotation**:
    - **Password Rotation**: Re-wrap the DEK with a new MK.
    - **Key Rotation (Compromise)**: Generate a new DEK, re-encrypt data (expensive), or use versioned keys.
4. **Storage**: Salt and KDF parameters must be stored on the server, but the key stays on the client.

**Plan for the Review:**
1. **Protocol Specification**: Define the exact cryptographic flow (The "Golden Path").
2. **KDF Deep Dive**: Compare Argon2id vs PBKDF2 and specify parameters.
3. **Rotation Logic**: Detail the "Envelope Encryption" pattern for efficient rotation.
4. **Security Analysis**: Adversarial thinking (What happens if X is leaked?).
5. **Implementation**: Provide a production-ready TypeScript implementation using `WebCrypto` and `argon2-browser` (or similar).
</thinking>

# Cryptographic Review: Client-Side Zero-Knowledge Encryption Protocol

This document provides the security architecture and implementation review for the key derivation and rotation protocol used in **OmniSwarm PROv1**. The goal is to ensure that the service provider has **zero knowledge** of the user's plaintext data and master keys.

---

## 1. The Cryptographic Architecture (The "Golden Path")

To achieve zero-knowledge while allowing for password changes and key rotation, we implement an **Envelope Encryption** model. We decouple the user's authentication secret from the actual data encryption key.

### Key Hierarchy
1. **User Password** $\rightarrow$ (KDF) $\rightarrow$ **Master Key (MK)**
2. **Master Key (MK)** $\rightarrow$ (AES-GCM) $\rightarrow$ **Wrapped Data Encryption Key (WDEK)**
3. **Data Encryption Key (DEK)** $\rightarrow$ (AES-GCM) $\rightarrow$ **Ciphertext**

**Why this structure?**
If the user changes their password, we only need to decrypt the `DEK` with the old `MK` and re-encrypt it with the new `MK`. We do **not** need to re-encrypt gigabytes of user data.

---

## 2. Key Derivation Function (KDF) Review

### Selected Algorithm: Argon2id
We reject PBKDF2 in favor of **Argon2id** (the winner of the Password Hashing Competition). 

**Reasoning:** PBKDF2 is only CPU-hard. Attackers use GPUs and ASICs to parallelize billions of guesses. Argon2id is **memory-hard**, forcing the attacker to dedicate physical RAM to every guess, which drastically increases the cost of brute-force attacks.

### Recommended Parameters (Client-Side)
Since this runs in the browser, we must balance security with UX (avoiding 10-second freezes).

| Parameter | Value | Purpose |
| :--- | :--- | :--- |
| **Type** | `Argon2id` | Hybrid approach: resists side-channel and GPU attacks. |
| **Iterations (t)** | `3` | Number of passes over memory. |
| **Memory (m)** | `64 MB` | Memory cost. High enough to hinder GPUs, low enough for mobile browsers. |
| **Parallelism (p)** | `1` | Number of threads. Kept at 1 for maximum browser compatibility. |
| **Salt** | `16 bytes` | Cryptographically random, unique per user, stored on server. |
| **Output Length** | `32 bytes` | Matches AES-256 key size. |

---

## 3. Key Rotation Protocol

### Scenario A: Password Change (MK Rotation)
1. **Client** derives `MK_old` from `Password_old`.
2. **Client** fetches `WDEK` from server.
3. **Client** decrypts `WDEK` using `MK_old` $\rightarrow$ `DEK`.
4. **Client** derives `MK_new` from `Password_new`.
5. **Client** encrypts `DEK` using `MK_new` $\rightarrow$ `WDEK_new`.
6. **Client** uploads `WDEK_new` to server.

### Scenario B: Key Compromise (DEK Rotation)
If the `DEK` itself is leaked, the data is compromised regardless of the password.
1. **Client** generates a new random `DEK_v2`.
2. **Client** decrypts data with `DEK_v1` and re-encrypts with `DEK_v2`.
3. **Client** wraps `DEK_v2` with the current `MK` and updates the server.
*Note: This is a heavy operation. For large datasets, we implement **Lazy Rotation**: new data is encrypted with `v2`, and old data is migrated in the background.*

---

## 4. Adversarial Analysis (Threat Model)

| Threat | Attack Vector | Mitigation |
| :--- | :--- | :--- |
| **Server Breach** | Attacker gets `Salt`, `WDEK`, and `Ciphertext`. | Attacker must still brute-force the password. Argon2id makes this computationally prohibitive. |
| **XSS Attack** | Malicious script reads `MK` or `DEK` from JS memory. | Use `window.crypto.subtle` (WebCrypto). Keys are marked as `extractable: false` where possible. Clear memory immediately after use. |
| **Dictionary Attack** | Attacker uses common passwords to guess `MK`. | Enforce minimum password entropy on the client side before KDF execution. |
| **Replay Attack** | Attacker replaces `WDEK_new` with `WDEK_old`. | Include a `version_id` and `timestamp` inside the `WDEK` envelope; verify on client. |

---

## 5. Production Implementation (TypeScript)

This implementation uses the **WebCrypto API** for high-performance, secure operations and assumes an Argon2id wrapper (like `argon2-browser`).

```typescript
import argon2 from 'argon2-browser';

interface EncryptionEnvelope {
  wdek: ArrayBuffer; // Wrapped Data Encryption Key
  iv: Uint8Array;    // Initialization Vector for WDEK
  salt: Uint8Array;  // KDF Salt
}

export class ZeroKnowledgeVault {
  private static MK_LENGTH = 32; // 256-bit
  private static ALGO = 'AES-GCM';

  /**
   * Step 1: Derive Master Key from Password
   */
  async deriveMasterKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const result = await argon2.hash({
      pass: password,
      salt: salt,
      time: 3,
      mem: 65536, // 64MB
      hashLen: ZeroKnowledgeVault.MK_LENGTH,
      parallelism: 1,
      type: argon2.Argon2Type.Argon2id,
    });

    return await crypto.subtle.importKey(
      'raw',
      result.hash,
      { name: ZeroKnowledgeVault.ALGO },
      false, // Not extractable for security
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Step 2: Unwrap the DEK using the Master Key
   */
  async unwrapDEK(mk: CryptoKey, envelope: EncryptionEnvelope): Promise<CryptoKey> {
    const decryptedDEK = await crypto.subtle.decrypt(
      { name: ZeroKnowledgeVault.ALGO, iv: envelope.iv },
      mk,
      envelope.wdek
    );

    return await crypto.subtle.importKey(
      'raw',
      decryptedDEK,
      { name: ZeroKnowledgeVault.ALGO },
      true, // DEK must be extractable to be re-wrapped during rotation
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Step 3: Wrap the DEK for storage (Rotation/Initial Setup)
   */
  async wrapDEK(mk: CryptoKey, dek: CryptoKey): Promise<{ wdek: ArrayBuffer; iv: Uint8Array }> {
    const rawDEK = await crypto.subtle.exportKey('raw', dek);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const wdek = await crypto.subtle.encrypt(
      { name: ZeroKnowledgeVault.ALGO, iv },
      mk,
      rawDEK
    );

    return { wdek, iv };
  }

  /**
   * Full Rotation Flow: Password Change
   */
  async rotatePassword(
    oldPass: string, 
    newPass: string, 
    envelope: EncryptionEnvelope
  ): Promise<EncryptionEnvelope> {
    // 1. Derive old MK and unwrap DEK
    const mkOld = await this.deriveMasterKey(oldPass, envelope.salt);
    const dek = await this.unwrapDEK(mkOld, envelope);

    // 2. Derive new MK and wrap DEK
    const mkNew = await this.deriveMasterKey(newPass, envelope.salt);
    const { wdek, iv } = await this.wrapDEK(mkNew, dek);

    return {
      wdek,
      iv,
      salt: envelope.salt // Salt remains the same for password rotation
    };
  }
}
```

### Final Security Checklist for Deployment:
- [ ] **CSP Header**: Implement a strict Content Security Policy to prevent XSS from exfiltrating keys.
- [ ] **Memory Zeroing**: In environments where possible, overwrite `Uint8Array` buffers containing raw keys with zeros after use.
- [ ] **HTTPS Only**: Ensure TLS 1.3 is enforced to prevent Man-in-the-Middle (MitM) attacks on the `WDEK` transport.
- [ ] **Secure Storage**: Ensure the `WDEK` is stored in a database with strict access controls, even though it is encrypted.