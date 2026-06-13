export const API_BASE = 'http://localhost:8080/api/v1';

export const ENDPOINTS = {
  events: `${API_BASE}/events`,
  sync: `${API_BASE}/sync`,
  health: `${API_BASE}/health`,
} as const;
