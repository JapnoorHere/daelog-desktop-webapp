import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../../constants/api.constants';
import { ApiResponse } from '../../models/event.model';
import { WorkSession } from '../../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly #http = inject(HttpClient);

  fetchByRange(from: number, to: number): Promise<WorkSession[]> {
    return firstValueFrom(
      this.#http.get<ApiResponse<WorkSession[]>>(ENDPOINTS.sessions, {
        params: { from: from.toString(), to: to.toString() },
      })
    ).then(res => res.data);
  }
}
