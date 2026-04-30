import { Router } from 'express';

import {
  generateRoadmap,
  getRoadmapCollections,
  saveRoadmap
} from '../controllers/roadmapController.js';

const router = Router();

router.post('/generate', generateRoadmap);
router.post('/save', saveRoadmap);
router.get('/collections/:userId', getRoadmapCollections);

export default router;
