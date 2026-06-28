# Security — Ekathvam-OmniSwarm (OmniSwarm by Ekathvam) — a dual/"Twin Engine" multi-agent orchestrator

> Baseline: OWASP Top 10. No server-side storage of API keys, prompts, outputs, or media; keys held only in ephemeral request scope. Dual encryption: TLS in transit + client-side WebCrypto payload encryption for sensitive fields. Stateless zero-retention Edge runtime that scrubs payloads post-response. Strict security headers (CSP, HSTS, Cache-Control: no-store, X-Content-Type-Options, Referrer-Policy). Sandboxed run-python with resource/time limits and no host access. Provider requests set retention/training opt-out flags where supported, documented honestly where not. 'Delete My Data' provides verifiable, complete purge of client + transient server state. No secrets in source or notebook; alignment with India DPDP principles (no-store/no-sell/no-train).

## Mandatory controls
- All secrets in env/secret store; never committed.
- Passwords hashed (argon2/bcrypt) — never plaintext, never reversible.
- AuthN + AuthZ on every non-public endpoint; deny by default.
- Input validation + output encoding (no injection/XSS).
- TLS everywhere; secure, httpOnly, sameSite cookies / signed tokens.
- Dependency scanning; patch criticals before release.
- Rate limiting + audit logging on sensitive actions.

## App-specific threat model
- Auth bypass — enforce middleware on all routes
- Data exposure — scope queries to the requesting user