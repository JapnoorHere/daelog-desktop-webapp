import { DaeEvent, EventType } from './event.model';

export interface WorkSession {
  id: string;
  startTs: number;
  endTs: number;
  events: DaeEvent[];
  repos: string[];
  duration: number;
}

export interface FilterChip {
  types: EventType[];
  label: string;
  icon: string;
  color: string;
}
