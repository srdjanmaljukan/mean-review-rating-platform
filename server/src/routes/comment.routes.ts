import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createComment, getCommentsForReview, deleteComment } from '../controllers/comment.controller';

const router = Router();

router.get('/review/:reviewId', getCommentsForReview);
router.post('/', authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);

export default router;