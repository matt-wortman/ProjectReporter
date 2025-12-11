import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Project statuses
export const projectStatuses = ['active', 'on-hold', 'completed', 'archived'] as const;
export type ProjectStatus = typeof projectStatuses[number];

// Projects table
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', { enum: projectStatuses }).notNull().default('active'),
  color: text('color'), // Hex color for project card gradient
  icon: text('icon'), // Emoji or icon identifier
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  // Future-ready fields for Azure sync
  azureSyncId: text('azure_sync_id'),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

// Update categories for future use
export const updateCategories = ['general', 'ip', 'marketing', 'evaluation'] as const;
export type UpdateCategory = typeof updateCategories[number];

// Updates table
export const updates = sqliteTable('updates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  content: text('content').notNull(), // Markdown content
  contentPlain: text('content_plain'), // Plain text version for search
  category: text('category', { enum: updateCategories }).default('general'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  // Future-ready fields
  improvedContent: text('improved_content'), // LLM grammar-improved version
  azureSyncId: text('azure_sync_id'),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

// Settings table for app configuration
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value', { mode: 'json' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Type exports for use in application
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Update = typeof updates.$inferSelect;
export type NewUpdate = typeof updates.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
