# @vidyafloww/mobile

React Native / Expo mobile application for VidyaFloww — Enterprise School Management Platform.

## Tech Stack

- **Expo 52** + **React Native 0.76** + **TypeScript**
- **Expo Router** — file-based navigation
- **TanStack Query** — server state management
- **Zustand** — client state management
- **React Hook Form** + **Zod** — forms and validation

## Development

```bash
# From the monorepo root
pnpm dev --filter=@vidyafloww/mobile

# Or from this directory
pnpm dev
```

## Building

```bash
# Android
pnpm build:android

# iOS
pnpm build:ios
```

## Structure

```
src/
├── app/           # Root component, providers
├── assets/        # Images, fonts, and other static assets
├── components/    # Shared React Native components
├── features/      # Feature modules (co-located by domain)
├── hooks/         # App-specific hooks
├── navigation/    # Navigation configuration
├── services/      # API service layer
├── stores/        # Zustand stores
├── types/         # App-specific TypeScript types
└── utils/         # App-specific utilities
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.
