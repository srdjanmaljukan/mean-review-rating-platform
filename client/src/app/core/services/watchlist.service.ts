import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Title } from '../../shared/models/title.model';

export interface WatchlistItem {
  _id: string;
  title: Title;
  addedAt: string;
}

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/watchlist`;

  getMyWatchlist(): Observable<{ items: WatchlistItem[] }> {
    return this.http.get<{ items: WatchlistItem[] }>(this.baseUrl);
  }

  checkStatus(titleId: string): Observable<{ isWatchlisted: boolean }> {
    return this.http.get<{ isWatchlisted: boolean }>(`${this.baseUrl}/status/${titleId}`);
  }

  add(titleId: string): Observable<{ item: WatchlistItem }> {
    return this.http.post<{ item: WatchlistItem }>(this.baseUrl, { titleId });
  }

  remove(titleId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${titleId}`);
  }
}