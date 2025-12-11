# Project Updater - Implementation Plan

## Overview
A desktop application for managing multiple projects and their updates. Focus on core data management first; website generation and Azure sync are future features.

## Tech Stack
- **Framework**: Electron + Vite (Electron Forge)
- **Frontend**: React 18 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS (playful & colorful theme)
- **Database**: SQLite via Drizzle ORM + better-sqlite3 (local per computer)
- **Validation**: Zod
- **State Management**: Zustand
- **Testing**: Vitest + Playwright

## Multi-Computer Strategy
- Phase 1 (now): Local SQLite database per computer
- Phase 2 (future): Azure database sync so multiple computers share data

## Project Structure
```
project-updater/
├── src/
│   ├── main/              # Electron main process
│   │   ├── database/      # Drizzle schema + repositories
│   │   ├── ipc/           # IPC handlers
│   │   └── services/      # Business logic
│   ├── preload/           # Context bridge (security)
│   ├── renderer/          # React frontend
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── stores/        # Zustand stores
│   │   └── routes/        # TanStack Router
│   └── shared/            # Types, schemas, IPC channels
├── templates/             # Static site templates (future)
└── tests/                 # Unit, integration, E2E
```

## Database Schema (SQLite)
- **projects**: id, name, description, status, color, icon, isPublished, timestamps
- **updates**: id, projectId, content (Markdown), contentPlain, category (future), timestamps
- **settings**: id, key, value (JSON)

*Note: Single-user app - no user management needed*

## Implementation Steps

### Phase 1: Foundation
1. [ ] Initialize Electron Forge with Vite template
2. [ ] Configure TypeScript (separate configs for main/preload/renderer)
3. [ ] Set up Tailwind CSS + shadcn/ui with playful color palette
4. [ ] Install and configure Drizzle ORM with better-sqlite3
5. [ ] Define database schema and run initial migration
6. [ ] Create base IPC channel constants in shared/

### Phase 2: Project Management
7. [ ] Implement project repository and service (main process)
8. [ ] Create preload context bridge for project API
9. [ ] Create project IPC handlers with Zod validation
10. [ ] Build project list/grid with colorful cards
11. [ ] Build project create/edit form dialog

### Phase 3: Updates System
12. [ ] Implement update repository and service
13. [ ] Create update IPC handlers with Zod validation
14. [ ] Build QuickUpdateInput component (inline per project)
15. [ ] Add Markdown support (react-markdown)
16. [ ] Build update list/timeline view

### Phase 4: Polish & Testing
17. [ ] Custom title bar with window controls
18. [ ] Loading states, error handling, animations
19. [ ] Write unit tests (Vitest) for services
20. [ ] Write E2E tests (Playwright) for workflows
21. [ ] Configure Electron Forge for cross-platform builds (no admin required)

### Future Phases (deferred)
- Website generation (static HTML export)
- Azure database sync for multi-computer access
- LLM integration for grammar/clarity
- Category tagging (IP, marketing, evaluation)

## Key Design Decisions
| Decision | Choice | Why |
|----------|--------|-----|
| Build Tool | Electron Forge + Vite | Official tooling, modern bundling |
| SQLite Driver | better-sqlite3 | Best performance for Electron (sync API) |
| ORM | Drizzle | Type-safe, lightweight, great SQLite support |
| State | Zustand | Minimal boilerplate, TypeScript-first |
| IPC Pattern | invoke/handle | Async Promise-based communication |
| Validation | Zod at IPC boundary | Runtime + compile-time type safety |

## UI Design (Inspired by temps app - jackd248.github.io/temps)

**Design Philosophy:**
- Clean, minimalist, warm aesthetic
- Lots of whitespace
- Soft, rounded corners everywhere
- Large, readable typography

**Color Palette:**
- Background: Clean white or very light gray
- Cards: Warm gradient backgrounds (peach, tan, soft orange, sage)
- Accents: Soft teal/sage green (#7fa99b similar)
- Text: Soft dark gray (not pure black)
- Status colors (muted/pastel versions):
  - Active: Soft peach/coral gradient
  - On-Hold: Warm tan/beige gradient
  - Completed: Soft sage/teal gradient
  - Archived: Light gray gradient

**Main Layout:**
- Clean header with app logo + minimal controls
- Project list as warm gradient cards
- Each card shows: project name, description, last update time
- Quick update input field per card
- Clicking card expands to show full update history

**Project Card Design:**
- Rounded corners (12-16px radius)
- Warm gradient background (unique per project or status-based)
- Large project name
- Subtle description text
- Timestamp in corner
- Inline text input for quick updates
- Simple line-art or emoji icons

**Typography:**
- Clean sans-serif (Inter, SF Pro, or similar)
- Large headings, comfortable reading sizes
- Generous line spacing

## Security (No Admin Required)
- Per-user installation (userData directory)
- Context isolation enabled
- No nodeIntegration in renderer
- Validated IPC with Zod schemas
- Electron Fuses for hardened builds

## Future-Ready Design
Database schema includes placeholder fields for future features:
- `azureSyncId` + `lastSyncedAt` on all tables (for Azure sync)
- `category` enum on updates (for IP/marketing/evaluation tagging)
- `improvedContent` on updates (for LLM grammar improvements)
