import { z } from 'zod';

// Project status enum
export const ProjectStatus = {
  ACTIVE: 'active',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];

// Zod schemas for validation
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().default(''),
  status: z.enum(['active', 'on-hold', 'completed', 'archived']).default('active'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(10).optional(),
  isPublished: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).default(''),
  status: z.enum(['active', 'on-hold', 'completed', 'archived']).default('active'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(10).optional(),
  isPublished: z.boolean().default(false),
});

// Input type for creating projects (before defaults are applied)
export type CreateProjectInput = {
  name: string;
  description?: string;
  status?: 'active' | 'on-hold' | 'completed' | 'archived';
  color?: string;
  icon?: string;
  isPublished?: boolean;
};

export const UpdateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'on-hold', 'completed', 'archived']).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(10).optional(),
  isPublished: z.boolean().optional(),
});

export const UpdateSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  content: z.string().min(1, 'Content is required'),
  contentPlain: z.string().optional(),
  category: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateUpdateSchema = z.object({
  projectId: z.string().uuid(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional(),
});

export const SettingSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.string(),
});

// TypeScript types derived from Zod schemas
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type Update = z.infer<typeof UpdateSchema>;
export type CreateUpdate = z.infer<typeof CreateUpdateSchema>;
export type Setting = z.infer<typeof SettingSchema>;

// Project with updates
export interface ProjectWithUpdates extends Project {
  updates: Update[];
  lastUpdate?: Update;
}
