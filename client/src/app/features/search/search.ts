import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';
import { TitleCardComponent } from '../../shared/components/title-card/title-card';
import { SearchResult, MediaType } from '../../shared/models/title.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCardComponent],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent {
  private titleService = inject(TitleService);

  query = '';
  selectedType: MediaType | '' = '';
  results = signal<SearchResult[]>([]);
  loading = signal(false);
  hasSearched = signal(false);

  mediaTypes: { value: MediaType | ''; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
    { value: 'game', label: 'Games' },
    { value: 'anime', label: 'Anime' },
    { value: 'manga', label: 'Manga' },
  ];

  onSearch(): void {
    if (!this.query.trim()) return;

    this.loading.set(true);
    this.hasSearched.set(true);

    this.titleService.search(this.query, this.selectedType || undefined).subscribe({
      next: (res) => {
        this.results.set(res.results);
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.loading.set(false);
      },
    });
  }
}