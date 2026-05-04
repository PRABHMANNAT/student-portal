import mongoose from 'mongoose';
import OpenAI from 'openai';

import Note from '../models/Note.js';
import { notesDemo } from './demoCatalog.js';

const memoryNotes = [
  {
    id: 'demo-note-1',
    userId: 'guest',
    title: notesDemo.note.title,
    content: notesDemo.note.content,
    comments: notesDemo.comments,
    savedAt: '2026-04-30T08:30:00.000Z'
  }
];

function setSseHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
}

function chunkWords(content) {
  return content.match(/\S+\s*/g) || [content];
}

async function streamDemoContent(res, content) {
  for (const token of chunkWords(content)) {
    res.write(`data: ${JSON.stringify({ text: token })}\n\n`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

function buildPrompt(query) {
  return `You are Athena, an expert educator. Generate comprehensive, well-structured notes in Markdown format.
Use ## headings for sections, bullet points for lists, **bold** for key terms, code blocks for code examples.
Be thorough but organized. Include:
- Core concept explanation
- Key terms with definitions
- Practical examples
- Common pitfalls
- Quick reference summary at end

Topic: ${query}`;
}

async function streamWithOpenAI(res, query) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key');
  }

  const client = new OpenAI({ apiKey });

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'You are Athena, an expert educator. Generate comprehensive, well-structured notes in Markdown format with ## headings, bullets, bold key terms, code blocks, practical examples, common pitfalls, and a quick reference summary.'
      },
      {
        role: 'user',
        content: buildPrompt(query)
      }
    ]
  });

  for await (const chunk of stream) {
    const text = chunk.choices?.[0]?.delta?.content || '';
    if (text) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
  }
}

export async function streamNotes({ query, res }) {
  setSseHeaders(res);

  try {
    await streamWithOpenAI(res, query);
    res.write('data: [DONE]\n\n');
    res.end();
    return;
  } catch {
    // Fall through to demo stream when OpenAI is unavailable.
  }

  await streamDemoContent(res, notesDemo.note.content);
  res.write('data: [DONE]\n\n');
  res.end();
}

export async function saveNote({ title, content, comments = [], userId = 'guest' }) {
  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    const note = await Note.create({
      userId,
      title,
      content,
      comments,
      source: (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY) ? 'openai' : 'demo'
    });

    return {
      id: note._id.toString(),
      savedAt: note.savedAt
    };
  }

  const note = {
    id: `note-${Date.now()}`,
    userId,
    title,
    content,
    comments,
    savedAt: new Date().toISOString()
  };
  memoryNotes.unshift(note);

  return {
    id: note.id,
    savedAt: note.savedAt
  };
}

export async function addComment({ noteId, highlightedText, commentText, position, userId = 'guest' }) {
  const comment = {
    id: `comment-${Date.now()}`,
    author: userId,
    username: userId,
    highlightedText,
    commentText,
    position,
    timestamp: new Date().toISOString(),
    color: '#fef9c3',
    source: `Source: personal highlight - ${new Date().toISOString().slice(0, 10)}`
  };

  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    await Note.updateOne(
      { _id: noteId, userId },
      {
        $push: {
          comments: comment
        }
      }
    );

    return comment;
  }

  const note = memoryNotes.find((item) => item.id === noteId);
  if (note) {
    note.comments = [...(note.comments || []), comment];
  }

  return comment;
}

export async function listNotes(userId = 'guest') {
  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    const notes = await Note.find({ userId }).sort({ savedAt: -1 }).lean();
    return {
      notes: notes.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        content: item.content || '',
        comments: item.comments || [],
        savedAt: item.savedAt
      })),
      meta: {
        mode: 'live',
        provider: 'mongodb'
      }
    };
  }

  return {
    notes: memoryNotes.length
      ? memoryNotes.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          comments: item.comments || [],
          savedAt: item.savedAt
        }))
      : [
          {
            id: 'demo-note-1',
            title: notesDemo.note.title,
            content: notesDemo.note.content,
            comments: notesDemo.comments,
            savedAt: new Date().toISOString()
          }
        ],
    meta: {
      mode: 'demo',
      provider: 'memory-store'
    }
  };
}
