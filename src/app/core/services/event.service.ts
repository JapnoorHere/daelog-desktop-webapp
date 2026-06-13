import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../../constants/api.constants';
import { ApiResponse, DaeEvent } from '../../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly #http = inject(HttpClient);

  fetchByRange(from: number, to: number): Promise<DaeEvent[]> {
    return firstValueFrom(
      this.#http.get<ApiResponse<DaeEvent[]>>(ENDPOINTS.events, {
        params: { from: from.toString(), to: to.toString() },
      })
    ).then(res => res.data);
  }
}
