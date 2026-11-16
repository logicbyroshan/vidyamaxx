# @vidyafloww/desktop

Electron desktop application for VidyaFloww — Enterprise School Management Platform.

## Tech Stack

- **Electron 33** — desktop shell
- **React 19** + **TypeScript**
- **Vite 5** — build tool
- **TanStack Query** — server state management
- **Zustand** — client state management
- **vite-plugin-electron** — Electron + Vite integration

## Development

```bash
# From the monorepo root
pnpm dev --filter=@vidyafloww/desktop

# Or from this directory
pnpm dev
```

## Building

```bash
pnpm build
```

## Structure

```
electron/
├── main/          # Main process (Node.js environment)
│   └── index.ts   # Application entry, BrowserWindow creation
└── preload/       # Preload scripts (secure bridge between main & renderer)
    └── index.ts   # contextBridge API exposure

src/
├── app/           # Root component, providers
├── components/    # Shared UI components
├── features/      # Feature modules (co-located by domain)
├── hooks/         # App-specific hooks
├── layouts/       # Page layout components
├── pages/         # Page components
├── routes/        # Router definitions
├── services/      # API service layer
├── stores/        # Zustand stores
├── types/         # App-specific TypeScript types
└── utils/         # App-specific utilities
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.
