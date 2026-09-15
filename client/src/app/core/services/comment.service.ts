import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment } from '../../shared/models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/comments`;

  getForReview(reviewId: string): Observable<{ comments: Comment[] }> {
    return this.http.get<{ comments: Comment[] }>(`${this.baseUrl}/review/${reviewId}`);
  }

  create(reviewId: string, text: string): Observable<{ comment: Comment }> {
    return this.http.post<{ comment: Comment }>(this.baseUrl, { reviewId, text });
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}