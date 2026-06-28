# Agile Methodology — Ekathvam-OmniSwarm (OmniSwarm by Ekathvam) — a dual/"Twin Engine" multi-agent orchestrator

ORCMEGA runs an agile, iteration-based delivery model.

## Loop
1. **Plan** — pull tasks from `progress-tracker.md` for the milestone.
2. **Build** — departments execute in parallel or sequentially (operator chooses).
3. **Review** — code-reviewer agent gates; defects fixed before moving on.
4. **Test** — QA verifies acceptance criteria.
5. **Demo/Checkpoint** — progress updated; next milestone begins.

## Human-in-the-loop
- Only **two** human gates: **final review** and **final UI testing**.
- Everything else is autonomous until the product is deployed locally.

## Cadence
- Iterations are milestone-sized. Each ends with an updated progress tracker and a working increment.