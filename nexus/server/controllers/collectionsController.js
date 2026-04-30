import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Collection from '../models/Collection.js';
import { collectionsDemo } from '../services/demoCatalog.js';
import {
  addMemoryCollection,
  deleteMemoryCollection,
  listMemoryCollections
} from '../services/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-local-secret';

function resolveUserId(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return 'guest';
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.sub || 'guest';
  } catch {
    return 'guest';
  }
}

export async function listCollections(req, res) {
  const userId = req.params.userId || resolveUserId(req);

  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    const items = await Collection.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json({
      collections: items.map((item) => ({
        ...item,
        id: item._id.toString(),
        savedAt: item.createdAt
      })),
      meta: { mode: 'live', provider: 'mongodb' }
    });
  }

  const items = listMemoryCollections().length ? listMemoryCollections() : collectionsDemo;

  return res.json({
    collections: items,
    meta: { mode: 'demo', provider: 'memory-store' }
  });
}

export async function saveCollection(req, res) {
  const userId = resolveUserId(req);
  const { type, title, summary = '', tags = [], payload = {} } = req.body;

  if (!type || !title) {
    return res.status(400).json({ error: 'Type and title are required.' });
  }

  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    const item = await Collection.create({
      userId,
      type,
      title,
      summary,
      tags,
      payload
    });

    return res.status(201).json({
      collection: {
        id: item._id.toString(),
        type: item.type,
        title: item.title,
        summary: item.summary,
        tags: item.tags,
        payload: item.payload,
        savedAt: item.createdAt
      },
      meta: { mode: 'live', provider: 'mongodb' }
    });
  }

  const item = addMemoryCollection({
    id: `saved-${Date.now()}`,
    type,
    title,
    summary,
    tags,
    payload,
    savedAt: new Date().toISOString()
  });

  return res.status(201).json({
    collection: item,
    meta: { mode: 'demo', provider: 'memory-store' }
  });
}

export async function removeCollection(req, res) {
  const userId = resolveUserId(req);
  const { id } = req.params;

  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    await Collection.deleteOne({ _id: id, userId });
    return res.json({ success: true, meta: { mode: 'live', provider: 'mongodb' } });
  }

  const removed = deleteMemoryCollection(id);

  return res.json({
    success: removed,
    meta: { mode: 'demo', provider: 'memory-store' }
  });
}
