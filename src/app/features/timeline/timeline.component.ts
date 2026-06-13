import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { SessionService } from '../../core/services/session.service';
import { DaeEvent, EventPayload, EventType } from '../../models/event.model';
import { FilterChip, WorkSession } from '../../models/session.model';

@Component({
  selector: 'app-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule, ButtonModule, DatePipe, SlicePipe],
  templateUrl: './timeline.component.html',
})
export class TimelineComponent implements OnInit {
  readonly #sessionService = inject(SessionService);

  sessions = signal<WorkSession[]>([]);
  isLoading = signal(false);
  today = new Date();
  expandedSession = signal<string | null>(null);

  activeFilters = signal<Set<EventType>>(new Set(Object.values(EventType) as EventType[]));

  readonly allFilterChips: FilterChip[] = [
    { types: [EventType.GIT_COMMIT, EventType.GIT_PUSH, EventType.GIT_PULL], label: 'Git',      icon: 'pi-code-branch', color: '#34d399' },
    { types: [EventType.FILE_SAVE],                                           label: 'Files',    icon: 'pi-file-edit',   color: '#a78bfa' },
    { types: [EventType.TERMINAL_CMD],                                        label: 'Terminal', icon: 'pi-terminal',    color: '#fbbf24' },
    { types: [EventType.BROWSER_TAB],                                         label: 'Browser',  icon: 'pi-globe',       color: '#38bdf8' },
    { types: [EventType.WINDOW_FOCUS],                                        label: 'Windows',  icon: 'pi-desktop',     color: '#94a3b8' },
  ];

  filteredSessions = computed(() => {
    const filters = this.activeFilters();
    return this.sessions().map(s => ({
      ...s,
      events: s.events.filter(e => filters.has(e.eventType)),
    })).filter(s => s.events.length > 0);
  });

  totalEvents = computed(() =>
    this.filteredSessions().reduce((sum, s) => sum + s.events.length, 0)
  );

  totalActiveTime = computed(() =>
    this.filteredSessions().reduce((sum, s) => sum + s.duration, 0)
  );

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    try {
      const data = await this.#sessionService.fetchByRange(start.getTime(), end.getTime());
      this.sessions.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleFilter(types: EventType[]): void {
    const current = new Set(this.activeFilters());
    const allActive = types.every(t => current.has(t));
    if (allActive) {
      const remaining = current.size - types.filter(t => current.has(t)).length;
      if (remaining > 0) types.forEach(t => current.delete(t));
    } else {
      types.forEach(t => current.add(t));
    }
    this.activeFilters.set(current);
  }

  isChipActive(types: EventType[]): boolean {
    return types.every(t => this.activeFilters().has(t));
  }

  toggleSession(id: string): void {
    this.expandedSession.set(this.expandedSession() === id ? null : id);
  }

  isSessionCollapsed(id: string): boolean {
    const expanded = this.expandedSession();
    return expanded !== null && expanded !== id;
  }

  formatDuration(ms: number): string {
    if (ms < 60_000) return '< 1m';
    const minutes = Math.floor(ms / 60_000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
  }

  getPayload(event: DaeEvent): EventPayload {
    return (event.payload as EventPayload) ?? {};
  }

  iconColor(type: EventType): string {
    const map: Record<EventType, string> = {
      [EventType.GIT_COMMIT]:   '#34d399',
      [EventType.GIT_PUSH]:     '#34d399',
      [EventType.GIT_PULL]:     '#60a5fa',
      [EventType.FILE_SAVE]:    '#a78bfa',
      [EventType.WINDOW_FOCUS]: '#94a3b8',
      [EventType.TERMINAL_CMD]: '#fbbf24',
      [EventType.BROWSER_TAB]:  '#38bdf8',
    };
    return map[type] ?? '#94a3b8';
  }

  label(type: EventType): string {
    const map: Record<EventType, string> = {
      [EventType.GIT_COMMIT]:   'Committed',
      [EventType.GIT_PUSH]:     'Pushed',
      [EventType.GIT_PULL]:     'Pulled',
      [EventType.FILE_SAVE]:    'File Saved',
      [EventType.WINDOW_FOCUS]: 'Window Focus',
      [EventType.TERMINAL_CMD]: 'Terminal',
      [EventType.BROWSER_TAB]:  'Browser',
    };
    return map[type] ?? type;
  }
}
