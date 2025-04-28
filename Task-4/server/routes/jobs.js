// server/routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { q, location, type } = req.query;
    let query = { isActive: true };
    
    if (q) query.title = { $regex: q, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    
    const jobs = await Job.find(query).sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'profile.name profile.company');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a new job (employer only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Only employers can post jobs' });
  }
  
  const job = new Job({
    ...req.body,
    postedBy: req.user.id
  });
  
  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;