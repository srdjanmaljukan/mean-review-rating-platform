import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistService, WatchlistItem } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.scss',
})
export class WatchlistComponent implements OnInit {
  private watchlistService = inject(WatchlistService);

  items = signal<WatchlistItem[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.watchlistService.getMyWatchlist().subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(titleId: string): void {
    this.watchlistService.remove(titleId).subscribe({
      next: () => {
        this.items.set(this.items().filter((i) => i.title._id !== titleId));
      },
    });
  }
}