// backend/models/Trip.js
const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    location: { type: String, required: true },
    dates: { type: String },             // e.g. "Nov 2025"
    startDate: { type: Date },
    endDate: { type: Date },
    coverImage: { type: String },        // image URL
    galleryImages: [{ type: String }],   // array of image URLs for gallery
    summary: { type: String, maxlength: 500 },
    content: { type: String },           // long description/itinerary (optional)
    published: { type: Boolean, default: true },
    // Members-only content (visible to admins)
    itinerary: { type: String },         // detailed day-by-day itinerary
    bookingInfo: { type: String },       // booking details, pricing, etc.
    adminNotes: { type: String }         // private notes for Q&A or other info
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', TripSchema);
