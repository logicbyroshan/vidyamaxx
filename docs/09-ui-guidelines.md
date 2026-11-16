# 09 — UI Guidelines & Design System

## Overview

VidyaFloww uses a custom, high-density **AI-First Enterprise Desktop Interface** built on top of **Tailwind CSS 3.4**, **Radix UI Primitives**, **Framer Motion**, **TanStack Table**, **Recharts**, **cmdk**, **Sonner**, **Lenis**, and custom UI component tokens (`@vidyafloww/ui`). All application pages adhere to strict visual consistency, micro-animations, and interaction standards.

---

## Key Layout & Viewport Rules

1. **Desktop Viewport Restriction**:
   - Minimum supported width is **1000px**.
   - If accessed on viewports below 1000px, a blocking overlay prompts users to use the VidyaFloww Mobile App (`SmallScreenBlocker`).
2. **Fluid Responsive Typography Clamping (Sofia Sans)**:
   - Root HTML font uses **Sofia Sans** with fluid CSS `clamp()` and breakpoint scaling:
     ```css
     html {
       /* Fluid base scaling from 15.5px up to 21.5px on large viewports */
       font-size: clamp(15.5px, 0.75rem + 0.5vw, 19.5px);
     }
     @media (min-width: 1440px) { html { font-size: 17.5px; } }
     @media (min-width: 1680px) { html { font-size: 18.25px; } }
     @media (min-width: 1920px) { html { font-size: 19.0px; } }
     @media (min-width: 2560px) { html { font-size: 21.5px; } }
     ```
   - Scales text smoothly and proportionally across 1080p, 2K, and 4K displays while maintaining zero line overflow and perfect vertical alignment.
3. **Standardized Typographic Hierarchy**:
   - **Primary Navigation**: `text-base font-bold/font-semibold` with `h-5 w-5` icons (Sidebar items & Top Tab Bar options share identical scale).
   - **Section & Card Titles**: `text-base font-extrabold text-foreground tracking-tight` across `VFCard`, `VFCardTitle`, and sub-rosters.
   - **Section Subtitles**: `text-xs text-muted-foreground font-medium`.
   - **Hero Metric Values**: `text-2xl font-black leading-none` across all `VFStatCard`s.
   - **Table Primary Cells**: `text-sm font-bold text-foreground` (student/staff names, admission IDs).
   - **Table Secondary Cells**: `text-sm font-semibold text-muted-foreground` (classes, contact numbers).
4. **Header & Sidebar Height Lock (`h-[72px]`)**:
   - Top Navbar (`Header.tsx`) and Sidebar brand header (`Sidebar.tsx`) are strictly locked to `h-[72px]`, providing generous vertical breathing room.
   - Sub-navigation tab bar (`VFTabs.tsx`) is styled at `h-[58px] px-6` with fluid spring-animated active indicator underlines.
5. **Generous Spacing & Card Dimensions**:
   - Page containers use `p-6 sm:p-7` for spacious exterior margins.
   - Structural grid layouts use `gap-6 sm:gap-7` and `space-y-6`.
   - Cards (`VFCard`, `VFStatCard`) use `p-5 sm:p-6` with `rounded-xl` and `space-y-4` internal content spacing.

---

## Section-by-Section Dedicated Single Color System

To eliminate visual chaos and rainbow noise, each functional section is assigned a single, dedicated color identity:
- 🔷 **Institutional Metrics (Top KPIs)**: `Sky Blue` (`accentColor="blue"`)
- 🟣 **Quick Action Command Launchpad**: `Royal Indigo` (`border-indigo-500/25 bg-indigo-500/10`)
- 🟡 **Faculty Roster & Operations**: `Warm Amber` (`border-amber-500/25 bg-amber-500/8`)
- 🔴 **Student Attendance Exceptions**: `Rose Red` (`border-rose-500/25 bg-rose-500/8`)
- 🟢 **Software License & Cloud Health**: `Emerald Green` (`border-emerald-500/30 bg-emerald-500/10`)

---

## Lenis & Staggered Revealing Motion System

1. **Main Viewport Scrolling (`AppShell.tsx`)**:
   - Initialized a **Lenis instance** hooked to the main content scroll container (`<main ref={mainRef}>`).
   - Configured with inertial easing `(t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` for fluid physics scrolling.
