import { Component, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-review-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './review-comments.html',
  styleUrl: './review-comments.scss',
})
export class ReviewCommentsComponent implements OnInit {
  private commentService = inject(CommentService);
  authService = inject(AuthService);

  reviewId = input.required<string>();

  comments = signal<Comment[]>([]);
  loading = signal(true);
  expanded = signal(false);
  newCommentText = '';
  submitting = signal(false);

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getForReview(this.reviewId()).subscribe({
      next: (res) => {
        this.comments.set(res.comments);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleExpanded(): void {
    this.expanded.set(!this.expanded());
  }

  submitComment(): void {
    const text = this.newCommentText.trim();
    if (!text || this.submitting()) return;

    this.submitting.set(true);

    this.commentService.create(this.reviewId(), text).subscribe({
      next: () => {
        this.newCommentText = '';
        this.submitting.set(false);
        this.loadComments();
      },
      error: () => this.submitting.set(false),
    });
  }

  deleteComment(id: string): void {
    if (!confirm('Delete this comment?')) return;

    this.commentService.delete(id).subscribe({
      next: () => this.loadComments(),
    });
  }

  isOwnComment(comment: Comment): boolean {
    const currentUserId = this.authService.currentUser()?.id;
    const commentUserId = typeof comment.user === 'string' ? comment.user : comment.user._id;
    return currentUserId === commentUserId;
  }

  commentUsername(comment: Comment): string {
    return typeof comment.user === 'string' ? 'Unknown' : comment.user.username;
  }
}