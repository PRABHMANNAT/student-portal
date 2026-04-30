import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/User.js';
import { demoUser } from '../services/demoCatalog.js';
import { listMemoryUsers, upsertMemoryUser } from '../services/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-local-secret';

function databaseReady() {
  return mongoose.connection.readyState === 1;
}

function sanitizeUser(user) {
  return {
    id: user._id?.toString() || user.id,
    name: user.name,
    email: user.email
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id?.toString() || user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (databaseReady()) {
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json({ token: signToken(user), user: sanitizeUser(user), meta: { mode: 'live' } });
  }

  const exists = listMemoryUsers().find((entry) => entry.email === email);

  if (exists) {
    return res.status(409).json({ error: 'User already exists.' });
  }

  const user = upsertMemoryUser({
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash
  });

  return res.status(201).json({
    token: signToken(user),
    user: sanitizeUser(user),
    meta: { mode: 'demo' }
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (databaseReady()) {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    return res.json({ token: signToken(user), user: sanitizeUser(user), meta: { mode: 'live' } });
  }

  const memoryUser = listMemoryUsers().find((entry) => entry.email === email);

  if (!memoryUser) {
    return res.status(200).json({
      token: signToken(demoUser),
      user: demoUser,
      meta: { mode: 'demo', reason: 'demo-fallback' }
    });
  }

  const valid = await bcrypt.compare(password, memoryUser.passwordHash);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  return res.json({
    token: signToken(memoryUser),
    user: sanitizeUser(memoryUser),
    meta: { mode: 'demo' }
  });
}

export async function me(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ user: demoUser, meta: { mode: 'demo', guest: true } });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);

    if (databaseReady()) {
      const user = await User.findById(payload.sub);
      return res.json({ user: user ? sanitizeUser(user) : demoUser, meta: { mode: user ? 'live' : 'demo' } });
    }

    const user = listMemoryUsers().find((entry) => (entry._id?.toString() || entry.id) === payload.sub);

    return res.json({
      user: user ? sanitizeUser(user) : demoUser,
      meta: { mode: user ? 'demo' : 'demo', guest: !user }
    });
  } catch {
    return res.json({ user: demoUser, meta: { mode: 'demo', guest: true } });
  }
}

