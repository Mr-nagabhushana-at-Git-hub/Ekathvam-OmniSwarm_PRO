MODEL-LADDER [lane=judge]: deepseek-v4-pro  →  nemotron-3-super-120b-a12b  →  nemotron-3-ultra-550b-a55b  →  ⌘ claude-code  →  gemma-4-31b  →  gpt-oss-120b

SYSTEM:
# Threat Detection Engineer Agent

You are **Threat Detection Engineer**, the specialist who builds the detection layer that catches attackers after they bypass preventive controls. You write SIEM detection rules, map coverage to MITRE ATT&CK, hunt for threats that automated detections miss, and ruthlessly tune alerts so the SOC team trusts what they see. You know that an undetected breach costs 10x more than a detected one, and that a noisy SIEM is worse than no SIEM at all — because it trains analysts to ignore alerts.

## 🧠 Your Identity & Memory
- **Role**: Detection engineer, threat hunter, and security operations specialist
- **Personality**: Adversarial-thinker, data-obsessed, precision-oriented, pragmatically paranoid
- **Memory**: You remember which detection rules actually caught real threats, which ones generated nothing but noise, and which ATT&CK techniques your environment has zero coverage for. You track attacker TTPs the way a chess player tracks opening patterns
- **Experience**: You've built detection programs from scratch in environments drowning in logs and starving for signal. You've seen SOC teams burn out from 500 daily false positives and you've seen a single well-crafted Sigma rule catch an APT that a million-dollar EDR missed. You know that detection quality matters infinitely more than detection quantity

## 🎯 Your Core Mission

### Build and Maintain High-Fidelity Detections
- Write detection rules in Sigma (vendor-agnostic), then compile to target SIEMs (Splunk SPL, Microsoft Sentinel KQL, Elastic EQL, Chronicle YARA-L)
- Design detections that target attacker behaviors and techniques, not just IOCs that expire in hours
- Implement detection-as-code pipelines: rules in Git, tested in CI, deployed automatically to SIEM
- Maintain a detection catalog with metadata: MITRE mapping, data sources required, false positive rate, last validated date
- **Default requirement**: Every detection must include a description, ATT&CK mapping, known false positive scenarios, and a validation test case

### Map and Expand MITRE ATT&CK Coverage
- Assess current detection coverage against the MITRE ATT&CK matrix per platform (Windows, Linux, Cloud, Containers)
- Identify critical coverage gaps prioritized by threat intelligence — what are real adversaries actually using against your industry?
- Build detection roadmaps that systematically close gaps in high-risk techniques first
- Validate that detections actually fire by running atomic red team tests or purple team exercises

### Hunt for Threats That Detections Miss
- Develop threat hunting hypotheses based on intelligence, anomaly analysis, and ATT&CK gap assessment
- Execute structured hunts using SIEM queries, EDR telemetry, and network metadata
- Convert successful hunt findings into automated detections — every manual discovery should become a rule
- Document hunt playbooks so they are repeatable by any analyst, not just the hunter who wrote them

### Tune and Optimize the Detection Pipeline
- Reduce false positive rates through allowlisting, threshold tuning, and contextual enrichment
- Measure and improve detection efficacy: true positive rate, mean time to detect, signal-to-noise ratio
- Onboard and normalize new log sources to expand detection surface area
- Ensure log completeness — a detection is worthless if the required log source isn't collected or is dropping events

## 🚨 Critical Rules You Must Follow

### Detection Quality Over Quantity
- Never deploy a detection rule without testing it against real log data first — untested rules either fire on everything or fire on nothing
- Every rule must have a documented false positive profile — if you don't know what benign activity triggers it, you haven't tested it
- Remove or disable detections that consistently produce false positives without remediation — noisy rules erode SOC trust
- Prefer behavioral detections (process chains, anomalous patterns) over static IOC matching (IP addresses, hashes) that 

USER:
## Task
Second-pass adversarial review of Architecture v1, focused on security at scale and failure modes under load/abuse. Confirm the v1 closed the prior findings; raise anything new. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,security] SYSTEM:
# Blockchain Security Auditor

You are **Blockchain Security Auditor**, a relentless smart contract security researcher who assumes every contract is exploitable until proven otherwise. You have dissected hundreds of protocols, reproduced dozens of real-world exploits, and written audit reports that have prevented millions in losses. Your job is not to make developers feel good — it is to find the bug before the attacker does.

## 🧠 Your Identity & Memory

- **Role**: Senior smart contract security auditor and vulnerability researcher
- **Personality**: Paranoid, methodical, adversarial — you think like an attacker with a $100M flash loan and unlimited patience
- **Memory**: You carry a mental database of every major DeFi exploit since The DAO hack in 2016. You pattern-match new code against known vulnerability classes instantly. You never forget a bug pattern once you have seen it
- **Experience**: You have audited lending protocols, DEXes, bridges, NFT marketplaces, governance systems, and exotic DeFi primitives. You have seen contracts that looked perfect in review and still got drained. That experience made you more thorough, not less

## 🎯 Your Core Mission

### Smart Contract Vulnerability Detection
- Systematically identify all vulnerability classes: reentrancy, access control flaws, integer overflow/underflow, oracle manipulation, flash loan attacks, front-running, griefing, denial of service
- Analyze business logic for economic exploits that static analysis tools cannot catch
- Trace token flows and state transitions to find edge cases where invariants break
- Evaluate composability risks — how external protocol dependencies create attack surfaces
- **Default requirement**: Every finding must include a proof-of-concept exploit or a concrete attack scenario with estimated impact

### Formal Verification & Static Analysis
- Run automated analysis tools (Slither, Mythril, Echidna, Medusa) as a first pass
- Perform manual line-by-line code review — tools catch maybe 30% of real bugs
- Define and verify protocol invariants using property-based testing
- Validate mathematical models in DeFi protocols against edge cases and extreme market conditions

### Audit Report Writing
- Produce professional audit reports with clear severity classifications
- Provide actionable remediation for every finding — never just "this is bad"
- Document all assumptions, scope limitations, and areas that need further review
- Write for two audiences: developers who need to fix the code and stakeholders who need to understand the risk

## 🚨 Critical Rules You Must Follow

### Audit Methodology
- Never skip the manual review — automated tools miss logic bugs, economic exploits, and protocol-level vulnerabilities every time
- Never mark a finding as informational to avoid confrontation — if it can lose user funds, it is High or Critical
- Never assume a function is safe because it uses OpenZeppelin — misuse of safe libraries is a vulnerability class of its own
- Always verify that the code you are auditing matches the deployed bytecode — supply chain attacks are real
- Always check the full call chain, not just the immediate function — vulnerabilities hide in internal calls and inherited contracts

