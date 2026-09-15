import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService, UserProfile } from '../../core/services/user.service';
import { Review } from '../../shared/models/review.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  notFound = signal(false);

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username')!;

    this.userService.getProfile(username).subscribe({
      next: (res) => {
        this.profile.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) this.notFound.set(true);
      },
    });
  }

  titleRef(review: Review): any {
    return review.title as any;
  }
}