import { Request, Response } from 'express';
import User from '../models/User';
import Review from '../models/Review';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    if (!username || typeof username !== 'string') {
      res.status(400).json({ message: 'Invalid username' });
      return;
    }

    const user = await User.findOne({ username }).select('username createdAt');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const reviews = await Review.find({ user: user._id })
      .populate('title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      user: { username: user.username, createdAt: user.createdAt },
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
};