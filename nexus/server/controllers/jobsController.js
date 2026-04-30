import { getJobDetail, saveJobCollection, searchJobs } from '../services/scraperService.js';

export async function searchJobsController(req, res) {
  const result = await searchJobs(req.body || {});
  return res.json(result);
}

export async function getJobDetailController(req, res) {
  const job = await getJobDetail(req.params.id);
  return res.json({ job });
}

export async function saveJobController(req, res) {
  const { job, userId = 'guest' } = req.body;

  if (!job) {
    return res.status(400).json({ error: 'job is required' });
  }

  const result = await saveJobCollection({ job, userId });
  return res.status(201).json(result);
}
