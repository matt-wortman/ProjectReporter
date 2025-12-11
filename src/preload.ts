import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './shared/ipc-channels';
import type { CreateProjectInput, UpdateProject, CreateUpdate, Project, Update, ProjectWithUpdates } from './shared/types';

// API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
const electronAPI = {
  // Project operations
  projects: {
    getAll: (): Promise<ApiResponse<ProjectWithUpdates[]>> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_GET_ALL),
    getById: (id: string): Promise<ApiResponse<ProjectWithUpdates>> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_GET_BY_ID, id),
    create: (data: CreateProjectInput): Promise<ApiResponse<Project>> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_CREATE, data),
    update: (data: UpdateProject): Promise<ApiResponse<Project>> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_UPDATE, data),
    delete: (id: string): Promise<ApiResponse<void>> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_DELETE, id),
  },

  // Update operations
  updates: {
    getByProject: (projectId: string): Promise<ApiResponse<Update[]>> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_GET_BY_PROJECT, projectId),
    create: (data: CreateUpdate): Promise<ApiResponse<Update>> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_CREATE, data),
    update: (id: string, content: string, category?: string): Promise<ApiResponse<Update>> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_UPDATE, id, content, category),
    delete: (id: string): Promise<ApiResponse<void>> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_DELETE, id),
  },

  // Window controls
  window: {
    minimize: () => ipcRenderer.send(IPC_CHANNELS.WINDOW_MINIMIZE),
    maximize: () => ipcRenderer.send(IPC_CHANNELS.WINDOW_MAXIMIZE),
    close: () => ipcRenderer.send(IPC_CHANNELS.WINDOW_CLOSE),
  },
};

// Expose the API to the renderer
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declaration for use in renderer
declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}
