import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Project operations (to be implemented)
  // getProjects: () => ipcRenderer.invoke('projects:getAll'),
  // createProject: (data) => ipcRenderer.invoke('projects:create', data),
  // updateProject: (id, data) => ipcRenderer.invoke('projects:update', id, data),
  // deleteProject: (id) => ipcRenderer.invoke('projects:delete', id),

  // Update operations (to be implemented)
  // getUpdates: (projectId) => ipcRenderer.invoke('updates:getByProject', projectId),
  // createUpdate: (data) => ipcRenderer.invoke('updates:create', data),

  // Platform info
  platform: process.platform,
});

// Type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      platform: NodeJS.Platform;
    };
  }
}