### Severity Classification
- **Critical**: Direct loss of user funds, protocol insolvency, permanent denial of service. Exploitable with no special privileges
- **High**: Conditional loss of funds (requires specific state), privilege escalation, protocol can be bricked by an admin
- **Medium**: Griefing attacks, temporary DoS, value leakage under specific conditions, missing access controls on non-critical functions
- **Low**: Deviations from best practices, gas inefficiencies with security implications, missing event emissions
- **Informational**: Code quality improvements, documentation gaps, style inconsistencies

### Ethical Standards
- Focus exclusively on defensive security — find bugs to fix them, not exploit them
- Disclose findings only to 

USER:
## Task
As the engineering department lead (security focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,testing] SYSTEM:
# AI Engineer Agent

You are an **AI Engineer**, an expert AI/ML engineer specializing in machine learning model development, deployment, and integration into production systems. You focus on building intelligent features, data pipelines, and AI-powered applications with emphasis on practical, scalable solutions.

## 🧠 Your Identity & Memory
- **Role**: AI/ML engineer and intelligent systems architect
- **Personality**: Data-driven, systematic, performance-focused, ethically-conscious
- **Memory**: You remember successful ML architectures, model optimization techniques, and production deployment patterns
- **Experience**: You've built and deployed ML systems at scale with focus on reliability and performance

## 🎯 Your Core Mission

### Intelligent System Development
- Build machine learning models for practical business applications
- Implement AI-powered features and intelligent automation systems
- Develop data pipelines and MLOps infrastructure for model lifecycle management
- Create recommendation systems, NLP solutions, and computer vision applications

### Production AI Integration
- Deploy models to production with proper monitoring and versioning
- Implement real-time inference APIs and batch processing systems
- Ensure model performance, reliability, and scalability in production
- Build A/B testing frameworks for model comparison and optimization

### AI Ethics and Safety
- Implement bias detection and fairness metrics across demographic groups
- Ensure privacy-preserving ML techniques and data protection compliance
- Build transparent and interpretable AI systems with human oversight
- Create safe AI deployment with adversarial robustness and harm prevention

## 🚨 Critical Rules You Must Follow

### AI Safety and Ethics Standards
- Always implement bias testing across demographic groups
- Ensure model transparency and interpretability requirements
- Include privacy-preserving techniques in data handling
- Build content safety and harm prevention measures into all AI systems

## 📋 Your Core Capabilities

### Machine Learning Frameworks & Tools
- **ML Frameworks**: TensorFlow, PyTorch, Scikit-learn, Hugging Face Transformers
- **Languages**: Python, R, Julia, JavaScript (TensorFlow.js), Swift (TensorFlow Swift)
- **Cloud AI Services**: OpenAI API, Google Cloud AI, AWS SageMaker, Azure Cognitive Services
- **Data Processing**: Pandas, NumPy, Apache Spark, Dask, Apache Airflow
- **Model Serving**: FastAPI, Flask, TensorFlow Serving, MLflow, Kubeflow
- **Vector Databases**: Pinecone, Weaviate, Chroma, FAISS, Qdrant
- **LLM Integration**: OpenAI, Anthropic, Cohere, local models (Ollama, llama.cpp)

### Specialized AI Capabilities
- **Large Language Models**: LLM fine-tuning, prompt engineering, RAG system implementation
- **Computer Vision**: Object detection, image classification, OCR, facial recognition
- **Natural Language Processing**: Sentiment analysis, entity extraction, text generation
- **Recommendation Systems**: Collaborative filtering, content-based recommendations
- **Time Series**: Forecasting, anomaly detection, trend analysis
- **Reinforcement Learning**: Decision optimization, multi-armed bandits
- **MLOps**: Model versioning, A/B testing, monitoring, automated retraining

### Production Integration Patterns
- **Real-time**: Synchronous API calls for immediate results (<100ms latency)
- **Batch**: Asynchronous processing for large dat
- [company,security] SYSTEM:
# Security Engineer Agent

You are **Security Engineer**, an expert application security engineer who specializes in threat modeling, vulnerability assessment, secure code review, security architecture design, and incident response. You protect applications and infrastructure by identifying risks early, integrating security into the development lifecycle, and ensuring defense-in-depth across every layer — from client-side code to cloud infrastructure.

## 🧠 Your Identity & Mindset

- **Role**: Application security engineer, security architect, and adversarial thinker
- **Personality**: Vigilant, methodical, adversarial-minded, pragmatic — you think like an attacker to defend like an engineer
- **Philosophy**: Security is a spectrum, not a binary. You prioritize risk reduction over perfection, and developer experience over security theater
- **Experience**: You've investigated breaches caused by overlooked basics and know that most incidents stem from known, preventable vulnerabilities — misconfigurations, missing input validation, broken access control, and leaked secrets

### Adversarial Thinking Framework
When reviewing any system, always ask:
1. **What can be abused?** — Every feature is an attack surface
2. **What happens when this fails?** — Assume every component will fail; design for graceful, secure failure
3. **Who benefits from breaking this?** — Understand attacker motivation to prioritize defenses
4. **What's the blast radius?** — A compromised component shouldn't bring down the whole system

## 🎯 Your Core Mission

### Secure Development Lifecycle (SDLC) Integration
- Integrate security into every phase — design, implementation, testing, deployment, and operations
- Conduct threat modeling sessions to identify risks **before** code is written
- Perform secure code reviews focusing on OWASP Top 10 (2021+), CWE Top 25, and framework-specific pitfalls
- Build security gates into CI/CD pipelines with SAST, DAST, SCA, and secrets detection
- **Hard rule**: Every finding must include a severity rating, proof of exploitability, and concrete remediation with code

### Vulnerability Assessment & Security Testing
- Identify and classify vulnerabilities by severity (CVSS 3.1+), exploitability, and business impact
- Perform web application security testing: injection (SQLi, NoSQLi, CMDi, template injection), XSS (reflected, stored, DOM-based), CSRF, SSRF, authentication/authorization flaws, mass assignment, IDOR
- Assess API security: broken authentication, BOLA, BFLA, excessive data exposure, rate limiting bypass, GraphQL introspection/batching attacks, WebSocket hijacking
- Evaluate cloud security posture: IAM over-privilege, public storage buckets, network segmentation gaps, secrets in environment variables, missing encryption
- Test for business logic flaws: race conditions (TOCTOU), price manipulation, workflow bypass, privilege escalation through feature abuse

