// backend/models/Trip.js
const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    dates: { type: String },             // e.g. "Nov 2025"
    startDate: { type: Date },
    endDate: { type: Date },
    coverImage: { type: String },        // image URL
    summary: { type: String, maxlength: 500 },
    content: { type: String },           // long description/itinerary (optional)
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', TripSchema);
