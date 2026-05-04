import {
  generateRoadmapData,
  listRoadmapCollections,
  saveRoadmapCollection
} from '../services/roadmapService.js';

export async function generateRoadmap(req, res) {
  const { query = 'Full Stack Developer path', userId = 'guest', profile = {} } = req.body;
  const result = await generateRoadmapData({ query, userId, profile });

  res.json({
    roadmap: result.roadmap,
    sources: result.sources,
    meta: result.meta
  });
}

export async function saveRoadmap(req, res) {
  const { roadmap, userId = 'guest' } = req.body;

  if (!roadmap) {
    return res.status(400).json({ error: 'roadmap is required' });
  }

  const result = await saveRoadmapCollection({ roadmap, userId });

  return res.status(201).json(result);
}

export async function getRoadmapCollections(req, res) {
  const { userId = 'guest' } = req.params;
  const result = await listRoadmapCollections(userId);

  return res.json(result);
}
