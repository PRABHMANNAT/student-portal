import { Router } from 'express';

import {
  getJobDetailController,
  saveJobController,
  searchJobsController
} from '../controllers/jobsController.js';

const router = Router();

router.post('/search', searchJobsController);
router.post('/save', saveJobController);
router.get('/:id', getJobDetailController);

export default router;
