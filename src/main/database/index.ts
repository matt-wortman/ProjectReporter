import { app } from 'electron';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'node:path';
import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqlite: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function initDatabase() {
  if (db) {
    return db;
  }

  // Store database in user data directory
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'project-reporter.db');

  console.log('Initializing database at:', dbPath);

  sqlite = new Database(dbPath);

  // Enable WAL mode for better performance
  sqlite.pragma('journal_mode = WAL');

  db = drizzle(sqlite, { schema });

  // Run migrations / create tables
  createTables();

  return db;
}

function createTables() {
  if (!sqlite) return;

  // Create projects table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      color TEXT,
      icon TEXT,
      is_published INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      azure_sync_id TEXT,
      last_synced_at INTEGER
    )
  `);

  // Create updates table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      content_plain TEXT,
      category TEXT DEFAULT 'general',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      improved_content TEXT,
      azure_sync_id TEXT,
      last_synced_at INTEGER,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  // Create settings table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      updated_at INTEGER NOT NULL
    )
  `);

  // Create indexes for better query performance
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_updates_project_id ON updates(project_id);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
  `);

  console.log('Database tables created/verified');
}

export function closeDatabase() {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
    db = null;
    console.log('Database connection closed');
  }
}

export { schema };