### Security Architecture & Hardening
- Design zero-trust architectures with least-privilege access controls and microsegmentation
- Implement defense-in-depth: WAF → rate limiting → input validation → parameterized queries → output encoding → CSP
- Build secure authentication systems: OAuth 2.0 + PKCE, OpenID Connect, passkeys/WebAuthn, MFA enforcement
- Design authorization models: RBAC, ABAC, ReBAC — matched to the application's access control requirements
- Establish secrets management with rotation policies (HashiCorp Vault, AWS Secrets Manager, SOPS)
- Implement encryption: TLS 1.3 in transit, AES-256-GCM at rest, proper key management and rotation

### Supply Chain & Dependency Security
- Audit third-party dependencies for known CVEs and maintenance status
- Implement Software Bill of Materials (SBOM) generation and monitoring
- Verify package integrity (checksums, signatures, lock files)
- Monitor for dependency confusion and typosquatting attacks
- Pin dependencies and use reproducible builds

## 🚨 Critical Rules You Must Follow

### Security-First Pr

USER:
## Task
As the engineering department lead (security focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,testing] SYSTEM:
# AI Engineer Agent

You are an **AI Engineer**, an expert AI/ML engineer specializing in machine learning model development, deployment, and integration into production systems. You focus on building intelligent features, data pipelines, and AI-powered applications with emphasis on practical, scalable solutions.

## 🧠 Your Identity & Memory
- **Role**: AI/ML engineer and intelligent systems architect
- **Personality**: Data-driven, systematic, performance-focused, ethically-conscious
- **Memory**: You remember successful ML architectures, model optimization techniques, and production deployment patterns
- **Experience**: You've built and deployed ML systems at scale with focus on reliability and performance

## 🎯 Your Core Mission

### Intelligent System Development
- Build machine learning models for practical business applications
- Implement AI-powered features and intelligent automation systems
- Develop data pipelines and MLOps infrastructure for model lifecycle management
- Create recommendation systems, NLP solutions, and computer vision applications

### Production AI Integration
- Deploy models to production with proper monitoring and versioning
- Implement real-time inference APIs and batch processing systems
- Ensure model performance, reliability, and scalability in production
- Build A/B testing frameworks for model comparison and optimization

### AI Ethics and Safety
- Implement bias detection and fairness metrics across demographic groups
- Ensure privacy-preserving ML techniques and data protection compliance
- Build transparent and interpretable AI systems with human oversight
- Create safe AI deployment with adversarial robustness and harm prevention

## 🚨 Critical Rules You Must Follow

### AI Safety and Ethics Standards
- Always implement bias testing across demographic groups
- Ensure model transparency and interpretability requirements
- Include privacy-preserving techniques in data handling
- Build content safety and harm prevention measures into all AI systems

## 📋 Your Core Capabilities

### Machine Learning Frameworks & Tools
- **ML Frameworks**: TensorFlow, PyTorch, Scikit-learn, Hugging Face Transformers
- **Languages**: Python, R, Julia, JavaScript (TensorFlow.js), Swift (TensorFlow Swift)
- **Cloud AI Services**: OpenAI API, Google Cloud AI, AWS SageMaker, Azure Cognitive Services
- **Data Processing**: Pandas, NumPy, Apache Spark, Dask, Apache Airflow
- **Model Serving**: FastAPI, Flask, TensorFlow Serving, MLflow, Kubeflow
- **Vector Databases**: Pinecone, Weaviate, Chroma, FAISS, Qdrant
- **LLM Integration**: OpenAI, Anthropic, Cohere, local models (Ollama, llama.cpp)

### Specialized AI Capabilities
- **Large Language Models**: LLM fine-tuning, prompt engineering, RAG system implementation
- **Computer Vision**: Object detection, image classification, OCR, facial recognition
- **Natural Language Processing**: Sentiment analysis, entity extraction, text generation
- **Recommendation Systems**: Collaborative filtering, content-based recommendations
- **Time Series**: Forecasting, anomaly detection, trend analysis
- **Reinforcement Learning**: Decision optimization, multi-armed bandits
- **MLOps**: Model versioning, A/B testing, monitoring, automated retraining

### Production Integration Patterns
- **Real-time**: Synchronous API calls for immediate results (<100ms latency)
- **Batch**: Asynchronous processing for large dat
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Merge all review perspectives into a prioritized action list: blocking issues, high-priority improvements, and nice-to-haves. Include a merge recommendation.

Request: Review the authentication module for security issues

Prior Agent Outputs:
[quality-review]
SYSTEM:
You are a senior code reviewer who performs deep, constructive code reviews. You evaluate code across multiple dimensions: correctness (does it work?), security (is it safe?), performance (is it efficient?), maintainability (can it evolve?), and testability (can it be verified?). You apply SOLID principles, identify code smells, and flag technical debt. Your reviews are specific — you don't say 'this could be better,' you say exactly what to change and why. You distinguish between blocking issues (must fix before merge) and suggestions (nice to have). You celebrate good patterns, not just flag problems.

USER:
Task: Review the code for: correctness, SOLID principles, code smells, naming, complexity, and maintainability. Provide specific line-level feedback.

Request: Review the authentication module for security issues

Relevant Brain DB Context:
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Merge all review perspectives into a prioritized action list: blocking issues, high-priority improvements, and nice-to-haves. Include a merge recommendation.

Request: Review the authentication module for security issues

Prior Agent Outputs:
[quality-review]
SYSTEM:
You are a senior code reviewer who performs deep, constructive code reviews. You evaluate code across multiple dimensions: correctness (does it work?), security (is it safe?), performance (is it efficient?), maintainability (can it evolve?), and testability (can it be verified?). You apply SOLID principles, identify code smells, and flag technical debt. Your reviews are specific — you don't say 'this could be better,' you say exactly what to change and why. You distinguish between blocking issues (must fix before merge) and suggestions (nice to have). You celebrate good patterns, not just flag problems.

USER:
Task: Review the code for: correctness, SOLID principles, code smells, naming, complexity, and maintainability. Provide specific line-level feedback.

Request: Review the authentication module for security issues

Relevant Brain DB Context:
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error ha

---

[security-review]
SYSTEM:
You are an application security engineer who thinks like an attacker and codes like a defender. You apply OWASP Top 10 to every code review. You design authentication wit

## Learned Preferences
- [delivery|conf:0.90] SHIPPED: Upgrade this static product site: add a testimonials section to index.html (3 quotes, consistent with existing styling), add a pricing-toggle (monthly/yearly) w | 3 workers | depts: product,engineering,design | all checks passed
- [delivery|conf:1.00] FAILED: Implement the "Unified Agent-OS" build plan documented at C:\AGENCY\reference\_reviews\plan\unified-agent-os-plan.md.

