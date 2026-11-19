# Replicatable Peer Agent Playbook: Azure DevOps + Optional GitHub Traceability, Copilot Code Review & Showcase HTML

> **How to use this file:** Hand this entire Markdown file to your coding agent (GitHub Copilot CLI, VS Code Agent, or equivalent) and say: *"Follow `output/peer-devops-github-setup.md` interactively to stand up my Azure DevOps demo (and optional GitHub Project/Repo demo) plus my showcase HTML."*
>
> **Agent Mandate:** Operate **interactively** using structured questions (`ask_user` or concise terminal prompts). Run **one focused Grill-Me batch at a time**, confirm before every destructive, billing, or visibility-changing action, handle all authentication interactively with the peer, and verify the final HTML deliverable in a real browser before finishing.

---

## Phase 0 — Tooling Preflight & Tool Selection

Before asking setup questions or touching any remote tenant, run read-only checks to see which tools are available in the peer's environment:

1. **Browser Automation (Primary for UI-only settings, SSO/FIDO passkeys, and HTML QA):**
   - **Chrome (`browsermcp`)**: Check `tab list`. Controls the peer's existing Chrome session—ideal when SSO/passkeys are required.
   - **Edge/Chromium (`playwright-cdp` on `http://127.0.0.1:9222` or standalone `playwright`)**: Note that `playwright-cdp` requires Edge launched with `--remote-debugging-port=9222` and an **isolated `--user-data-dir`** (never share the primary profile lock). Standalone `playwright` often blocks `file:` URLs—serve local HTML over `python -m http.server <port>` for QA.
2. **CLIs (Fastest for bulk work items, repos, issues, sub-issues, and API calls):**
   - `az --version` & `az extension list -o table` (check `azure-devops`).
   - `gh --version` & `gh auth status` (need `gh >= 2.94.0` for `--type` and `--parent` on `gh issue create`).
3. **Secret Hygiene Rule (Non-Negotiable):**
   - **Never** write, echo, commit, or embed PATs, bearer tokens, or client secrets into `.md`, `.yml`, `.json`, HTML files, or terminal logs.
   - Use **OIDC / Workload Identity Federation** (`api://AzureADTokenExchange`) for Azure deployments and `gh secret set PROJECT_PAT` (entered interactively) if enabling `actions/add-to-project`.

---

## Phase 1 — Interactive "Grill-Me" Discovery Interview

Run these **5 short batches sequentially** (wait for peer answers after each batch). Do **not** guess ambiguous org URLs, field names, repo visibility, or paid billing posture.

### Batch 1 · Azure DevOps Target & Domain Schema
Ask the peer:
1. What is your target Azure DevOps organization URL (`https://dev.azure.com/<org>`) and project name (create new vs. use existing)?
2. Which process customization matches your customer story?
   - **Option A (PMO + ITSM):** Inherited Agile with Clarity PPM & ServiceNow fields (`Custom.ClarityProjectID`, `Custom.ClarityTaskID`, `Clarity Sync Status`, `Clarity Exported Hours`, `External Incident ID`)
   - **Option B (Generic Enterprise):** Standard Agile (`Epic → Feature → User Story → Task / Bug`) + custom compliance/cost-center fields
   - **Option C (Custom):** Peer specifies exact custom field names and types
3. Are you on **Basic** or **Basic + Test Plans**? *(Important: Basic supports inline tests, `TestedBy` Test Case links, and `_apis/test/runs`, whereas `_apis/testplan/plans` requires Basic + Test Plans.)*

### Batch 2 · Optional GitHub Project & Repo Parity Scope
Ask the peer:
1. Do you want to stand up the **optional GitHub Project v2 + GitHub Repo parity demo** alongside Azure DevOps? *(If **No**, skip Phase 4 and tailor the HTML deliverable cleanly around ADO + comparison reference.)*
2. If **Yes**:
   - Target a **personal account** (`github.com/<user>`, using GA personal Issue Types & Fields) or a **GitHub Organization** (`github.com/<org>`)?
   - Repository visibility: **`public`** (unlocks free Secret Scanning, Push Protection, CodeQL, Rulesets, and standard Actions compute) or **`private`** *(warn: personal private repos get Dependency Graph & Dependabot only—NO free Secret Protection or Rulesets; Team/Enterprise Org required for private Secret Protection)*?
   - Do you want to connect the **Azure Boards GitHub App (`AB#` hybrid bridge)**?

