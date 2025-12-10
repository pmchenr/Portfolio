// backend/routes/questions.js
const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/questions/:tripId - Get all questions for a trip
router.get('/:tripId', async (req, res) => {
  try {
    const questions = await Question.find({ trip: req.params.tripId })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/questions - Submit a new question (requires auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tripId, question, askedBy } = req.body;
    if (!tripId || !question) {
      return res.status(400).json({ message: 'Trip ID and question are required' });
    }
    const doc = await Question.create({
      trip: tripId,
      question,
      askedBy: askedBy || 'Member'
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/questions/:id/answer - Admin answers a question
router.put('/:id/answer', authMiddleware, async (req, res) => {
  try {
    const { answer } = req.body;
    const doc = await Question.findByIdAndUpdate(
      req.params.id,
      {
        answer,
        answeredBy: 'Admin',
        answeredAt: new Date()
      },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Question not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/questions/:id - Admin deletes a question
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Question.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
