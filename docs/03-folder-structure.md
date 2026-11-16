# 03 — Folder Structure

## Monorepo Layout

```text
vidyafloww/
├── apps/
│   ├── backend/          Django application (Python 3.13)
│   ├── web/              React 19 web app (Vite + TypeScript)
│   ├── mobile/           React Native + Expo mobile app
│   └── desktop/          Electron desktop app
├── packages/
│   ├── api/              Typed HTTP client (Axios)
│   ├── ui/               Shared UI component library (shadcn/ui)
│   ├── types/            TypeScript type definitions
│   ├── utils/            Pure utility functions
│   ├── constants/        Routes, enums, roles, status codes
│   ├── hooks/            Shared React hooks
│   ├── validation/       Zod schemas
│   ├── config/           App configuration utilities
│   ├── themes/           Design tokens and Tailwind config
│   ├── icons/            Custom icon components
│   └── assets/           Shared static assets
├── docs/                 13 documentation files (modules, UI, arch, API)
├── scripts/              Build and utility scripts
├── docker/               Dockerfiles and Compose files
├── nginx/                Nginx configuration
├── .github/              GitHub Actions workflows and templates
├── .vscode/              VSCode workspace settings
├── package.json          Root package.json (monorepo scripts)
├── pnpm-workspace.yaml   pnpm workspace configuration
├── turbo.json            TurboRepo pipeline configuration
├── tsconfig.json         Root TypeScript configuration
└── .env.example          Environment variable documentation
```

## Backend Structure (apps/backend/)

```text
backend/
├── config/
│   ├── settings/
│   │   ├── base.py       Shared settings for all environments
│   │   ├── development.py  Development overrides
│   │   ├── production.py   Production hardening
│   │   └── testing.py      Test optimizations
│   ├── urls.py           Root URL configuration
│   ├── asgi.py           ASGI entry point (Channels)
│   ├── wsgi.py           WSGI entry point (Gunicorn)
│   └── celery.py         Celery application
├── core/                 Foundation layer apps
├── platform/             Cross-cutting platform services
├── modules/              Domain feature modules (20+ modules)
├── ai/                   AI and ML services
├── integrations/         External service connectors
├── common/               Shared base classes and utilities
├── media/                User uploads
├── static/               Static files
├── locale/               Translation files
├── tests/                Integration tests
├── logs/                 Application logs
├── manage.py             Django management utility
└── pyproject.toml        Python dependencies (Poetry)
```

## Web Structure (apps/web/)

```text
web/src/
├── app/                  Root app component, providers
├── layouts/              Page layout components (sidebar, header)
├── routes/               TanStack Router route definitions
├── pages/                Top-level page components
├── components/           Generic, reusable UI components
├── features/             Domain-specific feature modules
│   └── <feature>/
│       ├── components/   Feature-specific components
│       ├── pages/        Feature page components
│       ├── api/          TanStack Query hooks + API calls
│       ├── hooks/        Feature-specific React hooks
│       ├── schemas/      Zod validation schemas
│       ├── types/        Feature TypeScript types
│       ├── utils/        Feature utility functions
│       └── constants/    Feature constants
├── services/             Singleton service classes
├── stores/               Zustand global state stores
├── hooks/                Shared React hooks
├── types/                Local TypeScript types
├── utils/                Helper functions
├── styles/               Global CSS and Tailwind config
├── assets/               Images, fonts, icons
└── lib/                  Third-party library configurations
```

## Rule: Where Does My Code Go?

| Code Type | Location |
|-----------|----------|
| Type shared across apps | `packages/types/` |
| Validation shared across apps | `packages/validation/` |
| Route constant | `packages/constants/src/routes.ts` |
| HTTP call | `packages/api/src/` or feature's `api/` folder |
| Reusable UI component | `packages/ui/` |
| Feature-specific component | `apps/web/src/features/<feature>/components/` |
| Business logic (backend) | `modules/<module>/services.py` |
| Read query (backend) | `modules/<module>/selectors.py` |
| Async task (backend) | `modules/<module>/tasks.py` |
| Django signal | `modules/<module>/signals.py` |

---

*Last updated: 2026-07-02*