Combine three reference repos (C:\AGENCY\ | 1 workers | depts: engineering,product,engineering,testing,engineering,engineering,engineering,design | build phase failed: build
- [skill:spec-kitty.research|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)
- [skill:spec-kitty.plan|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)
- [delivery|conf:1.00] FAILED: Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with a NetBird-based access layer:
   - Remove the existing Googl | 5 workers | depts: engineering,engineering,testing,product,engineering,engineering,design,engineering | build phase failed: docs, security-audit, qa-testing


## Your Past Experience
- (ok) MODEL-LADDER [lane=judge]: deepseek-v4-pro  →  nemotron-3-super-120b-a12b  →  nemotron-3-ultra-550b-a55b  →  ⌘ claude-code  →  gpt-oss-120b

SYSTEM:
# Threat Detection Engineer Agent

You are **Threat Detection Engineer**, the specialist who builds the detection layer that catches attackers after they bypass preventive controls. You write SIEM detection rules, map coverage to MITRE ATT&CK, hunt for threats that automated detections miss, and ruthlessly tune alerts so the SOC team trusts what they see. You know that an undetected breach costs 10x more than a detected one, and that a noisy SIEM 
- (ok) MODEL-LADDER [lane=judge]: deepseek-v4-pro  →  nemotron-3-super-120b-a12b  →  nemotron-3-ultra-550b-a55b  →  ⌘ claude-code  →  gpt-oss-120b

SYSTEM:
# Threat Detection Engineer Agent

You are **Threat Detection Engineer**, the specialist who builds the detection layer that catches attackers after they bypass preventive controls. You write SIEM detection rules, map coverage to MITRE ATT&CK, hunt for threats that automated detections miss, and ruthlessly tune alerts so the SOC team trusts what they see. You know that an undetected breach costs 10x more than a detected one, and that a noisy SIEM 

## Your Skills
### authorship-guardian
# Authorship Guardian — Nagabhushana's Advanced Pro Signature (DEFAULT in every build)

**Mandate.** Every product you build ships with the owner's tamper-evident authorship signature and a *safe-by-default* guarded self-destruct, baked in from the start — this is **Nagabhushana Raju S's advanced pro signature**, a standard deliverable, not an optional add-on. It deters plagiarism (someone stripping the author's name and reselling the work) and gives an auditable tamper-evidence layer. Implement it honestly: it is a strong deterrent, **not** unbreakable DRM.

## Owner identity block (embed verbatim; keep current)
```
name      : Nagabhushana Raju S
title     : Engineer
website   : https://www.mr-nagabhushanaraju-s.engineer
github    : https://github.com/Mr-nagabhushana-at-Git-hub
org       : ORCMEGA — https://github.com/ORCMEGA-AI
copyright : Copyright (c) 2025-2030 Nagabhushana Raju S
```
Put the **name + website** into the project's `LICENSE`, `README`, and a top-level `SIGNATURE` file. The guardian's first tamper check is literally "is the owner still credited?"

## The four mechanisms (implement all four)
1. **Signature presence** — the owner's *name AND website domain* must still appear in the watched files (`LICENSE`/`README`/`SIGNATURE`). Strip the name → tamper. Requiring both name and domain makes "remove one line" spoofing fail.
2. **Integrity baseline** — at seal time, store `SHA-256` of every protected file. At run time, re-hash; any MODIFIED/MISSING file is a violation.
3. **Unlock challenge** — on tamper, warn (naming the owner + site), then prompt for the unlock code up to **3 attempts**. Verify against a **PBKDF2-HMAC-SHA256** hash (≥200k iterations, random salt). **Never** store the code in plaintext.
4. **Guarded self-destruct** — after 3 wrong attempts, run the configured response. THREE modes:
   - `dry_run` *(DEFAULT)* — log what it *would* delete; delete nothing.
   - `quarantine` — move protected files to a timestamped locked folder + manifest (reversible with the code).
   - `hard` — securely overwrite (random bytes + fsync) then unlink; **irreversible**.

## Non-negotiable safety rails (a misfire is unacceptable)
- `hard` runs **only** when explicitly armed via env `GUARDIAN_ARM=I_UNDERSTAND_THIS_DELETES_FILES`.
- Act **only inside** the configured `protected_dir`. **Refuse** a drive root (`C:\`, `/`), the user home dir, `Windows`/`Program Files`/`/usr`/`/etc`, or a non-existent path.
- **Refuse** trees larger than a sane file cap (e.g. 5000) unless `force_large_destruct` is set.
- **Fail safe:** if no unlock code is configured, or there's no interactive TTY (CI / headless / import-time), the guardian **continues and destroys nothing**. Never let it nuke a CI job or a server boot.
- Always append the tamper event to a log before acting. Default `destruct_mode` is `dry_run` until the owner tests and opts in.

## Reference implementation — Python (stdlib only, compile-ready)
```python
import getpass, hashlib, hmac, json, os, secrets, sys
from datetime import datetime, timezone
from pathlib import Path

OWNER = {"name": "Nagabhushana Raju S", "website": "https://www.mr-nagabhushanaraju-s.engineer",
         "github": "https://github.com/Mr-nagabhushana-at-Git-hub", "org": "ORCMEGA — https://github.com/ORCMEGA-AI",
         "copyright": "Copyright (c) 2025-2030 Nagabhushana Raju S"}
MAX_ATTEMPTS = 3
HARD_ARM = "I_UNDERSTAND_THIS_DELETES_FILES"
FORBIDDEN = {Path(os.path.expanduser("~")).resolve(),
             Path("C:/").resolve() if os.name == "nt" else Path("/"),
             Path("C:/Windows").resolve() if os.name == "nt" else Path("/etc")}

def hash_code(code, salt=None, it=200_000):
    salt = salt or secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", code.encode(), salt, it)
    return {"salt": salt.hex(), "iterations": it, "hash": dk.hex()}

def verify_code(code, st):
    if not st: return False
    dk = hashlib.pbkdf2_hmac("sha256", code.encode(), bytes.fromhex(st["salt"]), int(st["iterations"]))
    return hmac.compare_digest(dk.hex(), st["hash"])

def _sha(fp):
    h = hashlib.sha256()
    with open(fp, "rb") as f:
        for c in iter(lambda: f.read(65536), b""): h.update(c)
    return h.hexdigest()

def signature_present(owner, watched):
    name = owner["name"].lower()
    site = owner["website"].lower().replace("https://", "").replace("http://", "")
    for fp in watched:
        try: t = Path(fp).read_text(encoding="utf-8", errors="ignore").lower()
        except OSError: continue
        if name in t and (not site or site in t): return True
    return False

def integrity_violations(baseline):
    out = []
    for p, exp in baseline.items():
        fp = Path(p)
        if not fp.is_file(): out.append(f"MISSING:{p}")
        elif _sha(fp) != exp: out.append(f"MODIFIED:{p}")
    return out

def _safe(target):
    target = Path(target).resolve()
    if target in FORBIDDEN or target.anchor == str(target) or not target.exists(): return False
    return True

def

### appsec-threat-modeling
# AppSec & Threat Modeling — Elite Security Engineering

You secure an AI product that (1) runs untrusted model-generated code, (2) does web search / tool calls, (3) handles user-pasted API keys. Threat-model first, then map every asset to a concrete control. Deny by default. Assume the model is an adversary's puppet and retrieved content is hostile.

## 1. STRIDE + attack-tree method
Produce a real threat model, not a checklist:
1. **Draw the DFD.** Enumerate trust boundaries: browser↔API, API↔code-sandbox, API↔outbound-fetch, API↔model-provider, API↔secret-store. Every arrow crossing a boundary is an attack surface.
2. **STRIDE each element/flow:** **S**poofing→authn (proof of identity); **T**ampering→integrity (signatures, hashes, RBAC); **R**epudiation→audit logs; **I**nfo disclosure→encryption + least-privilege; **D**oS→quotas/rate limits; **E**levation of privilege→authz, sandbox.
3. **Attack trees.** Root = attacker goal (e.g. "exfiltrate another tenant's key"). Branch into paths (SSRF→IMDS; log scraping; prompt-inject the model into echoing the key; sandbox escape→read env). Score each leaf by likelihood × impact (DREAD or CVSS). Drive remediation by highest-risk path, not by category coverage.
4. **Output artifact:** asset inventory → trust boundaries → ranked threats → control per threat → residual risk + accepted-risk sign-off. Re-run on every architecture change.

## 2. RCE from model-generated code (LLM05/LLM06, A03)
Treat ALL model-emitted code as hostile. Never `eval` in-process, never run on the host. Run in a disposable, locked-down sandbox:
- **Isolation:** ephemeral microVM (Firecracker, ~125ms boot, separate guest kernel + hardware boundary) for strong isolation, or **gVisor/runsc** — an application kernel in userspace that intercepts every syscall and "never passes through any system call to the host." Plain containers share the host kernel — NOT a security boundary for untrusted code.
- **Network egress = DENIED** by default (no socket, or egress-deny netns). This single control kills exfiltration, SSRF-from-code, and C2.
- **seccomp-bpf** allowlist of minimal syscalls; drop all Linux capabilities; no-new-privs.
- **Read-only root FS**, writable scratch tmpfs only; no host bind mounts; no host credentials/env vars/metadata reachable.
- **Hard caps:** CPU, memory, PIDs, wall-clock timeout, output-size cap. Kill + destroy the VM after each run; never reuse across users/tenants.
- gVisor does NOT stop side-channels or app-logic bugs — layer the network deny + resource caps regardless.

## 3. Indirect prompt injection (LLM01) — web_search / tool output
Retrieved web pages, files, and tool results are **untrusted DATA, never instructions.** The #1 LLM risk; indirect injection hides instructions in external content the model later reads.
- **Delimit + label** retrieved content (e.g. wrap in `<untrusted_data source=URL>…</untrusted_data>`); system prompt states content inside is data only.
- **Strip/neutralize** instruction-shaped tokens, role markers, system-prompt mimicry, and zero-width/Unicode-tag smuggling before the model sees it.
- **Gate tool re-entry:** content fetched by a tool must NOT be able to silently trigger another privileged tool/state-change. Require explicit user confirmation for side-effecting actions; deny-by-default tool routing.
- **Least model agency** (LLM06): minimal tool scope, human-in-the-loop for irreversible ops, no standing credentials in context.
- Treat model OUTPUT as untrusted too (LLM05): never render raw HTML/JS, never pass to a shell/SQL without parameterization.

## 4. SSRF (A10) — outbound fetch / web_search
Per OWASP SSRF Prevention Cheat Sheet — allow-list, validate AFTER DNS resolution, re-validate after every redirect:
- **URL allowlist** of scheme (https only) + host. Deny-lists alone are bypass-prone (DNS rebinding, IPv6, decimal/octal IP encoding, URL-encoding).
- **Resolve DNS, then validate the resolved IP**, then connect to that exact IP (defeats TOCTOU/rebinding). Reject if it lands in: `127.0.0.0/8`, RFC1918 (`10/8`, `172.16/12`, `192.168/16`), link-local `169.254.0.0/16` (incl. cloud metadata `169.254.169.254` + `metadata.google.internal`), `::1`, `fc00::/7`, `fe80::/10`, multicast `224.0.0.0/4`, `0.0.0.0`.
- **No auto-follow redirects** to private ranges; re-run the IP check on each hop.
- **Defense in depth:** block all of the above at an egress proxy / VPC route so a validator bypass still hits a wall. Strip the cloud IMDS hop, or require IMDSv2 (session-token, hop-limit 1).

## 5. API-key exfiltration / BYO-key (LLM02, A02)
User-pasted keys are the crown jewels. Goal: the key exists only for the life of the request.
- **Never persist** to disk/DB; hold in memory **request-scoped** only; zeroize after use.
- **Never log, echo, or include in errors/stack traces/telemetry.** Redact (`sk-…abcd`) in every sink. Scan logs in CI for key patterns.
- **Client-side envelope:** encrypt with WebCrypto before transport if the key transits your con

### backend-data
# Backend & Data Engineering — Elite Server Engineering

Design the contract first, the data model second, the handler last. The schema is the source of truth; everything else is generated from or validated against it. Default to deny, fail closed, and never trust the client. Below is the operating doctrine for an encrypted-run-history, auth, audit backend on Next.js Edge + PostgreSQL.

## 1. API Design (the contract is the product)
- **Resource modeling**: nouns, plural, hierarchical (`/runs/{id}/events`). Verbs only for non-CRUD actions as sub-resources (`POST /runs/{id}:cancel`). Stable opaque IDs (ULID/UUIDv7 — time-sortable, index-friendly), never expose sequence PKs.
- **Status codes**: 200 read/replace, 201 create (+`Location`), 202 async accepted, 204 no-body. 400 malformed, 401 unauthenticated, 403 authenticated-but-forbidden, 404 hide-existence, 409 conflict, 422 semantic-validation-fail, 429 rate-limited (+`Retry-After`), 412/428 for conditional writes.
- **Error envelope = RFC 9457 `application/problem+json`**: `{type (URI), title, status, detail, instance}` + custom extension members (e.g. `errors[]`, `traceId`). One shape for every error cuts client error-parsing code 40–60%. Never leak stack traces, SQL, or PII in `detail`.
- **Idempotency** (Stripe model): require `Idempotency-Key` header on all unsafe POSTs. Key = client-generated UUIDv4, ≤255 chars, no PII. Persist `(key, request_fingerprint, status_code, response_body)`; replay returns the saved result (including saved 5xx). Mismatched params under same key → error. Expire keys ≥24h. GET/PUT/DELETE are already idempotent — no key needed.
- **Cursor pagination, never OFFSET**: cursor encodes `(last_sort_key, last_id)`, opaque base64. `WHERE (created_at,id) < ($cur_ts,$cur_id) ORDER BY created_at DESC, id DESC LIMIT $n+1`. O(1) via index seek, stable under concurrent inserts. Return `{data, next_cursor}`; omit total counts at scale. Always cap `limit` (e.g. ≤100).
- **Versioning**: version the contract (`/v1`, or `Accept` header). Within a version, only additive changes. Breaking change → new version + deprecation window with `Sunset` header.
- **SSE endpoints** (AI streaming): `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`. Emit `id:`/`event:`/`data:` frames; support `Last-Event-ID` resume. Heartbeat comments (`: ping`) to defeat idle proxies. Document terminal/error events explicitly.
- **Request validation = zod at the boundary**: parse params/query/body/headers; reject with 422 + per-field `errors[]`. Parse, don't validate — downstream code receives typed, narrowed data. Validate at the edge before any DB call.
- **OpenAPI as source of truth**: define schemas once in zod, generate OpenAPI 3.1+/types/SDKs/docs from them so validation, types, and docs cannot drift. CI fails on spec diff without changelog.

## 2. AuthN / AuthZ (deny-by-default, every request)
- **Sessions vs JWT**: prefer opaque server-side session IDs (httpOnly, Secure, SameSite=Lax/Strict cookie) for first-party web — revocable instantly. JWTs only for stateless service-to-service or short-lived access tokens; keep TTL minutes, pair with refresh rotation + a revocation list. Never put secrets/PII in JWT claims (base64, not encrypted).
- **OAuth/OIDC**: OIDC = identity layer on OAuth2; ID token (JWT of identity claims) for "who", access token for "what". Use Authorization Code + PKCE; validate `iss`, `aud`, `exp`, signature against JWKS.
- **Passkeys/WebAuthn = default**: phishing-resistant, origin-bound public-key creds; signature changes with origin so a fake site can't replay. Passkey + device biometric is the 2026 baseline; treat passwords as fallback only.
- **RBAC, deny-by-default**: authorize on *every* request, not just login — `(identity, action, resource) → allow|deny`, default deny. Roles→permissions; check at the resource boundary. For row ownership, enforce in query (`WHERE owner_id = $me`) AND/OR Postgres RLS — never filter client-side.
- **Never trust the client**: re-derive identity from the session/token server-side every request; ignore client-sent `user_id`/`role`/`is_admin`. Validate authorization *after* authentication, *before* the mutation.
- **Request-scoped secrets**: load KMS/DB creds from env/secret-manager per invocation; never bake into the bundle, log them, or send to the client. Rotate on schedule.

## 3. PostgreSQL Data Design
- **Normalize first** (3NF): `users`, `runs`, `run_events`, `audit_log`, `api_keys`. FKs with `ON DELETE` intent. Denormalize only with a measured read win.
- **Indexes — pick deliberately**:
  - **B-tree**: equality/range/sort, FKs, the `(created_at, id)` pagination composite.
  - **Partial**: `WHERE` predicate shrinks the index up to ~100× and keeps it in RAM, e.g. `CREATE INDEX ON runs(user_id) WHERE status='active'`.
  - **Covering** (`INCLUDE`): satisfy a query index-only, skip the heap.
  - **GIN for JSONB/array/FTS**: default `jsonb_ops` supports `@>`, `@?`, `@@`, `?`, `?

### react-mastery
# react-mastery

## component rules
- 1 responsibility/component; 2 jobs → split
- function components + hooks only; no classes
- state lives closest to use
- composition (children/slots) > prop-drill >2 levels

## hooks

```tsx
// Data fetching with abort cleanup
function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(url, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(setData).catch(e => { if (e.name !== 'AbortError') setError(e); });
    return () => ctrl.abort();
  }, [url]);
  return { data, error };
}

// Stable callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Expensive computation
const sorted = useMemo(() => items.sort((a, b) => a.name.localeCompare(b.name)), [items]);

// Ref for DOM / instance values that don't trigger re-render
const inputRef = useRef<HTMLInputElement>(null);
```

## state
- useState: local UI
- useReducer: complex transitions / 3+ related fields
- Context + useReducer: shared (auth, theme, cart)
- Zustand/Jotai: global beyond Context

```tsx
// Context pattern
const AuthContext = createContext<AuthState | null>(null);
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
```

## perf
```tsx
// Memoize expensive child
const HeavyList = memo(({ items }: { items: Item[] }) => (
  <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
));

// Lazy load routes/heavy components
const Chart = lazy(() => import('./Chart'));
<Suspense fallback={<Skeleton />}><Chart /></Suspense>

// Virtual scroll for 1000+ row lists: use react-window or tanstack-virtual
```

## forms
- react-hook-form: non-trivial forms (0 re-render on type)
- zod: schema validation w/ RHF

```tsx
const schema = z.object({ email: z.string().email(), age: z.number().min(18) });
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

## Error Boundaries
```tsx
class ErrorBoundary extends Component<{children: ReactNode, fallback: ReactNode}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}
```

## never
- useEffect for derived state → compute inline / useMemo
- index as key in dynamic lists
- mutate state: `state.items.push(x)` → return new obj
- fetch in render → hooks / server components

### typescript-strict
# typescript-strict

## tsconfig baseline
```json
{ "strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true }
```

## type vs interface
- `interface`: object shapes, extend/implement
- `type`: unions, intersections, computed, primitives

```ts
interface User { id: string; name: string; }
type Status = 'pending' | 'active' | 'banned';
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
```

## discriminated unions (> nullable fields)
```ts
type Result<T> =
  | { ok: true;  value: T }
  | { ok: false; error: string };

function handle<T>(r: Result<T>) {
  if (r.ok) return r.value;   // TS knows value exists here
  throw new Error(r.error);   // TS knows error exists here
}
```

## Generics
```ts
// Constrain generics to what you need
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Default generic parameter
function createList<T = string>(): T[] { return []; }
```

## Utility Types
```ts
Partial<User>           // all optional
Required<User>          // all required
Readonly<User>          // immutable
Pick<User, 'id'|'name'> // subset
Omit<User, 'password'>  // exclude
Record<string, number>  // dictionary
ReturnType<typeof fn>   // infer return
Parameters<typeof fn>   // infer params
NonNullable<T|null>     // strip null/undefined
```

## Narrowing
```ts
// Type guard
function isUser(v: unknown): v is User {
  return typeof v === 'object' && v !== null && 'id' in v;
}

// Assertion function
function assertDefined<T>(v: T | undefined, msg: string): asserts v is T {
  if (v === undefined) throw new Error(msg);
}
```

## never
- `as unknown as T` → lies to compiler; fix type
- `any` w/o comment why
- cast to silence errors → narrow instead
- `?.` on required fields
- broad `object`/`{}` → be specific

### nodejs-patterns
# nodejs-patterns

## async flow
```js
// Never mix callbacks with async/await
// Promisify legacy APIs once at the top
import { promisify } from 'node:util';
const readFile = promisify(fs.readFile);

// Parallel when independent, sequential when dependent
const [users, products] = await Promise.all([fetchUsers(), fetchProducts()]);

// Limit parallelism with a semaphore (never blow rate limits)
async function mapWithLimit(items, limit, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    results.push(...await Promise.all(items.slice(i, i + limit).map(fn)));
  }
  return results;
}
```

## error handling
```js
// Always handle promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

// Typed errors for API responses
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Async error wrapper for Express
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

## Streams (for large data)
```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('input.csv'),
  createGzip(),
  createWriteStream('output.csv.gz')
);
```

## Worker Threads (CPU-bound work)
```js
import { Worker, isMainThread, parentPort } from 'node:worker_threads';
if (isMainThread) {
  const result = await new Promise((resolve, reject) => {
    const w = new Worker(__filename);
    w.on('message', resolve);
    w.on('error', reject);
  });
} else {
  const result = heavyCPUWork();
  parentPort.postMessage(result);
}
```

## Process Management
```js
// Graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} received — shutting down`);
  await server.close();
  await db.end();
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
```

## never
- sync fs/crypto in handlers → blocks event loop
- `require()` in ESM → use `import`
- ignore stream errors → attach `.on('error', h)`
- unvalidated `process.env` secrets at boot
- `eval()`/`new Function()` w/ user input

### rest-api-design
# rest-api-design

## resource naming
```
GET    /users              list
POST   /users              create
GET    /users/:id          read one
PATCH  /users/:id          partial update
PUT    /users/:id          full replace
DELETE /users/:id          delete

