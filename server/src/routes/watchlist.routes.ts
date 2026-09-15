import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  addToWatchlist,
  removeFromWatchlist,
  getMyWatchlist,
  checkWatchlistStatus,
} from '../controllers/watchlist.controller';

const router = Router();

router.get('/', authenticate, getMyWatchlist);
router.get('/status/:titleId', authenticate, checkWatchlistStatus);
router.post('/', authenticate, addToWatchlist);
router.delete('/:titleId', authenticate, removeFromWatchlist);

export default router;