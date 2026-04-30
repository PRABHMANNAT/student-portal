import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const roadmapDemo = JSON.parse(
  readFileSync(path.resolve(__dirname, '../demo/roadmapDemo.json'), 'utf8')
);

export const jobsDemo = JSON.parse(
  readFileSync(path.resolve(__dirname, '../demo/jobsDemo.json'), 'utf8')
);

export const notesDemo = JSON.parse(
  readFileSync(path.resolve(__dirname, '../demo/notesDemo.json'), 'utf8')
);

export const collectionsDemo = [
  {
    id: 'saved-1',
    type: 'roadmap',
    title: 'Full Stack Developer',
    summary: '5 phases, 22 nodes, and a complete full stack roadmap.',
    tags: ['roadmap', 'full-stack'],
    savedAt: '2026-04-28T09:00:00.000Z',
    payload: roadmapDemo
  },
  {
    id: 'saved-2',
    type: 'jobs',
    title: 'Northstar Labs frontend shortlist',
    summary: 'Columbus saved a ranked remote frontend search.',
    tags: ['jobs', 'internship'],
    savedAt: '2026-04-29T14:00:00.000Z',
    payload: jobsDemo
  },
  {
    id: 'saved-3',
    type: 'notes',
    title: 'React Hooks Notes',
    summary: 'Athena markdown draft with inline comments and highlights.',
    tags: ['notes', 'systems'],
    savedAt: '2026-04-30T08:30:00.000Z',
    payload: notesDemo
  }
];

export const demoUser = {
  id: 'demo-user',
  name: 'Demo Student',
  email: 'demo@nexus.local',
  mode: 'demo'
};
