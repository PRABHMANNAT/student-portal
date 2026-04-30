import { addComment, listNotes, saveNote, streamNotes } from '../services/notesService.js';

export async function generateNotesStream(req, res) {
  const { query = 'Notes on React hooks' } = req.body;
  return streamNotes({ query, res });
}

export async function saveNotes(req, res) {
  const { title, content, comments = [], userId = 'guest' } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const result = await saveNote({ title, content, comments, userId });
  return res.status(201).json(result);
}

export async function addNoteComment(req, res) {
  const { noteId, highlightedText = '', commentText = '', position = 0, userId = 'guest' } = req.body;

  if (!noteId) {
    return res.status(400).json({ error: 'noteId is required' });
  }

  const comment = await addComment({
    noteId,
    highlightedText,
    commentText,
    position,
    userId
  });

  return res.status(201).json({
    success: true,
    comment
  });
}

export async function getUserNotes(req, res) {
  const { userId = 'guest' } = req.params;
  const result = await listNotes(userId);
  return res.json(result);
}
