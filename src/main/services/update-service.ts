import { eq, desc } from 'drizzle-orm';
import { getDatabase, schema } from '../database';
import { CreateUpdate, Update } from '../../shared/types';
import { randomUUID } from 'crypto';

export class UpdateService {
  getUpdatesByProject(projectId: string): Update[] {
    const db = getDatabase();
    const results = db
      .select()
      .from(schema.updates)
      .where(eq(schema.updates.projectId, projectId))
      .orderBy(desc(schema.updates.createdAt))
      .all();

    return results.map(this.mapToUpdate);
  }

  createUpdate(data: CreateUpdate): Update {
    const db = getDatabase();
    const now = new Date().toISOString();
    const id = randomUUID();

    // Strip markdown for plain text version
    const contentPlain = this.stripMarkdown(data.content);

    const newUpdate = {
      id,
      projectId: data.projectId,
      content: data.content,
      contentPlain,
      category: data.category || null,
      createdAt: now,
      updatedAt: now,
      improvedContent: null,
      azureSyncId: null,
      lastSyncedAt: null,
    };

    db.insert(schema.updates).values(newUpdate).run();

    // Update the project's updatedAt timestamp
    db.update(schema.projects)
      .set({ updatedAt: now })
      .where(eq(schema.projects.id, data.projectId))
      .run();

    return this.mapToUpdate(newUpdate as typeof schema.updates.$inferSelect);
  }

  updateUpdate(id: string, content: string, category?: string): Update | null {
    const db = getDatabase();
    const now = new Date().toISOString();
    const contentPlain = this.stripMarkdown(content);

    const updateData: Record<string, unknown> = {
      content,
      contentPlain,
      updatedAt: now,
    };
    if (category !== undefined) updateData.category = category;

    db.update(schema.updates)
      .set(updateData)
      .where(eq(schema.updates.id, id))
      .run();

    const result = db.select().from(schema.updates).where(eq(schema.updates.id, id)).get();
    return result ? this.mapToUpdate(result) : null;
  }

  deleteUpdate(id: string): boolean {
    const db = getDatabase();
    const result = db.delete(schema.updates).where(eq(schema.updates.id, id)).run();
    return result.changes > 0;
  }

  private stripMarkdown(text: string): string {
    return text
      .replace(/#{1,6}\s?/g, '')         // Headers
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
      .replace(/(\*|_)(.*?)\1/g, '$2')    // Italic
      .replace(/~~(.*?)~~/g, '$1')        // Strikethrough
      .replace(/`{1,3}[^`]*`{1,3}/g, '')  // Code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
      .replace(/^\s*[-*+]\s/gm, '')       // List items
      .replace(/^\s*\d+\.\s/gm, '')       // Numbered lists
      .replace(/^\s*>/gm, '')             // Blockquotes
      .replace(/\n{3,}/g, '\n\n')         // Multiple newlines
      .trim();
  }

  private mapToUpdate(row: typeof schema.updates.$inferSelect): Update {
    return {
      id: row.id,
      projectId: row.projectId,
      content: row.content,
      contentPlain: row.contentPlain || undefined,
      category: row.category || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

export const updateService = new UpdateService();
