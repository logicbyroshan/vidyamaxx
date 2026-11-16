# AGENTS.md — Agent Operating Guide

Permanent operating rules and execution guidelines for AI coding agents working in the **VidyaFloww** repository.

---

## 1. Core Directives

1. **Understand Before Modifying**: Fully inspect the problem, requirements, and related code paths before proposing or executing edits.
2. **Minimal, Surgical Changes**: Prefer the smallest correct change that solves the issue. Never touch unrelated files or refactor code outside the scope of the task.
3. **Preserve Existing Behavior**: Do not remove, replace, or overwrite existing behavior, comments, or configurations without explicit justification.
4. **Follow Architecture & Conventions**: Adhere strictly to the monorepo layering, established patterns, and design system tokens described in `.agent/CONTEXT.md`.
5. **No Unjustified Dependencies**: Use existing workspace packages (`@vidyafloww/ui`, `@vidyafloww/utils`, etc.) and installed libraries. Do not add external npm or pip packages without clear justification.
6. **Zero Secrets & Credentials (NEVER PUSH ID/PASS)**: Absolutely NEVER create, commit, push, log, or expose user IDs, usernames, passwords, API tokens, session credentials, private keys, or `.env` files to the repository under any circumstances. Always verify that test fixtures and mock states use generic, non-sensitive placeholders.
7. **Strict Sharp Border Radius Rule**: NEVER use large, bubbly, or excessive border radius (avoid `rounded-xl`, `rounded-2xl`, `rounded-3xl`, or bubbly circular buttons). Maintain sharp, crisp, clean geometric corners with minimal radius (`rounded-sm`, `rounded-[4px]`, or at most `rounded-md` / 4px-6px). We strictly favor crisp, sharp borders across cards, buttons, dialogs, and modules.
8. **Mandatory Branching, GitHub CLI PR & Merge Workflow**: NEVER commit or push changes directly to `main`. Every new task, bug fix, or feature MUST be developed on an isolated, dedicated branch named `fix/<short-description>` or `feature/<short-description>`. Once changes are tested, verified, and audited for zero secrets/credentials, the branch must be pushed to `origin`, a Pull Request must be generated using GitHub CLI (`gh pr create`), and then merged to `main` using GitHub CLI (`gh pr merge`). Direct pushes or direct commits to `main` are strictly prohibited.

---

## 2. Context & Token Efficiency

To maintain high context quality and prevent token waste:
* **Targeted File Inspection**: Read only the files strictly necessary for the current task. Do not scan the entire repository or blindly list large vendor/output folders (`node_modules`, `dist`, `.turbo`, `__pycache__`).
* **Intelligent Use of `.agent/`**:
  * Read `.agent/CONTEXT.md` when starting a new feature, architecture change, or unfamiliar module.
  * Read `.agent/DECISIONS.md` only when questioning or proposing structural/architectural changes.
  * Read `.agent/CHANGELOG.md` only when verifying release history or recent feature arrivals.
  * **Do not read every `.agent/` file automatically for routine or isolated edits.**
* **Reference Over Duplication**: Reference existing symbols and file paths instead of copying blocks of code into conversation messages.

---

## 3. Engineering & Code Guidelines

* **Web (`apps/web`)**:
  * Use React 19, TypeScript (strict mode), and Tailwind CSS 3.4.
  * Use `@vidyafloww/ui` primitives (`VFCard`, `VFTable`, `VFButton`, `VFBadge`, `VFStatCard`, `VFTabs`) rather than creating bespoke HTML duplicates.
  * Maintain desktop layout requirements (`≥ 1000px` viewport minimum; preserve `SmallScreenBlocker`).
  * Preserve the unified `72px` header height lock across `Header.tsx` and `Sidebar.tsx`.
  * Support bilingual i18n keys via `useTranslation` for user-visible UI text; unified bilingual font: Mukta (contemporary humanist sans covering Latin and Devanagari).
* **Backend (`apps/backend`)**:
  * Adhere to the Django layered service pattern: `Views` (thin HTTP) → `Serializers` (validation) → `Selectors` (reads) / `Services` (writes) → `Models` (persistence) → `Tasks` (Celery).
  * Maintain multi-tenancy isolation via organization foreign keys.
* **Shared Packages (`packages/*`)**:
  * Changes in `packages/` affect multiple consumers. Validate all dependent packages before concluding.

---

## 4. Verification & Testing

* **Smallest Relevant Check First**: Run the fastest, most specific test/type-check command relevant to the modified package:
  * Web type check: `pnpm --filter @vidyafloww/web type-check`
  * Web unit tests: `pnpm --filter @vidyafloww/web test`
  * Backend integrity: `python apps/backend/manage.py check`
* **Avoid Wasteful Full Builds**: Do not trigger full monorepo builds (`turbo run build`) for trivial single-file edits unless validating a cross-package release.
* **Credential & Secrets Audit**: Always inspect `git status` and `git diff` before committing or pushing to verify that no user IDs, passwords, private keys, or `.env` files were accidentally created or staged.
* **Review Diffs & Clean Commits**: Always inspect `git status` and `git diff` before creating commits to ensure no accidental whitespace, debug logs, or unrelated file changes occurred.
* **Mandatory PR & Merge via GitHub CLI**: Never commit or push directly to `main`. Changes must be committed on a dedicated `feature/*` or `fix/*` branch, pushed to `origin`, submitted via `gh pr create`, and merged to `main` via `gh pr merge`.

---

## 5. Git & Pull Request Workflow

All code contributions and agent modifications must strictly follow this workflow:
1. **Sync Base**: Ensure local `main` is up to date:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Branch Creation**:
   - For bug fixes: `git checkout -b fix/<short-descriptive-name>`
   - For new features / enhancements: `git checkout -b feature/<short-descriptive-name>`
3. **Develop & Verify**: Implement minimal, surgical changes and run package-level checks (`type-check`, `test`, etc.).
4. **Credential & Secrets Audit**: Verify `git status` and `git diff` to ensure zero secrets, private keys, or `.env` files are tracked or staged.
5. **Commit & Push**:
   ```bash
   git add <modified-files>
   git commit -m "feat/fix(<scope>): concise description"
   git push -u origin <branch-name>
   ```
6. **Generate PR via GitHub CLI**:
   ```bash
   gh pr create --title "<type>(<scope>): <summary>" --body "<summary of changes and test results>"
   ```
7. **Merge PR via GitHub CLI**:
   Once verified, tests pass, and zero conflicts remain, merge the Pull Request to `main` using GitHub CLI:
   ```bash
   gh pr merge <pr-number-or-branch> --merge
   ```
   Then sync local `main`:
   ```bash
   git checkout main
   git pull origin main
   ```

---

## 6. Reporting & Updates

* Keep progress notes and final responses concise, structured, and factual.
* Update `.agent/CONTEXT.md`, `.agent/DECISIONS.md`, or `.agent/CHANGELOG.md` **only** when a meaningful architectural shift, permanent decision, or significant milestone has been implemented.
