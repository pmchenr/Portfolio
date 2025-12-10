// backend/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    question: { type: String, required: true },
    askedBy: { type: String, default: 'Anonymous' },
    answer: { type: String, default: '' },
    answeredBy: { type: String },
    answeredAt: { type: Date },
    isPublic: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', QuestionSchema);