### Batch 3 · Billing & Agentic Code Review Posture
Ask the peer:
1. Choose your billing posture before touching any toggle:
   - **Free-only pre-staging (`$0` spend):** Configure Org/Project/Repo custom instructions, `main` branch policies, YAML CI, and GitHub Rulesets without clicking `Begin billing` or enabling paid subscriptions.
   - **Enable live metered/paid features:** Explicitly authorize linking an Azure subscription in ADO (`GitHub Copilot for AzDO` at `$0.01`/AI credit; GHAzDO Secret Protection `$19` / Code Security `$30` per active committer/mo) and/or upgrading GitHub Copilot Free → Pro (`$10`/mo) / Business (`$19`/seat/mo).
2. On the demo PR, should the agent invoke a **live Copilot Code Review** (consumes AI credits if billing is active) or render a **diff-grounded walkthrough** in the HTML?

### Batch 4 · Tooling & Auth Path
Ask the peer:
1. Confirm which browser/CLI paths you prefer to authenticate interactively: **Chrome (`browsermcp`)**, **Edge (`playwright-cdp`)**, **`az` CLI**, and/or **`gh` CLI**.
2. If multiple `gh` or `az` identities exist on your machine, confirm the exact account/tenant to use so nothing is created in the wrong tenant or org.

### Batch 5 · Deliverable Path & Customer Storyline
Ask the peer:
1. Where should the HTML showcase be written? *(Default: `output/devops/index.html`)*
2. Who is the primary audience for the 6-scene Talk Track and Verdict strip (e.g., PMO & Engineering Traceability, AppSec Shift-Left, Hybrid ADO → GitHub Migration, or Public Sector / Regulated)?

---

## Phase 2 — Interactive Authentication & Recovery Matrix

Probe authentication cheaply before running setup steps. When interactive auth is needed, **stop**, give the peer the exact prompt or command below, and **verify session identity** before resuming.

| System | Failure / Prompt Signal | Interactive Recovery Action | Verification Check |
|---|---|---|---|
| **ADO (`az` CLI)** | `AADSTS500011`, wrong tenant, or missing token | Ask peer to run:<br>`az login --tenant "<tenantId>" --scope "499b84ac-1321-427f-aa17-267ca6975798/.default"` | `az devops project list --organization https://dev.azure.com/<org> -o table` (note: login alone does not guarantee ADO project permissions; confirm project list succeeds). |
| **ADO (Chrome `browsermcp`)** | Redirects to `login.microsoftonline.com` or `bridge/fido` (Windows Hello / passkey) | Pause and tell peer: *"Browser hit Microsoft Entra sign-in/passkey in Chrome. Please complete the sign-in in that tab and reply when the ADO org page loads."* | `get url` and `get title` confirm `https://dev.azure.com/<org>/...` is loaded. |
| **GitHub (`gh` CLI)** | Multiple accounts logged in (`Repository not found` 403 mask) or `GH_TOKEN`/`GITHUB_TOKEN` env var overriding active user | Unset any conflicting `GH_TOKEN`/`GITHUB_TOKEN` in shell if needed, then run:<br>`gh auth switch --user <peer-account>`<br>*(Restore original account at end of session.)* | `gh api user --jq '.login'` returns exact `<peer-account>`. |
| **GitHub Projects (`gh`)** | `missing required scopes [project, read:project]` | Ask peer to run interactively in terminal:<br>`gh auth refresh -h github.com -s project,read:project` | `gh project list --owner <peer-account>` exits `0`. |
| **GitHub / ADO UI Fallback** | CLI lacks org/repo admin scopes or `Assisted Permissions` blocks shell writes | Route UI-only toggles (Org/Project Copilot Code Review, branch policy `Automatically request Copilot code review`, User Issue Types/Fields, global Code Security `Enable all`) to `browsermcp` in the peer's authenticated Chrome tab. | Snapshot the page and verify toggle/state reads `On` / `Saved`. |

