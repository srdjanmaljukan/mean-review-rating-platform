import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((m) => m.SearchComponent),
  },
  {
    path: 'title/:mediaType/:externalId',
    loadComponent: () =>
      import('./features/title-detail/title-detail').then((m) => m.TitleDetailComponent),
  },
  {
    path: 'review/new/:titleId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/review/review-form/review-form').then((m) => m.ReviewFormComponent),
  },
  {
    path: 'review/edit/:reviewId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/review/review-form/review-form').then((m) => m.ReviewFormComponent),
  },
  {
    path: 'watchlist',
    canActivate: [authGuard],
    loadComponent: () => import('./features/watchlist/watchlist').then((m) => m.WatchlistComponent),
  },
  {
    path: 'users/:username',
    loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileComponent),
  },
  { path: '**', redirectTo: 'search' },
];
