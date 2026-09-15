import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleService } from '../../core/services/title.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Title, MediaType } from '../../shared/models/title.model';
import { Review } from '../../shared/models/review.model';
import { ReviewCommentsComponent } from '../../shared/components/review-comments/review-comments';

@Component({
  selector: 'app-title-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReviewCommentsComponent],
  templateUrl: './title-detail.html',
  styleUrl: './title-detail.scss',
})
export class TitleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private titleService = inject(TitleService);
  private reviewService = inject(ReviewService);
  private watchlistService = inject(WatchlistService);
  authService = inject(AuthService);

  title = signal<Title | null>(null);
  reviews = signal<Review[]>([]);
  averageRating = signal<number | null>(null);
  loading = signal(true);
  isWatchlisted = signal(false);
  watchlistBusy = signal(false);

  ngOnInit(): void {
    const mediaType = this.route.snapshot.paramMap.get('mediaType') as MediaType;
    const externalId = this.route.snapshot.paramMap.get('externalId')!;

    this.titleService.getTitleDetail(mediaType, externalId).subscribe({
      next: (res) => {
        this.title.set(res.title);
        this.loadReviews(res.title._id);
        if (this.authService.isLoggedIn()) {
          this.checkWatchlistStatus(res.title._id);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  checkWatchlistStatus(titleId: string): void {
    this.watchlistService.checkStatus(titleId).subscribe({
      next: (res) => this.isWatchlisted.set(res.isWatchlisted),
    });
  }

  toggleWatchlist(): void {
    const titleId = this.title()?._id;
    if (!titleId || this.watchlistBusy()) return;

    this.watchlistBusy.set(true);

    if (this.isWatchlisted()) {
      this.watchlistService.remove(titleId).subscribe({
        next: () => {
          this.isWatchlisted.set(false);
          this.watchlistBusy.set(false);
        },
        error: () => this.watchlistBusy.set(false),
      });
    } else {
      this.watchlistService.add(titleId).subscribe({
        next: () => {
          this.isWatchlisted.set(true);
          this.watchlistBusy.set(false);
        },
        error: () => this.watchlistBusy.set(false),
      });
    }
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