import axios from 'axios';

const RAWG_BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

export interface RawgResult {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  mediaType: 'game';
}

const mapResult = (item: any): RawgResult => ({
  id: item.id,
  title: item.name,
  overview: item.description_raw || '',
  posterPath: item.background_image || null,
  releaseDate: item.released,
  mediaType: 'game',
});

export const searchGames = async (query: string): Promise<RawgResult[]> => {
  const { data } = await axios.get(`${RAWG_BASE_URL}/games`, {
    params: { key: API_KEY, search: query },
    timeout: 5000,
  });
  return data.results.map(mapResult);
};

export const getGameById = async (id: string): Promise<RawgResult> => {
  const { data } = await axios.get(`${RAWG_BASE_URL}/games/${id}`, {
    params: { key: API_KEY },
    timeout: 5000,
  });
  return mapResult(data);
};