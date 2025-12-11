# Project Updater

A desktop application for managing multiple projects and tracking their updates.

## Tech Stack

- **Framework**: Electron + Vite (Electron Forge)
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with warm, colorful gradients
- **Database**: SQLite via Drizzle ORM + better-sqlite3
- **State Management**: Zustand
- **Validation**: Zod

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run make
```

## Project Structure

```
src/
├── main.ts              # Electron main process entry
├── preload.ts           # Context bridge for IPC
├── renderer.tsx         # React app entry
├── main/
│   ├── database/        # Drizzle schema & SQLite setup
│   ├── ipc/             # IPC handlers
│   └── services/        # Business logic
├── renderer/
│   ├── components/      # React UI components
│   ├── stores/          # Zustand stores
│   └── index.css        # Tailwind styles
└── shared/
    ├── types.ts         # Shared TypeScript types
    └── ipc-channels.ts  # IPC channel constants
```

## Key Features

- Create and manage projects with status tracking (Active, On Hold, Completed, Archived)
- Add quick updates to projects with Markdown support
- Colorful gradient cards based on project status
- Custom frameless window with title bar
- Local SQLite database (per-user, no admin required)

## Security

- Context isolation enabled
- No Node.js integration in renderer
- All IPC validated with Zod schemas
