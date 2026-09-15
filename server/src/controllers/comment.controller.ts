import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Comment from '../models/Comment';
import Review from '../models/Review';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { reviewId, text } = req.body;
    if (!reviewId || !text) {
      res.status(400).json({ message: 'reviewId and text are required' });
      return;
    }

    const reviewExists = await Review.findById(reviewId);
    if (!reviewExists) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    const comment = await Comment.create({ user: userId, review: reviewId, text });
    const populated = await comment.populate('user', 'username');

    res.status(201).json({ comment: populated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error });
  }
};

export const getCommentsForReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    if (!reviewId || typeof reviewId !== 'string') {
      res.status(400).json({ message: 'Invalid review ID' });
      return;
    }

    const comments = await Comment.find({ review: reviewId })
      .populate('user', 'username')
      .sort({ createdAt: 1 });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ message: 'Invalid comment ID' });
      return;
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.user.toString() !== userId) {
      res.status(403).json({ message: 'You can only delete your own comments' });
      return;
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error });
  }
};