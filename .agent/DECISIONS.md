# Architectural & Design Decisions

Meaningful architectural and engineering decisions supported by the codebase, documentation, and Git history.

---

### Decision 1: Monorepo Architecture with TurboRepo & pnpm Workspaces
* **Date**: 2026-07-02
* **Decision**: Adopt a monorepo structure utilizing TurboRepo and pnpm workspaces containing `apps/` (web, backend, desktop, mobile, landing) and `packages/` (ui, types, api, constants, hooks, validation).
* **Reason**: Enables seamless code reuse across web, desktop, and mobile clients (particularly types, UI tokens, and API schemas) while keeping tooling, linting, and build steps coordinated under a single root.
* **Impact**: Workspace packages depend on each other via `workspace:*`; scripts must be executed using filter flags (e.g., `pnpm --filter @vidyafloww/web dev`).

---

### Decision 2: Django Modular Monolith with Layered Service Pattern
* **Date**: 2026-07-02
* **Decision**: Structure the backend as a modular monolith organized into 5 layers (`core`, `platform_services`, `modules`, `ai`, `integrations`) using a strict service/selector pattern.
* **Reason**: Balances the operational simplicity of a single deployable unit with clear business domain boundaries, preventing fat controllers or models.
* **Impact**: Views handle HTTP only; business write logic belongs in `services.py`, queries in `selectors.py`, and asynchronous tasks in `tasks.py`.

---

### Decision 3: Shared-Schema Multi-Tenancy Model
* **Date**: 2026-07-02
* **Decision**: Isolate organization data within a shared database schema using an `organization` foreign key on tenant models and scoped querysets, rather than database-per-tenant or schema-per-tenant.
* **Reason**: Minimizes operational overhead, simplifies database migrations, and lowers hosting costs for multi-campus deployments.
* **Impact**: All tenant-scoped models must include an organization link; global queries must be guarded to prevent cross-tenant data leakage.

---

### Decision 4: Desktop-Only Viewport Gate (≥ 1000px) for Web Command Portal
* **Date**: 2026-08-10
* **Decision**: Enforce a minimum viewport width of 1000px via `SmallScreenBlocker` in `AppShell.tsx`, redirecting smaller viewports to the dedicated mobile app.
* **Reason**: School administrative ERP workflows involve dense data tables, side drawers, multi-column filters, and timetable grids that lose operational utility on mobile screens.
* **Impact**: Desktop views do not compromise information density for small-screen responsive wrapping; mobile users are directed to the mobile client (`apps/mobile`).

---

### Decision 5: Dedicated Component Library (`@vidyafloww/ui`) with Radix UI & Framer Motion
* **Date**: 2026-08-10
* **Decision**: Standardize all application UI primitives in `packages/ui` backed by Radix UI unstyled primitives, Tailwind CSS, and Framer Motion spring physics.
* **Reason**: Guarantees keyboard accessibility, consistent drawer/modal animations, unified sharp border radii, and eliminates fragmented third-party styling across modules.
* **Impact**: Application routes must import UI components from `@vidyafloww/ui` rather than re-implementing custom dialogs, buttons, or badge wrappers.

---

### Decision 6: Single Viewport Vertical Scroll & Auto-Centering Submodule Tabs
* **Date**: 2026-08-11
* **Decision**: Lock the `<main>` container as the sole vertical scrollable element and make submodule `VFTabs` auto-center horizontally on selection.
* **Reason**: Dual nested scrollbars caused jitter, stuck scroll wheels, and poor usability when navigating between data tables and tabs.
* **Impact**: Tabpanel contents must never contain independent vertical `overflow-y-auto` scrollbars; horizontal wheel events are isolated to the tabbar.

---

### Decision 7: Timetable Matrix Layout via Pure CSS Grid
* **Date**: 2026-08-12 (Commit `c7dcba0`)
* **Decision**: Re-architect the timetable weekly period schedule using CSS Grid instead of nested flexbox containers.
* **Reason**: Flexbox approximations caused slight height and width mismatches between period slots across different resolutions and browser zoom levels.
* **Impact**: Rows and columns maintain mathematically identical dimensions across all days and bell schedule configurations.

---