---

## Phase 3 — Azure DevOps (`<peer-org>`) Demo Standup

Execute using **ADO REST APIs** (via authenticated `fetch(..., { credentials: 'include' })` in `browsermcp` or `az rest` / `az devops` CLI) and **UI steps** where needed.

### 3.1 Process, Custom Fields & Work Item Hierarchy
1. **Inherited Agile Process:**
   - If using REST to create an inherited process, pass **`parentProcessTypeId`** (the Agile base process GUID), **not** `inheritsFrom`.
   - When adding inherited Work Item Types via REST, use **`inheritsFrom`**.
   - **UI/API Gotchas:** Layout group labels reject `&` (returns `VS402827` — write `"Clarity and External Sync"`, never `"Clarity & External Sync"`).
   - Add custom fields agreed in Batch 1 (e.g., `Clarity Project ID`, `Clarity Task ID`, `Clarity Sync Status`, `Clarity Exported Hours`, `External Incident ID`).
2. **Project, Area Paths & Sprints:**
   - Create project using the inherited process (`processTemplate`).
   - Seed `Sprint 1` (past/closed), `Sprint 2` (active), `Sprint 3` (planned).
   - **Critical Gotcha:** Patch `teamfieldvalues` (`_apis/work/teamsettings/teamfieldvalues`) with **`includeChildren: true`**; otherwise sub-area items silently disappear from Boards and Backlogs.
3. **Seed 4-Tier Hierarchy + QA + Defects:**
   - Strictly enforce `Epic → Feature → User Story → Task / Bug` (**never nest same-type items** like `Story → Story`, which hides parents on Boards).
   - Seed Epics (`#1–#2`), Features (`#3–#6`), User Stories (`#7–#12`), Tasks (`#13–#18` with `Completed Work`), Bugs (`#19–#20`), and Test Cases (`#21–#25` linked via `TestedBy`).
   - **Gotcha:** New work items start in `New`—patch to `Active` / `Closed` in a follow-up update if strict workflow rules require initial `New`.
   - **Test Run:** Execute an automated/manual Test Run (`_apis/test/runs`, works on **Basic**; `_apis/testplan/plans` requires **Basic + Test Plans**) with 4 Passed + 1 Failed (`TC-002`) linked to `Bug #19` and `Story #7`.
   - **API Throttling Note:** Batch updates (`application/json-patch+json` with `/rev` check); respect ADO's **200 TSTU** 5-minute sliding rate limit (`Retry-After`) and **10,000-revision ceiling** on REST updates (portal updates unaffected).

### 3.2 Shared Queries, Dashboard & Delivery Plans
1. Create **4 Shared Queries**:
   - *End-to-End Requirements Traceability (Tree)* (`Epic → Feature → User Story → Task / Bug`)
   - *Requirements Tested By Test Cases* (`DirectLinks` with `TestedBy`)
   - *Clarity Sync - Sprint Completed Work Export* (or domain equivalent)
   - *Active Defects & External Incidents*
2. Create an **Executive Dashboard** using **`WitViewWidget`** with JSON-stringified `settings: JSON.stringify({ query: { queryId, queryName } })` (do **not** use legacy `QueryResultsWidget`, which stalls on grey skeletons) plus **`MarkdownWidget`**. Verify widget rendering in the browser UI.
3. Create a **Delivery Plan** across `Sprint 1–3`.

### 3.3 Repo, Pipelines, Policies & Remote MCP
1. **Seed `main` branch** (via initial push before locking branch policies, or via PR afterward) with:
   - `README.md`, `/.vscode/mcp.json` (`{ "servers": { "ado-remote-mcp": { "url": "https://mcp.dev.azure.com/<org>", "type": "http" } } }`), `/azure-pipelines.yml` (`trigger: [main]`, `pool: { vmImage: ubuntu-latest }`, `steps: [{ script: "node --test tests/*.test.mjs" }]`), `/src/` sample files (including `samlValidator.js`, `clarityTimeSync.js`, `webhookIdempotency.js`).
   - **Important:** Do **not** use `oldObjectId: "0000..."` when branching off an existing `main`—always fetch `main`'s commit SHA and include `parents: [mainSha]` (a zero `oldObjectId` is only for an empty repo's initial commit; otherwise it creates an orphan commit).
