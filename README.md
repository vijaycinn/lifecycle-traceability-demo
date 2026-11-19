# Lifecycle Traceability Demo (GitHub Parity for Azure DevOps)

Public demonstration repository replicating `org-vcinn/LifecycleTraceabilityDemo` natively on GitHub using:

- **4-Tier Work Hierarchy:** `Epic -> Feature -> User Story -> Task / Bug` via GitHub **Issue Types** and **Sub-issues**
- **Commit & PR Traceability:** `Fixes #N` / `Refs #N` / `AB#N` enforced by a **GitHub Actions PR Traceability Gate** + **Branch Ruleset**
- **Free Shift-Left Security:** Secret Scanning, Push Protection, Dependabot alerts/security updates, and **CodeQL** SAST
- **Agentic Readiness:** `.github/copilot-instructions.md` and `.github/skills/lifecycle-traceability/SKILL.md` for Copilot Code Review & Cloud Agent