### Decision 8: Single Bilingual Font — Mukta
* **Date**: 2026-08-20 (updated 2026-09-07)
* **Decision**: Use **Mukta** as the single `--ui-font` token covering both Latin (English) and Devanagari (Hindi) script. Loaded from Google Fonts in `globals.css`. The `lang-hi` class on `<html>` triggers the same Mukta stack with adjusted line-height for Devanagari matras.
* **Reason**: Mukta is a unified humanist sans-serif with native Devanagari support, eliminating the need for a dual-font cascade. Earlier prototypes used Sofia Sans + Baloo 2 but this caused inconsistent weight rendering; Mukta was adopted as the final production font.
* **Impact**: A single `--ui-font` CSS property manages the entire app. All components inherit via `font-family: inherit`. No per-locale font switching is needed.

---

### Decision 9: Strict Sharp Border Radius Enforcement
* **Date**: 2026-09-01
* **Decision**: Strictly prohibit `rounded-xl`, `rounded-2xl`, `rounded-3xl`, and any large bubbly border radius across all UI surfaces (cards, buttons, dialogs, badges, drawers, modules). Permitted maximum: `rounded-md` (≈6px) for container elements; preferred standard is `rounded-[4px]` / `rounded-sm`.
* **Reason**: The VidyaFloww design system is built on a crisp, geometric, professional enterprise aesthetic. Large rounded corners conflict with the high-information-density data table paradigm and break visual rhythm between adjacent elements.
* **Impact**: All new and existing routes must use sharp geometry. The AI agent operating under `AGENTS.md` is instructed to flag and correct radius violations on every edit.

---

### Decision 10: Permanently Dark Theme — No Light/System Mode
* **Date**: 2026-09-01
* **Decision**: Force `.dark` class on `<html>` on every app mount via `initTheme()` in `globalStore.ts`. No light mode, system mode, or theme toggle is exposed to the user.
* **Reason**: The command portal's visual design, color palette, contrast ratios, and component color tokens are exclusively optimized for dark mode. Maintaining two theme variants would double visual QA surface without a meaningful user need (institutional desktop admin tools are typically used in controlled lit environments).
* **Impact**: `theme: 'dark'` is a literal type in `GlobalState`. All CSS tokens in `globals.css` `.dark {}` block are the only active values at runtime.

---

### Decision 11: Mandatory Branching & GitHub CLI PR Workflow
* **Date**: 2026-09-08
* **Decision**: Require all new features and bug fixes to be implemented on isolated branches (`feature/*` or `fix/*`), pushed to remote, and submitted as Pull Requests via GitHub CLI (`gh pr create`). Direct commits or pushes to `main` are strictly prohibited.
* **Reason**: Protects the stability of the base `main` branch, creates an auditable review record, and leverages GitHub CLI to streamline PR lifecycle operations directly from local developer environments.
* **Impact**: All work begins from an up-to-date `main`, branches off to dedicated feature/fix branches, undergoes verification and credential audits, and is proposed through `gh pr create`.

---

### Decision 12: Decoupled Independent Subsystems with In-Portal Integrated Overview Dashboards
* **Date**: 2026-09-08
* **Decision**: Decouple heavy, specialized operational subsystems (Design Lab / Certificate Studio, Hostel Management, Transport & Fleet Telemetry, HR & Support Staff Biometrics, and E-Library & DRM Reader) into dedicated standalone repositories and subdomains (`designlab.vidyafloww.com`, `hostel.vidyafloww.com`, `transport.vidyafloww.com`, `hr.vidyafloww.com`, `library.vidyafloww.com`), while maintaining high-density, real-time integrated single-page overview dashboards within the main VidyaFloww command portal (`/design-lab`, `/hostel`, `/transport`, `/hr-manage`, `/elibrary`).
* **Reason**: Full implementations of these specialized domains require complex dedicated hardware integrations (GPS telematics, biometric turnstiles, vector layout engines, DRM reader pipelines). Isolating them into dedicated repositories prevents frontend bundle bloat, permits independent engineering iteration and deployment cadences, and maintains sharp single-responsibility separation. Retaining integrated single-page overview dashboards within the core portal ensures school leadership still enjoys instantaneous telemetry, status summaries, quick preview modals, and contextual one-click redirection without cognitive disruption.
* **Impact**: The main web app maintains snappy load times and zero dependency overhead from external vector or hardware modules. Subsystem routes in `apps/web/src/routes/` render rich operational KPI cards, recent records, active ledgers, and a standardized "Open Standalone Portal" action header directing administrators to the respective subdomain.