2. **Save Pipeline Definition `#1`:** Go to `Pipelines → New pipeline → Azure Repos Git → <repo> → Existing Azure Pipelines YAML file (/azure-pipelines.yml) → More actions → Save`.
   - *Note:* New ADO orgs start with `0` MS-hosted parallel jobs (`1` free self-hosted job active). Explain how to request the free `1,800 min/mo` grant (`https://aka.ms/azpipelines-parallelism-request`), register a self-hosted agent, or link Azure billing.
3. **Create a realistic Demo PR (`PR #1`):**
   - Branch `feature/req-001-saml-clock-skew` off `main`, commit a happy-path test (e.g. `tests/samlValidator.test.mjs` testing only 90s inside 120s skew, omitting negative `>120s` / `invalid_signature` / `NaN` cases), and open `PR #1` linked to `Story #7` and `Bug #19`.
4. **Enable Free Branch Policies on `main`:**
   - `Project Settings → Repos → Repositories → <repo> → Policies → main`:
     - **`Check for linked work items`** = **Required** *(note: verifies at least one work item of any type is linked; direct pushes to `main` are now blocked with `TF402455`)*
     - **`Check for comment resolution`** = **On** (Required or Optional)
   - Verify free Repo Settings (`Commit mention linking = On`, `Commit mention work item resolution = On`).

### 3.4 ADO Copilot Code Review (3-Tier Custom Instructions + Live/Walkthrough)
1. **Stage Org & Project Settings (`$0` free to save text & policy):**
   - `Organization Settings → Repos → Repositories`: Toggle `Allow repositories in this organization to use Copilot code review` **On**; save concise Org-wide Custom Instructions (Traceability, Security/SAML, Domain validation).
   - `Project Settings → Repos → Repositories → Settings tab`: Toggle `Allow repositories in this project to use Copilot code review` **On**; set `Default effort level` (`Balanced`), check `Allow individual repositories to set their own default effort level`, and save Project Custom Instructions.
2. **Commit Target-Branch Repo Instructions onto `main`:**
   - **Critical ADO Rule:** Unlike GitHub.com (which reads instructions from the head branch), Azure Repos Copilot Code Review reads `/.azuredevops/copilot-instructions.md` and `/.azuredevops/instructions/*.instructions.md` (with `applyTo: "**/*.js,**/*.mjs"` YAML frontmatter) **strictly from the PR's target branch (`main`)**.
   - Because `main` already blocks direct pushes (`TF402455`), push to branch `chore/ado-copilot-instructions` (with `parents: [mainSha]`), open a PR linked to a Work Item, and complete/merge it into `main`.
3. **Enable `main` Auto-Review Policy:**
   - Under `main` Branch Policies, enable **`Automatically request Copilot code review`** (and optionally `Review draft pull requests`).
4. **Live Invocation Gate (Explicit Peer Consent Required!):**
   - **If peer approved billing in Batch 3:** Open Repo Settings (`_settings/repositories?repo=<repoId>`), toggle **`Enable Copilot code review for pull requests in this repository`** **On** (accept `Begin billing` only with explicit consent). On `PR #1`, click **`Reviewers → GitHub Copilot → Request`** (re-request manually after new pushes—ADO does not auto re-review pushes). Monitor job completion under `Org Settings → Agent pools → Azure Pipelines` (`_apis/distributedtask/pools/<poolId>/jobrequests`). Confirm Copilot posts `Comment` threads (incl. `custom`-badged findings matching `.azuredevops/instructions/*.instructions.md`).
   - **If peer chose free-only staging:** Do **not** click `Begin billing`. Show the policy trigger trace (`"Copilot Automatic Copilot code review skipped: not enabled for this repository"`) and include a clear **diff-grounded walkthrough** of what Copilot catches on `PR #1` in the HTML.

