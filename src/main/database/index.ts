import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;
let sqlite: Database.Database | null = null;

export function getDatabase() {
  if (db) return db;

  // Get user data directory
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'project-updater.db');

  // Ensure directory exists
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  // Create SQLite connection
  sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');

  // Create Drizzle instance
  db = drizzle(sqlite, { schema });

  // Run migrations / create tables
  initializeTables();

  return db;
}

function initializeTables() {
  if (!sqlite) return;

  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'on-hold', 'completed', 'archived')),
      color TEXT,
      icon TEXT,
      is_published INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      azure_sync_id TEXT,
      last_synced_at TEXT
    );

    CREATE TABLE IF NOT EXISTS updates (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      content_plain TEXT,
      category TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      improved_content TEXT,
      azure_sync_id TEXT,
      last_synced_at TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_updates_project_id ON updates(project_id);
    CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  `);
}

export function closeDatabase() {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
    db = null;
  }
}

export { schema };
