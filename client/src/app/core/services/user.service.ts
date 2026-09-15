import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review } from '../../shared/models/review.model';

export interface UserProfile {
  user: { username: string; createdAt: string };
  reviews: Review[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  getProfile(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${username}`);
  }
}