// IPC Channel constants for type-safe communication between main and renderer

export const IPC_CHANNELS = {
  // Project operations
  PROJECTS: {
    GET_ALL: 'projects:getAll',
    GET_BY_ID: 'projects:getById',
    CREATE: 'projects:create',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
  },

  // Update operations
  UPDATES: {
    GET_BY_PROJECT: 'updates:getByProject',
    GET_BY_ID: 'updates:getById',
    CREATE: 'updates:create',
    UPDATE: 'updates:update',
    DELETE: 'updates:delete',
  },

  // Settings operations
  SETTINGS: {
    GET: 'settings:get',
    SET: 'settings:set',
  },
} as const;

// Type helper to extract all channel values
export type IPCChannel =
  | typeof IPC_CHANNELS.PROJECTS[keyof typeof IPC_CHANNELS.PROJECTS]
  | typeof IPC_CHANNELS.UPDATES[keyof typeof IPC_CHANNELS.UPDATES]
  | typeof IPC_CHANNELS.SETTINGS[keyof typeof IPC_CHANNELS.SETTINGS];
