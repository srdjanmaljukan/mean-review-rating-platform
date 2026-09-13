import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createReview,
  getReviewsForTitle,
  updateReview,
  deleteReview,
} from '../controllers/review.controller';

const router = Router();

router.get('/title/:titleId', getReviewsForTitle);   // public — anyone can view reviews
router.post('/', authenticate, createReview);         // protected
router.put('/:id', authenticate, updateReview);        // protected
router.delete('/:id', authenticate, deleteReview);     // protected

export default router;