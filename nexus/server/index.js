import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import roadmapRouter from './routes/roadmap.js';
import jobsRouter from './routes/jobs.js';
import notesRouter from './routes/notes.js';
import collectionsRouter from './routes/collections.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = createServer(app);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

app.use('/api/roadmap', roadmapRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    demo: !process.env.ANTHROPIC_API_KEY
  })
);

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus')
  .then(() => console.log('MongoDB connected'))
  .catch(() => console.log('MongoDB unavailable - demo mode active'));

server.listen(3001, () => console.log('NEXUS server on :3001'));
