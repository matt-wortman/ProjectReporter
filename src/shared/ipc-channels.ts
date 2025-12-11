// IPC Channel constants for type-safe communication between main and renderer
export const IPC_CHANNELS = {
  // Project operations
  PROJECT_GET_ALL: 'project:getAll',
  PROJECT_GET_BY_ID: 'project:getById',
  PROJECT_CREATE: 'project:create',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',

  // Update operations
  UPDATE_GET_BY_PROJECT: 'update:getByProject',
  UPDATE_CREATE: 'update:create',
  UPDATE_UPDATE: 'update:update',
  UPDATE_DELETE: 'update:delete',

  // Settings operations
  SETTING_GET: 'setting:get',
  SETTING_SET: 'setting:set',

  // Window operations
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