---

## Phase 4 — Optional GitHub Project v2 + Repo Parity Standup

*(Skip this entire phase if the peer opted out in Batch 2.)*

### 4.1 Account, Issue Types & Issue Fields
1. Confirm active `gh` user: `gh api user --jq '.login'` (remember `GH_TOKEN`/`GITHUB_TOKEN` env vars override `gh auth switch`).
2. **Add `Epic` & `User Story` Issue Types + Custom Fields (GA Nov 2026 for both Personal & Org):**
   - Personal UI: `https://github.com/settings/issue-types` & `https://github.com/settings/issue-fields` (REST API: `POST /user/issue-types`, **not** `/orgs/{org}/issue-types`).
   - Org UI: `https://github.com/organizations/<org>/settings/issue-types` & `.../issue-fields` (REST API: `/orgs/{org}/issue-types`).
   - **Gotcha:** Issue Fields cannot pre-fill from Issue Templates and must be **pinned** to at least one Issue Type (or `Issues without a type`) to appear in the issue sidebar.

### 4.2 Create Demo Repo & Seed Issues **Before** `dependabot.yml`
1. **Create Repo (only public if confirmed in Batch 2):**
   - `gh repo create <owner>/lifecycle-traceability-demo --public --clone` (confirm explicit consent before making any existing private repo public!).
2. **CRITICAL ORDERING RULE:** Push `README.md`, `package.json`, `src/`, `tests/`, `.github/copilot-instructions.md`, `.github/skills/lifecycle-traceability/SKILL.md`, `.github/CODEOWNERS`, `ci-test.yml`, `pr-traceability-gate.yml`, and `codeql.yml` **FIRST**, then create the 4-tier issues **BEFORE** adding `.github/dependabot.yml`!
   - *Why:* GitHub shares one numbering sequence across Issues and PRs; pushing `dependabot.yml` first causes Dependabot PRs `#1–#4` to consume numbers `#1–#4`. Always capture returned issue numbers dynamically rather than assuming `#1–#5`.
3. **Seed 4-Tier Sub-issues (`gh >= 2.94.0`):**
   - `gh issue create -R <owner>/<repo> --type "Epic" --title "[PRJ-4102] ..."` → capture `<epicNum>`
   - `gh issue create -R <owner>/<repo> --type "Feature" --parent <epicNum> --title "[TSK-101] ..."` → capture `<featNum>`
   - `gh issue create -R <owner>/<repo> --type "User Story" --parent <featNum> --title "[REQ-001] ..."` → capture `<storyNum>`
   - `gh issue create -R <owner>/<repo> --type "Task" --parent <storyNum> ...` & `--type "Bug" --parent <storyNum> ...`
   - *(Note: `gh issue list --json` uses `issueType`, not `type`.)*
4. **Now push `.github/dependabot.yml`** (`npm` + `github-actions` weekly).

### 4.3 GitHub Actions Traceability & Project v2 Sync
1. **`pr-traceability-gate.yml`:** Use `actions/github-script@v7` checking `pull_request.body` for `/((close[sd]?|fix(e[sd])?|resolve[sd]?|refs)\s+#\d+|AB#\d+)/i` (note: this checks PR body text syntax; optionally add a GitHub API lookup if verifying the referenced issue exists and is open).
2. **Project v2 (`Lifecycle Traceability Demo`):**
   - Run `gh auth refresh -h github.com -s project,read:project` if using CLI (`gh project create --owner <owner> --title "Lifecycle Traceability Demo"` + `gh project item-add`), or create via UI (`?tab=projects → New project`).
   - Enable `Parent issue` and `Sub-issues progress` columns in Table view.
   - **Critical Auth Gotcha:** Default `GITHUB_TOKEN` **cannot** access Projects v2. If automating `actions/add-to-project@v1.0.2`, have the peer create a fine-grained PAT (`Projects: Read & Write`) or Org GitHub App and set it interactively via `gh secret set PROJECT_PAT -R <owner>/<repo>`—parameterizing the exact `project-url` (`https://github.com/users/<user>/projects/<N>` or `.../orgs/<org>/projects/<N>`).

