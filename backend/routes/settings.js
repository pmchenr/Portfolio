// backend/routes/settings.js
const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/settings/:key - Get a setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSettings.findOne({ key: req.params.key });
    if (!setting) {
      return res.json({ key: req.params.key, value: null });
    }
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/settings/:key - Update or create a setting (admin only)
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await SiteSettings.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
