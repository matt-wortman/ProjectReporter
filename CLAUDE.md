# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Reporter - a desktop application for managing multiple projects and their updates. Built with Electron + React + TypeScript.

## Tech Stack

- **Framework**: Electron 39 + Vite 7 (Electron Forge)
- **Frontend**: React 19 + TypeScript 5.9
- **UI**: shadcn/ui + Tailwind CSS v4
- **Database**: SQLite via Drizzle ORM + better-sqlite3
- **Validation**: Zod (at IPC boundary)
- **State Management**: Zustand

## Commands

```bash
# Development
npm run start           # Start Electron app in dev mode

# Build
npm run make            # Build distributable packages
npm run package         # Package without making installers

# Type checking & Linting
npm run typecheck       # Run TypeScript type check
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Run migrations
npm run db:studio       # Open Drizzle Studio
```

## Architecture

### Process Model (Electron)
```
┌─────────────┐     IPC (invoke/handle)     ┌──────────────┐
│  Renderer   │ ◄─────────────────────────► │    Main      │
│  (React)    │                             │  (Node.js)   │
└─────────────┘                             └──────────────┘
       │                                           │
       │                                           │
       ▼                                           ▼
   Zustand stores                           SQLite (better-sqlite3)
   shadcn/ui components                     Drizzle ORM
```

### Directory Structure
```
src/
├── main/              # Electron main process
│   ├── database/      # Drizzle schema, connection, migrations
│   ├── ipc/           # IPC handlers (to be implemented)
│   └── services/      # Business logic (to be implemented)
├── preload/           # Context bridge (exposes API to renderer)
├── renderer/          # React frontend
│   ├── components/    # UI components
│   │   └── ui/        # shadcn/ui components
│   ├── lib/           # Utilities (cn function)
│   ├── stores/        # Zustand stores (to be implemented)
│   └── hooks/         # Custom React hooks
└── shared/            # Shared types, IPC channel constants
```

### Key Files
- `src/main/database/schema.ts` - Drizzle database schema
- `src/main/database/index.ts` - Database connection and initialization
- `src/shared/ipc-channels.ts` - IPC channel constants
- `src/shared/types.ts` - Shared TypeScript types
- `components.json` - shadcn/ui configuration

### IPC Communication Pattern
- Use `invoke/handle` for async Promise-based communication
- All IPC calls should be validated with Zod schemas
- Channel constants defined in `src/shared/ipc-channels.ts`
- Context bridge in preload exposes type-safe API to renderer

### Database Schema
- **projects**: id, name, description, status, color, icon, isPublished, timestamps
- **updates**: id, projectId, content (Markdown), contentPlain, category, timestamps
- **settings**: id, key, value (JSON)

Schema includes placeholder fields for future Azure sync (`azureSyncId`, `lastSyncedAt`).

## Security Requirements
- Context isolation enabled (no nodeIntegration in renderer)
- All renderer-to-main communication through validated IPC
- Per-user installation (no admin privileges required)
- Database stored in userData directory

## UI Design Guidelines
- **Style**: Warm, minimalist aesthetic inspired by temps app
- **Colors**: Custom warm palette (peach, sage, tan) defined in CSS variables
- **Components**: Using shadcn/ui with new-york style variant
- **Theme**: Supports light/dark mode via CSS custom properties

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components are installed to `src/renderer/components/ui/`.
