import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
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
export class SearchComponent implements OnDestroy {
  private titleService = inject(TitleService);
  private router = inject(Router);

  query = '';
  selectedType: MediaType | '' = '';
  results = signal<SearchResult[]>([]);
  loading = signal(false);
  hasSearched = signal(false);

  suggestions = signal<SearchResult[]>([]);
  showSuggestions = signal(false);
  suggestionsLoading = signal(false);

  private queryInput$ = new Subject<string>();

  mediaTypes: { value: MediaType | ''; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
    { value: 'game', label: 'Games' },
    { value: 'anime', label: 'Anime' },
    { value: 'manga', label: 'Manga' },
  ];

  constructor() {
    this.queryInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((q) => q.trim().length >= 2),
        switchMap((q) => {
          this.suggestionsLoading.set(true);
          return this.titleService.search(q, this.selectedType || undefined);
        })
      )
      .subscribe({
        next: (res) => {
          this.suggestions.set(res.results.slice(0, 8));
          this.suggestionsLoading.set(false);
          this.showSuggestions.set(true);
        },
        error: () => {
          this.suggestions.set([]);
          this.suggestionsLoading.set(false);
        },
      });
  }

  onInputChange(): void {
    if (this.query.trim().length < 2) {
      this.showSuggestions.set(false);
      this.suggestions.set([]);
      return;
    }
    this.queryInput$.next(this.query);
  }

  selectSuggestion(result: SearchResult): void {
    this.showSuggestions.set(false);
    this.router.navigate(['/title', result.mediaType, result.id]);
  }

  hideSuggestions(): void {
    // slight delay so a click on a suggestion registers before the dropdown closes
    setTimeout(() => this.showSuggestions.set(false), 150);
  }

  onSearch(): void {
    if (!this.query.trim()) return;

    this.showSuggestions.set(false);
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

  ngOnDestroy(): void {
    this.queryInput$.complete();
  }
}