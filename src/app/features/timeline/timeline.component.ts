import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { EventService } from '../../core/services/event.service';
import { DaeEvent, EventType } from '../../models/event.model';

@Component({
  selector: 'app-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineModule, CardModule, TagModule, SkeletonModule, ButtonModule, DatePipe],
  templateUrl: './timeline.component.html',
})
export class TimelineComponent implements OnInit {
  readonly #eventService = inject(EventService);

  events = signal<DaeEvent[]>([]);
  isLoading = signal(false);
  today = new Date();

  totalEvents = computed(() => this.events().length);

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
      const data = await this.#eventService.fetchByRange(start.getTime(), end.getTime());
      this.events.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  severity(type: EventType): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<EventType, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      [EventType.GIT_COMMIT]: 'success',
      [EventType.GIT_PUSH]: 'success',
      [EventType.GIT_PULL]: 'info',
      [EventType.FILE_SAVE]: 'secondary',
      [EventType.WINDOW_FOCUS]: 'secondary',
      [EventType.TERMINAL_CMD]: 'warn',
      [EventType.BROWSER_TAB]: 'info',
    };
    return map[type] ?? 'secondary';
  }
}
