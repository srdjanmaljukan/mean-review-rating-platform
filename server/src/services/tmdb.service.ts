import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

export interface TmdbResult {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  mediaType: 'movie' | 'tv';
}

const mapResult = (item: any, mediaType: 'movie' | 'tv'): TmdbResult => ({
  id: item.id,
  title: mediaType === 'movie' ? item.title : item.name,
  overview: item.overview,
  posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
  releaseDate: mediaType === 'movie' ? item.release_date : item.first_air_date,
  mediaType,
});

export const searchMovies = async (query: string): Promise<TmdbResult[]> => {
  const { data } = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: { api_key: API_KEY, query },
    timeout: 5000,
  });
  return data.results.map((item: any) => mapResult(item, 'movie'));
};

export const searchTvShows = async (query: string): Promise<TmdbResult[]> => {
  const { data } = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
    params: { api_key: API_KEY, query },
    timeout: 5000,
  });
  return data.results.map((item: any) => mapResult(item, 'tv'));
};

export const getMovieById = async (id: string): Promise<TmdbResult> => {
  const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
    params: { api_key: API_KEY },
    timeout: 5000,
  });
  return mapResult(data, 'movie');
};

export const getTvShowById = async (id: string): Promise<TmdbResult> => {
  const { data } = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
    params: { api_key: API_KEY },
    timeout: 5000,
  });
  return mapResult(data, 'tv');
};