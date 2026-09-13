import { Router } from 'express';
import { search, getTitleDetail } from '../controllers/title.controller';

const router = Router();

router.get('/search', search);
router.get('/:mediaType/:externalId', getTitleDetail);

export default router;