### 4.4 Branch Ruleset & Free Security Features
1. **Enable Free Security (`/settings/security_analysis`):**
   - On **public** repos: Secret Scanning + Push Protection + Dependabot + Private Vulnerability Reporting + CodeQL (`$0`).
   - On **private** personal repos: Dependency Graph + Dependabot alerts/security updates + Grouped security updates (`$0`; Secret Protection requires Team/Enterprise Org).
   - Never force-convert a peer's private repo (such as `copilot-skills`) to public without explicit peer approval.
2. **Create Branch Ruleset on `main` (`Settings → Rules → Rulesets`):**
   - Require PR before merging, Require CODEOWNERS review, Require status checks (`ci-test`, `require-issue-link`), Require code scanning results (`CodeQL`), Block force pushes, Restrict deletions, and check `Automatically request Copilot code review` *(note: live GitHub Copilot PR review requires Copilot Pro `$10` or Business `$19`+; pre-staging on Copilot Free is allowed)*.
3. **Optional Hybrid Bridge (`AB#`):**
   - Install free **Azure Boards GitHub App** (supports up to `2,000` repos/connection); link `AB#{ID}` in PR/Issue descriptions or commits (**never** PR titles/comments; multi-ID `Fixes AB#1, AB#2` transitions only the first item; Copilot Cloud Agent works on connected GitHub repos only).

---

## Phase 5 — Generate the Vijay View HTML Deliverable & Visual QA

Create the self-contained HTML deliverable at the peer's chosen path (default: `output/devops/index.html`), strictly following the **Vijay View** house design system:

