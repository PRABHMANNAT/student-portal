import { Router } from 'express';

import {
  addNoteComment,
  generateNotesStream,
  getUserNotes,
  saveNotes
} from '../controllers/notesController.js';

const router = Router();

router.post('/generate', generateNotesStream);
router.post('/save', saveNotes);
router.post('/comment', addNoteComment);
router.get('/:userId', getUserNotes);

export default router;
