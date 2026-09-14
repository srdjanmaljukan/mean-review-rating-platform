import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewsResponse } from '../../shared/models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/reviews`;

  getReviewsForTitle(titleId: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.baseUrl}/title/${titleId}`);
  }

  getReviewById(id: string): Observable<{ review: Review }> {
    return this.http.get<{ review: Review }>(`${this.baseUrl}/${id}`);
  }

  createReview(titleId: string, rating: number, text: string): Observable<{ review: Review }> {
    return this.http.post<{ review: Review }>(this.baseUrl, { titleId, rating, text });
  }

  updateReview(id: string, rating: number, text: string): Observable<{ review: Review }> {
    return this.http.put<{ review: Review }>(`${this.baseUrl}/${id}`, { rating, text });
  }

  deleteReview(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