### 5.1 Design Tokens, Restraint & Required Sections
- **Tokens:** Warm newsprint `--paper: #f7f6f3` / `--paper-2: #efeeea` / `--ink: #16171a` / `--signal: #a32b1f` (risk only) / `--live: #1c6444` (actionable positive signal only) + `@media (prefers-color-scheme: dark)` + `@media (prefers-reduced-motion: reduce)` + `:focus-visible`. Fonts: `IBM Plex Sans Condensed`, `IBM Plex Mono` (`tabular-nums` on every number/date/ID), `Newsreader` (verbatim quotes only).
- **Banned:** Near-black dark-only theme, gradient headers, KPI tile rows as opener, emoji as structure, external JS/CSS libraries, walls of prose.
- **Restraint:** `.elevated` only on `.verdict` and Exhibit 01; **exactly one** `.keyline` across the entire document (on the `Ask` verdict card); `.seq.seq-3` collapses to `1fr` at `max-width: 820px`; `.smeta` & `.smeta code` enforce `overflow-wrap: anywhere`; `.bfill` uses `display: flex`.
- **10 Sections to Include (omit or mark `Skipped` for GitHub if peer opted out):**
  1. **Masthead + 10-Link TOC + Don't / Know / Ask Verdict Strip** (ensure `Ask` link matches `#enablement` Section 10).
  2. **`01 Parity` (`#parity`)**: Headline figure + CSS bar chart comparing ADO vs. GitHub capabilities.
  3. **`02 Architecture` (`#arch`)**: Framed `.exhibit.elevated` inline `<svg viewBox="0 0 980 410">` showing ADO track, optional GitHub track, `AB#` bridge, and secretless Azure OIDC/WIF target.
  4. **`03 Hierarchy & Actions` (`#hierarchy`)**: `.matrix` mapping 4-tier hierarchy, custom fields, PR gates (`GITHUB_TOKEN` vs `PROJECT_PAT`), and expandable starter Actions YAML (parameterized `<owner>/<project-url>`).
  5. **`04 Agentic Flow` (`#workflow`)**: Framed `.exhibit` 4-lane `<svg viewBox="0 0 980 355">` covering Planning → Agentic Dev & Review → Push Protection Gate → Cloud Runners & OIDC Deploy.
  6. **`05 Review, Runners & Secrets` (`#agentic-sec`)**: `.matrix` comparing Copilot Code Review, Cloud Agent, Cloud Runners (VNet vs static IP rules), Secret Scanning/Push Protection, and OIDC.
  7. **`06 Pricing & Licensing` (`#pricing`)**: Verified rate card + **5-question AzDO Copilot Code Review FAQ** (GA Nov 17 blog vs. Learn preview status, `$0.01`/AI credit reference ranges Lite `~$0.25` / Balanced `~$1.50` / Max `~$10`, cost estimation formula + 48h Cost Management lag + alert-only Azure budgets warning, why GitHub seat credits don't apply, and Comment-only / MS-hosted or MDP / EU residency limits).
  8. **`07 ADO Showcase` (`#ado-showcase`)**: Value-first **What This Demonstrates & Why Customers Care** + **1-2-3 Demo Sequence** (`.seq.seq-3`) + 5-step tour + clickable deep-links (`Org`, `Project`, `Repo`, `main` Policies, `/.azuredevops/` files on `GBmain`, `PR #1`, `PR #5`, `Pipeline #1`) + Live (or diff-grounded walkthrough) `PR #1` Copilot Review findings + collapsed Technical Appendix.
  9. **`08 Talk Track` (`#talktrack`)**: 6-scene 20-minute presenter script + `Say / Don't say` guardrails tailored to the peer's Batch 5 audience.
  10. **`09 MS Learn & Repos` (`#refs`) + `10 Enablement Steps` (`#enablement`) + Timeline + Colophon**: Verified docs/repos (excluding archived repos), free vs. paid step-by-step checklist, and honest Colophon (`Sources`, `Method & Verification` with exact IDs created, and `Cautions`).

### 5.2 Mandatory Browser & DOM Verification Gate
Playwright MCP blocks `file:` URLs in many environments—serve the output directory over loopback HTTP before running Playwright:

1. Start temporary server: `python -m http.server 18765 -b 127.0.0.1 --directory "<output-dir>"` (background process; stop it after QA!).
2. Navigate to `http://127.0.0.1:18765/index.html` and evaluate/screenshot at **`1280×900` (light)**, **`1280×900` (dark via `emulateMedia({ colorScheme: 'dark' })`)**, and **`390×844` (light mobile)**.
3. Assert **all 5 DOM checks pass**:
   - `document.documentElement.scrollWidth <= window.innerWidth` (`overflowX === false`) at all 3 viewports
   - `[...document.querySelectorAll('.bfill')].every(el => el.getBoundingClientRect().width > 0)`
   - `[...document.querySelectorAll('.vc p')].every(c => getComputedStyle(c).fontFamily + '|' + getComputedStyle(c).fontSize === getComputedStyle(document.body).fontFamily + '|' + getComputedStyle(document.body).fontSize)` (`vcMatch === true`)
   - `[...document.querySelectorAll('.smeta')].every(el => el.scrollWidth <= el.clientWidth)` (`.smeta` wraps cleanly)
   - At `390×844`, `getComputedStyle(document.querySelector('.seq.seq-3')).gridTemplateColumns.split(' ').length === 1` and `document.querySelectorAll('.keyline').length === 1`.
4. Visually inspect the screenshots for overlaps or clipping, fix any defect, re-verify, then **delete temporary `_qa-*.png` files** and **stop the temporary `http.server`**.

---

## Final Handoff Checklist (What the Peer Receives)
- Live Azure DevOps project URL (`Dashboard`, `Epics Backlog`, `Test Run`, `Pipeline #1`, `PR #1` with live or staged Copilot Code Review, `main` policies, `.azuredevops/` custom instructions).
- *(If selected)* Live GitHub repo & Project v2 URL (`4-tier Sub-issues`, `Issue Types/Fields`, `CI Test` / `PR Traceability Gate` / `CodeQL`, `Ruleset`, Secret Scanning & Push Protection).
- Verified, self-contained **Vijay View HTML showcase** (`output/devops/index.html`) ready to open and present immediately.