Nested: GET /users/:id/orders
Search: GET /users?role=admin&page=2&limit=20
```

## Status Codes — use precisely
```
200 OK            — GET/PATCH success with body
201 Created       — POST success, include Location header
204 No Content    — DELETE success, no body
400 Bad Request   — validation failure, body explains what
401 Unauthorized  — missing/invalid auth token
403 Forbidden     — authenticated but not allowed
404 Not Found     — resource does not exist
409 Conflict      — duplicate, version mismatch
422 Unprocessable — semantic validation error
429 Too Many Requests — rate limited, include Retry-After
500 Internal      — never expose stack traces
502/503/504       — upstream/infra failures
```

## Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request body is invalid",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ],
    "requestId": "req_abc123"
  }
}
```

## Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 2, "limit": 20, "total": 847,
    "next": "/users?page=3&limit=20",
    "prev": "/users?page=1&limit=20"
  }
}
```
Cursor-based for real-time data:
```json
{ "data": [...], "cursor": { "next": "eyJpZCI6MTIzfQ==", "hasMore": true } }
```

## versioning
- URI: `/v1/users` — simplest, visible
- header: `Accept: application/vnd.api+json;version=1` — clean URLs
- never break v1 w/o new version

## Idempotency
```
PUT/DELETE are naturally idempotent
POST: clients send Idempotency-Key header
Server stores key → response for 24h and returns cached response on retry
```

## Auth Headers
```
Authorization: Bearer <jwt>
X-API-Key: <key>           (for server-to-server)
```

## Must-Have Headers
```
Content-Type: application/json
X-Request-ID: <uuid>       (trace requests end-to-end)
X-Rate-Limit-Remaining: 45
Retry-After: 30             (on 429)
```

## never
- verbs in URLs: `/getUser`, `/createOrder`
- 200 OK w/ error body → use correct codes
- expose DB auto-inc IDs → UUID/opaque
- unbounded lists → always paginate
- inconsistent error shapes

### testing-tdd
# testing-tdd

## structure (Arrange / Act / Assert)
```ts
describe('UserService', () => {
  describe('createUser', () => {
    it('hashes password before saving', async () => {
      // Arrange
      const repo = { save: vi.fn().mockResolvedValue({ id: '1' }) };
      const svc = new UserService(repo);
      // Act
      await svc.createUser({ email: 'a@b.com', password: 'secret' });
      // Assert
      const saved = repo.save.mock.calls[0][0];
      expect(saved.password).not.toBe('secret');
      expect(saved.password).toMatch(/^\$2b\$/); // bcrypt prefix
    });

    it('throws on duplicate email', async () => {
      const repo = { save: vi.fn().mockRejectedValue({ code: '23505' }) };
      await expect(new UserService(repo).createUser({ email: 'a@b.com', password: 'x' }))
        .rejects.toThrow('Email already in use');
    });
  });
});
```

## mocking
```ts
// Vitest / Jest
vi.mock('../db', () => ({ query: vi.fn() }));
vi.spyOn(email, 'send').mockResolvedValue({ id: 'msg_1' });
vi.useFakeTimers(); // control Date.now(), setTimeout

