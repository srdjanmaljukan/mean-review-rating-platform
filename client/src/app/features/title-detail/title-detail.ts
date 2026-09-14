import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleService } from '../../core/services/title.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { Title, MediaType } from '../../shared/models/title.model';
import { Review } from '../../shared/models/review.model';

@Component({
  selector: 'app-title-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './title-detail.html',
  styleUrl: './title-detail.scss',
})
export class TitleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private titleService = inject(TitleService);
  private reviewService = inject(ReviewService);
  authService = inject(AuthService);

  title = signal<Title | null>(null);
  reviews = signal<Review[]>([]);
  averageRating = signal<number | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const mediaType = this.route.snapshot.paramMap.get('mediaType') as MediaType;
    const externalId = this.route.snapshot.paramMap.get('externalId')!;

    this.titleService.getTitleDetail(mediaType, externalId).subscribe({
      next: (res) => {
        this.title.set(res.title);
        this.loadReviews(res.title._id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadReviews(titleId: string): void {
    this.reviewService.getReviewsForTitle(titleId).subscribe({
      next: (res) => {
        this.reviews.set(res.reviews);
        this.averageRating.set(res.averageRating);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isOwnReview(review: Review): boolean {
    const currentUserId = this.authService.currentUser()?.id;
    const reviewUserId = typeof review.user === 'string' ? review.user : review.user._id;
    return currentUserId === reviewUserId;
  }

  reviewUsername(review: Review): string {
    return typeof review.user === 'string' ? 'Unknown' : review.user.username;
  }

  deleteReview(reviewId: string): void {
    if (!confirm('Delete this review?')) return;

    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        const titleId = this.title()?._id;
        if (titleId) this.loadReviews(titleId);
      },
    });
  }
}