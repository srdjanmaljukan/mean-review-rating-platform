# Review Platform

A full-stack review and rating platform for movies, TV shows, video games, anime, and manga — built with the MEAN stack (MongoDB, Express, Angular, Node.js).

Users can search across all five media types in one place, view details pulled live from external APIs, write and manage their own reviews, comment on other users' reviews, and keep a personal collection of titles they want to check out.

## Features

- **Unified search** across movies, TV shows, games, anime, and manga, powered by TMDB, RAWG, and Jikan (MyAnimeList)
- **Title detail pages** with cached metadata, average rating, and full review list
- **Authentication** — JWT-based register/login, protected routes
- **Reviews** — create, edit, delete your own reviews (one per title per user); ratings render as stamped badges
- **Comments** — reply to reviews, delete your own comments
- **Collection** — save titles to a personal list, toggle on/off from any title page
- **Public profile pages** — view any user's review history at `/users/:username`

## Tech stack

**Frontend:** Angular (standalone components, signals), TypeScript, SCSS
**Backend:** Node.js, Express, TypeScript
**Database:** MongoDB (Mongoose)
**Auth:** JWT + bcrypt
**External APIs:** TMDB (movies/TV), RAWG (games), Jikan (anime/manga)


## Setup

### Prerequisites
- Node.js (v22+)
- A MongoDB Atlas cluster (or local MongoDB instance)
- API keys from [TMDB](https://www.themoviedb.org/settings/api) and [RAWG](https://rawg.io/apidocs) (Jikan needs no key)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_random_secret
TMDB_API_KEY=your_tmdb_key
RAWG_API_KEY=your_rawg_key
```

Run the backend:

```bash
npm run dev
```

Server starts on `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
ng serve
```

App runs on `http://localhost:4200`.

## API overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | — |
| POST | `/api/auth/login` | Log in | — |
| GET | `/api/titles/search?query=&type=` | Unified search | — |
| GET | `/api/titles/:mediaType/:externalId` | Title detail (cached on first fetch) | — |
| POST | `/api/reviews` | Create review | ✓ |
| GET | `/api/reviews/title/:titleId` | Reviews for a title | — |
| PUT | `/api/reviews/:id` | Edit own review | ✓ |
| DELETE | `/api/reviews/:id` | Delete own review | ✓ |
| POST | `/api/comments` | Comment on a review | ✓ |
| GET | `/api/comments/review/:reviewId` | Comments for a review | — |
| DELETE | `/api/comments/:id` | Delete own comment | ✓ |
| GET | `/api/watchlist` | Get your collection | ✓ |
| POST | `/api/watchlist` | Add title to collection | ✓ |
| DELETE | `/api/watchlist/:titleId` | Remove from collection | ✓ |
| GET | `/api/users/:username` | Public profile + review history | — |

## Notes

- External API failures during search degrade gracefully — if one source (e.g. Jikan) times out, results from the others still return.
- Title metadata is cached in MongoDB on first view, so reviews reference a stable local ID rather than an external API ID directly.