import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  status: text('status', { enum: ['active', 'on-hold', 'completed', 'archived'] }).default('active').notNull(),
  color: text('color'),
  icon: text('icon'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  // Future: Azure sync fields
  azureSyncId: text('azure_sync_id'),
  lastSyncedAt: text('last_synced_at'),
});

export const updates = sqliteTable('updates', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  contentPlain: text('content_plain'),
  category: text('category'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  // Future: LLM improvements
  improvedContent: text('improved_content'),
  // Future: Azure sync fields
  azureSyncId: text('azure_sync_id'),
  lastSyncedAt: text('last_synced_at'),
});

export const settings = sqliteTable('settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
});
