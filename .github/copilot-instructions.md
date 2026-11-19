# Repository Guidelines for Copilot Code Review & Cloud Agent

1. **Traceability:** Every pull request must reference an Issue in its description using `Fixes #N`, `Closes #N`, or `Refs #N` (or `AB#N` for Azure Boards hybrid links).
2. **Validation:** Changes to `src/` must include or update unit tests in `tests/*.test.mjs` passing `npm test` (`node --test tests/*.test.mjs`).
3. **Security:** Never hardcode credentials, tokens, or connection strings; rely on GitHub OIDC (`azure/login`) and repository secrets.
4. **Clarity Sync Invariant:** `buildClarityTimesheetBatch` must reject negative or `NaN` hours with `RangeError`.