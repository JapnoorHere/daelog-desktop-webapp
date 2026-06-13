export enum EventType {
  GIT_COMMIT = 'GIT_COMMIT',
  GIT_PUSH = 'GIT_PUSH',
  GIT_PULL = 'GIT_PULL',
  FILE_SAVE = 'FILE_SAVE',
  WINDOW_FOCUS = 'WINDOW_FOCUS',
  TERMINAL_CMD = 'TERMINAL_CMD',
  BROWSER_TAB = 'BROWSER_TAB',
}

export interface EventPayload {
  message?: string;
  hash?: string;
  branch?: string;
  command?: string;
  url?: string;
  title?: string;
  app?: string;
  filePath?: string;
}

export interface DaeEvent {
  id: string;
  sessionId: string;
  eventType: EventType;
  payload: unknown;
  repo: string;
  filePath: string;
  ts: number;
  synced: boolean;
  createdAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { 
    code: string; 
    message: string 
  };
}
