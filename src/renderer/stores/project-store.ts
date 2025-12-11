import { create } from 'zustand';
import type { ProjectWithUpdates, CreateProjectInput, UpdateProject, CreateUpdate } from '../../shared/types';

interface ProjectState {
  projects: ProjectWithUpdates[];
  selectedProjectId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  createProject: (data: CreateProjectInput) => Promise<void>;
  updateProject: (data: UpdateProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (id: string | null) => void;

  // Update actions
  createUpdate: (data: CreateUpdate) => Promise<void>;
  deleteUpdate: (id: string) => Promise<void>;

  // Helpers
  getSelectedProject: () => ProjectWithUpdates | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProjectId: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await window.electronAPI.projects.getAll();
      if (response.success && response.data) {
        set({ projects: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch projects', isLoading: false });
      }
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  createProject: async (data: CreateProjectInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await window.electronAPI.projects.create(data);
      if (response.success) {
        await get().fetchProjects();
      } else {
        set({ error: response.error || 'Failed to create project', isLoading: false });
      }
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  updateProject: async (data: UpdateProject) => {
    set({ isLoading: true, error: null });
    try {
      const response = await window.electronAPI.projects.update(data);
      if (response.success) {
        await get().fetchProjects();
      } else {
        set({ error: response.error || 'Failed to update project', isLoading: false });
      }
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await window.electronAPI.projects.delete(id);
      if (response.success) {
        const { selectedProjectId } = get();
        if (selectedProjectId === id) {
          set({ selectedProjectId: null });
        }
        await get().fetchProjects();
      } else {
        set({ error: response.error || 'Failed to delete project', isLoading: false });
      }
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  selectProject: (id: string | null) => {
    set({ selectedProjectId: id });
  },

  createUpdate: async (data: CreateUpdate) => {
    try {
      const response = await window.electronAPI.updates.create(data);
      if (response.success) {
        await get().fetchProjects();
      } else {
        set({ error: response.error || 'Failed to create update' });
      }
    } catch (error) {
      set({ error: String(error) });
    }
  },

  deleteUpdate: async (id: string) => {
    try {
      const response = await window.electronAPI.updates.delete(id);
      if (response.success) {
        await get().fetchProjects();
      } else {
        set({ error: response.error || 'Failed to delete update' });
      }
    } catch (error) {
      set({ error: String(error) });
    }
  },

  getSelectedProject: () => {
    const { projects, selectedProjectId } = get();
    return projects.find(p => p.id === selectedProjectId);
  },
}));
