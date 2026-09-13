import axios from 'axios';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export interface JikanResult {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string | null;
  mediaType: 'anime' | 'manga';
}

const mapResult = (item: any, mediaType: 'anime' | 'manga'): JikanResult => ({
  id: item.mal_id,
  title: item.title,
  overview: item.synopsis || '',
  posterPath: item.images?.jpg?.image_url || null,
  releaseDate: mediaType === 'anime' ? item.aired?.from : item.published?.from,
  mediaType,
});

export const searchAnime = async (query: string): Promise<JikanResult[]> => {
  const { data } = await axios.get(`${JIKAN_BASE_URL}/anime`, {
  params: { q: query },
  timeout: 5000,
});
  return data.data.map((item: any) => mapResult(item, 'anime'));
};

export const searchManga = async (query: string): Promise<JikanResult[]> => {
const { data } = await axios.get(`${JIKAN_BASE_URL}/anime`, {
  params: { q: query },
  timeout: 5000,
});
  return data.data.map((item: any) => mapResult(item, 'manga'));
};

export const getAnimeById = async (id: string): Promise<JikanResult> => {
  const { data } = await axios.get(`${JIKAN_BASE_URL}/anime/${id}`, {
    timeout: 5000,
  });
  return mapResult(data.data, 'anime');
};

export const getMangaById = async (id: string): Promise<JikanResult> => {
  const { data } = await axios.get(`${JIKAN_BASE_URL}/manga/${id}`, {
    timeout: 5000,
  });
  return mapResult(data.data, 'manga');
};