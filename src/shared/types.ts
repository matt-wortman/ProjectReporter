// Shared types for the application
// Re-export database types for use across the app

import type {
  Project,
  NewProject,
  Update,
  NewUpdate,
  Setting,
  ProjectStatus,
  UpdateCategory
} from '../main/database/schema';

export type {
  Project,
  NewProject,
  Update,
  NewUpdate,
  Setting,
  ProjectStatus,
  UpdateCategory
};

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Project with updates count for list views
export interface ProjectWithMeta extends Project {
  updatesCount: number;
  lastUpdate?: Update;
}

// Create/Update DTOs (Data Transfer Objects)
export interface CreateProjectDTO {
  name: string;
  description?: string;
  status?: ProjectStatus;
  color?: string;
  icon?: string;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  isPublished?: boolean;
}

export interface CreateUpdateDTO {
  projectId: number;
  content: string;
  category?: UpdateCategory;
}

export interface UpdateUpdateDTO {
  content?: string;
  category?: UpdateCategory;
}
