export type MediaType = 'movie' | 'tv' | 'game' | 'anime' | 'manga';

export interface Title {
  _id: string;
  externalId: string;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string | null;
}

export interface SearchResult {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string | null;
  mediaType: MediaType;
}