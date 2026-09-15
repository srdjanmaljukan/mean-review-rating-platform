import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Watchlist from '../models/Watchlist';
import Title from '../models/Title';

export const addToWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { titleId } = req.body;
    if (!titleId) {
      res.status(400).json({ message: 'titleId is required' });
      return;
    }

    const titleExists = await Title.findById(titleId);
    if (!titleExists) {
      res.status(404).json({ message: 'Title not found' });
      return;
    }

    const existing = await Watchlist.findOne({ user: userId, title: titleId });
    if (existing) {
      res.status(409).json({ message: 'Already in watchlist' });
      return;
    }

    const item = await Watchlist.create({ user: userId, title: titleId });
    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to watchlist', error });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { titleId } = req.params;
    if (!titleId || typeof titleId !== 'string') {
      res.status(400).json({ message: 'Invalid title ID' });
      return;
    }

    await Watchlist.findOneAndDelete({ user: userId, title: titleId });
    res.status(200).json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from watchlist', error });
  }
};

export const getMyWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const items = await Watchlist.find({ user: userId })
      .populate('title')
      .sort({ addedAt: -1 });

    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch watchlist', error });
  }
};

// Used by title-detail page to know if the current title is already watchlisted
export const checkWatchlistStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { titleId } = req.params;
    if (!titleId || typeof titleId !== 'string') {
      res.status(400).json({ message: 'Invalid title ID' });
      return;
    }

    const item = await Watchlist.findOne({ user: userId, title: titleId });
    res.status(200).json({ isWatchlisted: !!item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check watchlist status', error });
  }
};