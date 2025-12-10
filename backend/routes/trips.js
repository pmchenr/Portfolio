// backend/routes/trips.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Trip = require('../models/Trip');

const router = express.Router();

function slugify(s) {
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

// --- tiny auth guard (bearer token) for writes ---
function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    jwt.verify(token, process.env.JWT_SECRET);
    next(); 
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// GET /api/trips  (optionally ?published=true)
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.published === 'true') filter.published = true;
  const trips = await Trip.find(filter).sort({ createdAt: -1 });
  res.json(trips);
});

// GET /api/trips/:id (supports both MongoDB _id and slug)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Try to find by slug first, then by _id
    let trip = await Trip.findOne({ slug: id });
    if (!trip && id.match(/^[0-9a-fA-F]{24}$/)) {
      trip = await Trip.findById(id);
    }
    if (!trip) return res.status(404).json({ message: 'Not found' });
    res.json(trip);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/trips  (create)
router.post('/', requireAuth, async (req, res) => {
  const doc = await Trip.create(req.body);
  res.status(201).json(doc);
});

// PUT /api/trips/:id  (update)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    // If title changed, regenerate slug
    if (req.body.title) {
      const existingTrip = await Trip.findById(req.params.id);
      if (existingTrip && existingTrip.title !== req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
    }
    const doc = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const ok = await Trip.findByIdAndDelete(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

module.exports = router;