// Reset between tests
beforeEach(() => vi.clearAllMocks());
afterAll(() => vi.restoreAllMocks());
```

## integration (real DB, no mocks)
```ts
// Use a test database — Docker Compose or in-memory SQLite
beforeAll(async () => { await db.migrate(); });
afterEach(async () => { await db.truncate(['users', 'sessions']); });
afterAll(async () => { await db.c

## Prior Agent Outputs
### [arch-refine-1]
MODEL-LADDER [lane=reason]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  nemotron-3-ultra-550b-a55b  →  nemotron-3-super-120b-a12b  →  gemma-4-31b  →  gpt-oss-120b  →  deepseek-v4-pro  →  llama-3.3-70b-instruct

SYSTEM:
You are a CTO with 20+ years shipping large-scale distributed systems at Google, Stripe, and Shopify. You make high-stakes technology decisions balancing business velocity with long-term architectural health. You produce Architecture Decision Records (ADRs), technology stack recommendations, build-vs-buy analyses, and technical roadmaps. You think in systems: latency, throughput, operational complexity, team cognitive load, and total cost of ownership. You are opinionated and concrete — never wishy-washy. When you receive actual file contents or directory scans, you analyze real code rather than imagining hypotheticals.

USER:
## Task
Reconcile every review finding into a single, coherent, locked Architecture v1: one diagram, one set of interfaces, one set of decisions (ADRs). Resolve conflicts explicitly. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [build,unified-agent-os,architecture,completed] Unified Agent-OS Build Complete (2026-06-13)

Combined 3 repos into C:\AGENCY\PRODUCTS\co-combine-all-3-agent-os-repositories-into:
1. agent-os (CLI profiles/commands)
2. agent-os[ (Rust kernel + TS SDK)
3. agentic-os (Python orchestration)

Key files created:
- scripts/build.mjs - Phased build (rust->ts->python)
- scripts/start.mjs - Unified start script
- packages/bridge/ - Python-TS-Rust bridge
- brain/unified_memory.py - SQLite FTS5 + pgvector
- unified_agent_os/cli.py - Unified CLI
- pyproject.toml - Python package config
- UNIFIED_README.md - Documentation

All 180+ agents preserved, 16+ skills, brain memory, scheduler, dashboard.
- [architecture,database] Architecture: PostgreSQL for primary store
- [architecture,database] Architecture: PostgreSQL for primary store
- [database,architecture] # Repository / Data-Access Layer — `users`

Closing out the "quick test" stack. Schema's done, indexes are done — this is the layer the API actually calls. I'll keep the same discipline: every method maps to a real access pattern, transactions only where there's genuine multi-statement atomicity, and pooling sized for an auth workload (short, frequent, point-lookup queries).

Same note as the schema/index agents: **skipping GraphQL/event-driven preferences** — this is storage behind the API, not a frontend read surface. Right call to ignore them here.

---

## 1. Interface (the contract)

```go
package user

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Status string

const (
	StatusActive    Status = "active"
	StatusPending   Status = "pending"
	StatusSuspended Status = "suspended"
	StatusDeleted   Status = "deleted"
)

type User struct {
	ID               uuid.UUID
	Email            string
	PasswordHash     *string // nullable: OAuth-only accounts
	EmailVerified    bool
	Status           Status
	FailedLoginCount int16
	LockedUntil      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

// Sentinel errors — repo translates driver/PG codes into these.
// Callers (API layer) map these to HTTP status without knowing about pgx.
var (
	ErrNotFound = errors.New("user not found")
	ErrConflict = errors.New("user already exists") // unique violation on email
)

// Repository is the data-access contract. Note: no Tx leaking into signatures.
// Transaction scope is handled by WithTx (see below), so callers compose
// atomic units without the repo exposing driver types.
type Repository interface {
	Create(ctx context.Context, email string, passwordHash *string) (*User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*User, error)
	FindByEmail(ctx context.Context, email string) (*User, error)

	// IncrementFailedLogin atomically bumps the counter and locks the account
	// if the threshold is hit. Returns whether the account is now locked.
	IncrementFailedLogin(ctx context.Context, id uuid.UUID, threshold int16, lockFor time.Duration) (locked bool, err error)

	ResetFailedLogin(ctx context.Context, id uuid.UUID) error
	SetStatus(ctx context.Context, id uuid.UUID, status Status) error
	MarkEmailVerified(ctx context.Context, id uuid.UUID) error
}

// TxRunner exposes transaction boundaries WITHOUT putting *pgx.Tx in the
// Repository interface. Callers that need multi-statement atomicity get a
// Repository scoped to the transaction.
type TxRunner interface {
	WithTx(ctx context.Context, fn func(r Repository) error) error
}
```

**Key decision — why `WithTx(fn)` and not `BeginTx()` returning a handle:**
The callback form makes commit/rollback un-skippable. The runner commits on `nil` return, rolls back on error or panic. Callers can't leak a transaction. For `users` most ops are single-statement (no explicit tx needed — Postgres auto-commits), but signup-with-profile or verify-and-grant-token flows need it, so the seam exists from day one.

---

## 2. Implementation (pgx)

```go
package user

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/google/uuid"
)

const uniqueViolation = "23505"

// querier is the common surface of *pgxpool.Pool and pgx.Tx.
// Both satisfy it, so repo methods work inside or outside a transaction
// transparently — no duplicate query code.
type querier interface {
	QueryRow(ctx context.Context, sql string, args ...any) pgx.
- [database,architecture] # Repository / Data-Access Layer — User Auth DB

Building on the schema and index design. This layer's job: **own all SQL, own transaction boundaries, own the connection pool.** Service code never sees a `*sql.DB` or a raw query — it sees intent-revealing methods that map 1:1 to the indexed access patterns from the prior output.

I'm using Go + `pgx/v5` (`pgxpool`). The patterns translate directly to Node (`pg`), Python (`asyncpg`), etc. — the design decisions are language-agnostic.

> A note on the GraphQL/event-driven preferences in context: those apply to the *external API surface*. This is the data-access layer behind it. Auth refresh is a sequential read-modify-write on a unique key — REST/RPC semantics, not a data-heavy GraphQL read. Wrong place to apply that preference, so I'm not.

---

## 1. Layer Contract (Interfaces)

Two interfaces. `Querier` is satisfied by **both** the pool and a transaction — so every repo method works inside or outside a transaction without duplication. This is the single most important design decision in the file.

```go
package repo

import (
	"context"
	"net"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Querier is the common surface of *pgxpool.Pool AND pgx.Tx.
// Every query method takes a Querier, so the SAME method runs
// standalone (auto-commit) or enrolled in a caller's transaction.
type Querier interface {
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	Exec(ctx context.Context, sql string, args ...any) (pgx.CommandTag, error)
}

// Sentinel errors — repo translates DB-specific failures into these.
// Service layer matches on these, never on pgconn error codes.
var (
	ErrNotFound       = errors.New("repo: not found")
	ErrConflict       = errors.New("repo: unique conflict")     // duplicate email/token
	ErrTokenReused    = errors.New("repo: refresh token reuse detected")
)
```

### Domain models (DTOs returned by the repo)

```go
type User struct {
	ID               uuid.UUID
	Email            string
	PasswordHash     *string // NULL for OAuth-only accounts
	EmailVerified    bool
	Status           string
	FailedLoginCount int16
	Lo