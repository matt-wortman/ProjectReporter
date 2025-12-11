import { eq, desc } from 'drizzle-orm';
import { getDatabase, schema } from '../database';
import { CreateProject, UpdateProject, Project, ProjectWithUpdates } from '../../shared/types';
import { randomUUID } from 'crypto';

export class ProjectService {
  getAllProjects(): Project[] {
    const db = getDatabase();
    const results = db.select().from(schema.projects).orderBy(desc(schema.projects.updatedAt)).all();
    return results.map(this.mapToProject);
  }

  getAllProjectsWithUpdates(): ProjectWithUpdates[] {
    const db = getDatabase();
    const projects = db.select().from(schema.projects).orderBy(desc(schema.projects.updatedAt)).all();

    return projects.map(project => {
      const updates = db
        .select()
        .from(schema.updates)
        .where(eq(schema.updates.projectId, project.id))
        .orderBy(desc(schema.updates.createdAt))
        .all();

      return {
        ...this.mapToProject(project),
        updates: updates.map(this.mapToUpdate),
        lastUpdate: updates[0] ? this.mapToUpdate(updates[0]) : undefined,
      };
    });
  }

  getProjectById(id: string): Project | null {
    const db = getDatabase();
    const result = db.select().from(schema.projects).where(eq(schema.projects.id, id)).get();
    return result ? this.mapToProject(result) : null;
  }

  getProjectWithUpdates(id: string): ProjectWithUpdates | null {
    const db = getDatabase();
    const project = db.select().from(schema.projects).where(eq(schema.projects.id, id)).get();
    if (!project) return null;

    const updates = db
      .select()
      .from(schema.updates)
      .where(eq(schema.updates.projectId, id))
      .orderBy(desc(schema.updates.createdAt))
      .all();

    return {
      ...this.mapToProject(project),
      updates: updates.map(this.mapToUpdate),
      lastUpdate: updates[0] ? this.mapToUpdate(updates[0]) : undefined,
    };
  }

  createProject(data: CreateProject): Project {
    const db = getDatabase();
    const now = new Date().toISOString();
    const id = randomUUID();

    const newProject = {
      id,
      name: data.name,
      description: data.description || '',
      status: data.status || 'active' as const,
      color: data.color || null,
      icon: data.icon || null,
      isPublished: data.isPublished || false,
      createdAt: now,
      updatedAt: now,
      azureSyncId: null,
      lastSyncedAt: null,
    };

    db.insert(schema.projects).values(newProject).run();
    return this.mapToProject(newProject as typeof schema.projects.$inferSelect);
  }

  updateProject(data: UpdateProject): Project | null {
    const db = getDatabase();
    const existing = this.getProjectById(data.id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updateData: Record<string, unknown> = { updatedAt: now };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;

    db.update(schema.projects)
      .set(updateData)
      .where(eq(schema.projects.id, data.id))
      .run();

    return this.getProjectById(data.id);
  }

  deleteProject(id: string): boolean {
    const db = getDatabase();
    const result = db.delete(schema.projects).where(eq(schema.projects.id, id)).run();
    return result.changes > 0;
  }

  private mapToProject(row: typeof schema.projects.$inferSelect): Project {
    return {
      id: row.id,
      name: row.name,
      description: row.description || '',
      status: row.status as Project['status'],
      color: row.color || undefined,
      icon: row.icon || undefined,
      isPublished: row.isPublished,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapToUpdate(row: typeof schema.updates.$inferSelect) {
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

export const projectService = new ProjectService();
