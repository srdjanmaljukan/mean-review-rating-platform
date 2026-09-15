import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
})
export class ReviewFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reviewService = inject(ReviewService);

  form = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    text: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  isEditMode = signal(false);
  titleId = signal<string | null>(null);
  errorMessage = '';

  private mediaType: string | null = null;
  private externalId: string | null = null;

  ngOnInit(): void {
    const newTitleId = this.route.snapshot.paramMap.get('titleId');
    const editReviewId = this.route.snapshot.paramMap.get('reviewId');

    const navState = this.router.getCurrentNavigation()?.extras.state
      ?? window.history.state;
    this.mediaType = navState?.['mediaType'] ?? null;
    this.externalId = navState?.['externalId'] ?? null;

    if (newTitleId) {
      this.titleId.set(newTitleId);
      this.isEditMode.set(false);
    } else if (editReviewId) {
      this.isEditMode.set(true);
      this.loadExistingReview(editReviewId);
    }
  }

  loadExistingReview(id: string): void {
    this.reviewService.getReviewById(id).subscribe({
      next: (res) => {
        this.form.patchValue({
          rating: res.review.rating,
          text: res.review.text,
        });
        const titleRef = res.review.title as any;
        this.titleId.set(typeof titleRef === 'string' ? titleRef : titleRef._id);
        if (typeof titleRef === 'object') {
          this.mediaType = titleRef.mediaType;
          this.externalId = titleRef.externalId;
        }
      },
      error: () => {
        this.errorMessage = 'Could not load review';
      },
    });
  }

  private reviewId(): string | null {
    return this.route.snapshot.paramMap.get('reviewId');
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { rating, text } = this.form.value;

    if (this.isEditMode() && this.reviewId()) {
      this.reviewService.updateReview(this.reviewId()!, rating!, text!).subscribe({
        next: () => this.navigateBackToTitle(),
        error: (err) => (this.errorMessage = err.error?.message || 'Failed to update review'),
      });
    } else if (this.titleId()) {
      this.reviewService.createReview(this.titleId()!, rating!, text!).subscribe({
        next: () => this.navigateBackToTitle(),
        error: (err) => (this.errorMessage = err.error?.message || 'Failed to create review'),
      });
    }
  }

  private navigateBackToTitle(): void {
    if (this.mediaType && this.externalId) {
      this.router.navigate(['/title', this.mediaType, this.externalId]);
    } else {
      this.router.navigateByUrl('/search');
    }
  }
}