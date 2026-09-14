import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Review from "../models/Review";
import Title from "../models/Title";

// Create a review
export const createReview = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { titleId, rating, text } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!titleId || rating === undefined || !text) {
      res
        .status(400)
        .json({ message: "titleId, rating, and text are required" });
      return;
    }

    const titleExists = await Title.findById(titleId);
    if (!titleExists) {
      res.status(404).json({ message: "Title not found" });
      return;
    }

    const existing = await Review.findOne({ user: userId, title: titleId });
    if (existing) {
      res.status(409).json({ message: "You have already reviewed this title" });
      return;
    }

    const review = await Review.create({
      user: userId,
      title: titleId,
      rating,
      text,
    });
    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error });
  }
};

// Get all reviews for a title (+ average rating)
export const getReviewsForTitle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { titleId } = req.params;

    if (!titleId || typeof titleId !== 'string') {
      res.status(400).json({ message: 'Invalid title ID' });
      return;
    }

    const reviews = await Review.find({ title: titleId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    res.status(200).json({ reviews, averageRating, count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
};

export const getReviewById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate("title");

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch review", error });
  }
};

// Update own review
export const updateReview = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (review.user.toString() !== userId) {
      res.status(403).json({ message: "You can only edit your own reviews" });
      return;
    }

    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;
    review.updatedAt = new Date();

    await review.save();
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review", error });
  }
};

// Delete own review
export const deleteReview = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (review.user.toString() !== userId) {
      res.status(403).json({ message: "You can only delete your own reviews" });
      return;
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error });
  }
};