2. **Route Page & Tab Content Revealing Transitions (`Framer Motion`)**:
   - Main `<Outlet />` in `AppShell.tsx` and tab panels in `VFTabs.tsx` are wrapped in `<AnimatePresence>` + `<motion.div>`.
   - On route navigation or submodule tab switching, page components fade and slide up smoothly with staggered revealing motion (`duration: 0.28s`, bezier `[0.16, 1, 0.3, 1]`).
   - Tab indicators use Framer Motion spring layouts (`layoutId="activeTabUnderline"`).

---

## Submodule Tabbar (`VFTabs`) Rules

1. **Single Viewport & No Dual Scrolling**:
   - The top tabbar is rendered at `sticky top-0 z-30` inside `<main>`.
   - Tabpanel content does NOT contain nested vertical `overflow-y-auto` scrollbars, making `<main>` the single, unified vertical scroll container.
2. **Auto-Centering Smooth Scroll**:
   - Clicking or selecting any tab triggers `scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })` to focus active tabs.
3. **Zero Vertical Jitter**:
   - Container locked with `overflow-y-hidden h-full items-center no-scrollbar`.

---

## Fail-Safe Dual-Engine Data Tables (`VFTable`)

1. **TanStack Table + Fail-Safe Array Fallback**:
   - `VFDataTable` combines TanStack Table v9 state management with a direct fail-safe array render engine.
   - Guarantees 100% data visibility across all 24 modules under all network and search conditions.
2. **Features**:
   - Global client-side text filtering (`filterPlaceholder`).
   - Column visibility dropdown toggles (`Columns (active/total)`).
   - Multi-column sorting (`↑` / `↓`).
   - Page records pagination controls (`Previous` / `Next`).

---

## Standard Technology Stack Integrations

| Purpose | Integrated Library | Usage in `@vidyafloww/ui` & `@vidyafloww/web` |
|---|---|---|
| **Core UI** | React 19 + Tailwind CSS 3.4 | Core framework, `@tailwindcss/forms`, `@tailwindcss/typography` |
| **Components** | `@vidyafloww/ui` | CVA (`class-variance-authority`), `clsx`, and `tailwind-merge` component system |
| **Accessible Primitives** | Radix UI | `@radix-ui/react-dialog` (`VFDialog`, `VFModal`, `VFDrawer`), `@radix-ui/react-select` (`VFSelect`), `@radix-ui/react-tabs`, `@radix-ui/react-popover`, `@radix-ui/react-tooltip` |
| **Animations** | Framer Motion | `framer-motion` staggered page/tab transitions, drawer slide-ins, spring layout indicators |
| **Smooth Scrolling** | Lenis | `lenis` smooth scroll instances in `AppShell.tsx` and `Sidebar.tsx` |
| **Icons** | Lucide | `lucide-react` (^1.23.0) + `@vidyafloww/icons` package |
| **Charts** | Recharts | `@vidyafloww/ui` exports `VFAreaChart`, `VFBarChart`, `VFPieChart` with dark theme tooltips and gradient fills |
| **Tables** | TanStack Table | `VFDataTable` powered by `@tanstack/react-table` v9 + fail-safe rendering engine |
| **Command / Search** | cmdk | `CommandPalette.tsx` (`⌘K` modal palette) |
| **Toasts** | Sonner | `ToastContainer.tsx` store-synced toast notifications |
| **Loading** | Skeleton | Native `animate-pulse bg-muted/40` skeleton states across cards and grids |

---

## Design System Tokens & Color Palette

### Color Palette (Dark-Mode First)
- **Background**: Deep charcoal (`#09090b` / `bg-background`)
- **Card Container**: Layered dark card (`#18181b` / `#0e1017` / `bg-card`)
- **Primary Accent**: Amber Orange (`#f97316` / `text-primary`)
- **Secondary Accent**: Slate Cyan (`#0891b2` / `text-secondary`)
- **Success Accent**: Emerald Green (`#16a34a` / `text-success`)
- **Borders & Dividers**: Subtle gray border (`#27272a` / `border-border`)

---

*Last updated: 2026-08-19*
