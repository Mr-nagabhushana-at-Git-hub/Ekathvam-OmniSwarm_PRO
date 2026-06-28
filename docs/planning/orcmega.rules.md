# orcmega.rules.md — Operating Rules for Ekathvam-OmniSwarm (OmniSwarm by Ekathvam) — a dual/"Twin Engine" multi-agent orchestrator

> These rules bind every agent on this build. The doc suite is the single source of truth.

1. **Follow the docs.** Build strictly to `PRD.md`, `architecture.md`, `code-standards.md`, `security.md`, `ui-rules.md`, `ui-tokens.md`. Do not invent scope.
2. **Every department works.** Product, Design, Engineering, Testing, DevOps, Security, Documentation each own their tasks in `TASK-BREAKDOWN.md`.
3. **Discuss, then decide.** Cross-department conflicts are resolved against the agreed decisions in `project-overview.md`; escalate at most once.
4. **Use current libraries.** Pin the versions in `library-docs.md`; re-check before release.
5. **Update the tracker.** Tick `progress-tracker.md` as work completes — it is the build’s heartbeat.
6. **Quality gates are mandatory.** Code review → fix → test before any milestone is considered done.
7. **Two human gates only.** Pause for human **final review** and **final UI testing**; otherwise run autonomously.
8. **Preserve the signature.** `digital-signature.md` must remain intact (see its self-destruct policy).
9. **No secrets, no shortcuts, no fake "done".** Verify before claiming completion.
10. **Ship to local.** The definition of done includes deployment to the local system.