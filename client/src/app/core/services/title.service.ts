import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Title, SearchResult, MediaType } from '../../shared/models/title.model';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/titles`;

  search(query: string, type?: MediaType): Observable<{ results: SearchResult[] }> {
    let url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}`;
    if (type) url += `&type=${type}`;
    return this.http.get<{ results: SearchResult[] }>(url);
  }

  getTitleDetail(mediaType: MediaType, externalId: string): Observable<{ title: Title }> {
    return this.http.get<{ title: Title }>(`${this.baseUrl}/${mediaType}/${externalId}`);
  }
}