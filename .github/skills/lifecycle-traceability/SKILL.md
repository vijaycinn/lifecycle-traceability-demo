---
name: lifecycle-traceability
description: Enforces 4-tier Epic -> Feature -> User Story -> Task/Bug hierarchy, PR issue linking, and Clarity time-sync invariants in this repository.
---

# Lifecycle Traceability Skill

When planning work, implementing tasks, or reviewing PRs in this repo:

1. Maintain strict hierarchy: **Epic -> Feature -> User Story -> Task / Bug** using GitHub Issue Types and Sub-issues (`--parent`). Never nest same-type issues unless modeling subtasks.
2. Require `Fixes #N` (for resolving tasks/bugs) or `Refs #N` (for partial story work) in the PR body so the `PR Traceability Gate` check passes.
3. Verify `npm test` passes locally before opening or approving a pull request.