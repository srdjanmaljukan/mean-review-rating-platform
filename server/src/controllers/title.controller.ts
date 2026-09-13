import { Request, Response } from 'express';
import * as tmdbService from '../services/tmdb.service';
import * as rawgService from '../services/rawg.service';
import * as jikanService from '../services/jikan.service';
import Title, { MediaType } from '../models/Title';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, type } = req.query as { query?: string; type?: MediaType };

    if (!query) {
      res.status(400).json({ message: 'Query parameter is required' });
      return;
    }

    let results: any[] = [];

    if (!type) {
      const settled = await Promise.allSettled([
        tmdbService.searchMovies(query),
        tmdbService.searchTvShows(query),
        rawgService.searchGames(query),
        jikanService.searchAnime(query),
        jikanService.searchManga(query),
      ]);

      results = settled
        .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
        .flatMap((r) => r.value);

      const failed = settled.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        console.warn(`${failed.length} source(s) failed during search:`, 
          failed.map((r) => (r as PromiseRejectedResult).reason?.message));
      }
    } else {
      switch (type) {
        case 'movie':
          results = await tmdbService.searchMovies(query);
          break;
        case 'tv':
          results = await tmdbService.searchTvShows(query);
          break;
        case 'game':
          results = await rawgService.searchGames(query);
          break;
        case 'anime':
          results = await jikanService.searchAnime(query);
          break;
        case 'manga':
          results = await jikanService.searchManga(query);
          break;
      }
    }

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};

export const getTitleDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mediaType, externalId } = req.params as { mediaType: MediaType; externalId: string };

    // Check cache first
    let cached = await Title.findOne({ externalId, mediaType });

    if (!cached) {
      let fresh: any;

      switch (mediaType) {
        case 'movie':
          fresh = await tmdbService.getMovieById(externalId);
          break;
        case 'tv':
          fresh = await tmdbService.getTvShowById(externalId);
          break;
        case 'game':
          fresh = await rawgService.getGameById(externalId);
          break;
        case 'anime':
          fresh = await jikanService.getAnimeById(externalId);
          break;
        case 'manga':
          fresh = await jikanService.getMangaById(externalId);
          break;
        default:
          res.status(400).json({ message: 'Invalid media type' });
          return;
      }

      cached = await Title.create({
        externalId,
        mediaType,
        title: fresh.title,
        overview: fresh.overview,
        posterPath: fresh.posterPath,
        releaseDate: fresh.releaseDate,
      });
    }

    res.status(200).json({ title: cached });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch title', error });
  }
};