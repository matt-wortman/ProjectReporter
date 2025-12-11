import { ipcMain, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../../shared/ipc-channels';
import { CreateProjectSchema, UpdateProjectSchema, CreateUpdateSchema } from '../../shared/types';
import { projectService } from '../services/project-service';
import { updateService } from '../services/update-service';

export function registerIpcHandlers() {
  // Project handlers
  ipcMain.handle(IPC_CHANNELS.PROJECT_GET_ALL, async () => {
    try {
      return { success: true, data: projectService.getAllProjectsWithUpdates() };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.PROJECT_GET_BY_ID, async (_, id: string) => {
    try {
      const project = projectService.getProjectWithUpdates(id);
      if (!project) {
        return { success: false, error: 'Project not found' };
      }
      return { success: true, data: project };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.PROJECT_CREATE, async (_, data: unknown) => {
    try {
      const parsed = CreateProjectSchema.safeParse(data);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }
      const project = projectService.createProject(parsed.data);
      return { success: true, data: project };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.PROJECT_UPDATE, async (_, data: unknown) => {
    try {
      const parsed = UpdateProjectSchema.safeParse(data);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }
      const project = projectService.updateProject(parsed.data);
      if (!project) {
        return { success: false, error: 'Project not found' };
      }
      return { success: true, data: project };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.PROJECT_DELETE, async (_, id: string) => {
    try {
      const success = projectService.deleteProject(id);
      return { success, error: success ? undefined : 'Project not found' };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // Update handlers
  ipcMain.handle(IPC_CHANNELS.UPDATE_GET_BY_PROJECT, async (_, projectId: string) => {
    try {
      const updates = updateService.getUpdatesByProject(projectId);
      return { success: true, data: updates };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_CREATE, async (_, data: unknown) => {
    try {
      const parsed = CreateUpdateSchema.safeParse(data);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }
      const update = updateService.createUpdate(parsed.data);
      return { success: true, data: update };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_UPDATE, async (_, id: string, content: string, category?: string) => {
    try {
      const update = updateService.updateUpdate(id, content, category);
      if (!update) {
        return { success: false, error: 'Update not found' };
      }
      return { success: true, data: update };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_DELETE, async (_, id: string) => {
    try {
      const success = updateService.deleteUpdate(id);
      return { success, error: success ? undefined : 'Update not found' };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // Window handlers
  ipcMain.on(IPC_CHANNELS.WINDOW_MINIMIZE, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.minimize();
  });

  ipcMain.on(IPC_CHANNELS.WINDOW_MAXIMIZE, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window?.isMaximized()) {
      window.unmaximize();
    } else {
      window?.maximize();
    }
  });

  ipcMain.on(IPC_CHANNELS.WINDOW_CLOSE, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  });
}
