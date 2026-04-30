import { Router } from 'express';

import {
  listCollections,
  removeCollection,
  saveCollection
} from '../controllers/collectionsController.js';

const router = Router();

router.get('/:userId', listCollections);
router.get('/', listCollections);
router.post('/', saveCollection);
router.delete('/:id', removeCollection);

export default router;
