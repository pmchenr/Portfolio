const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  date: { type: Date, default: Date.now },
  images: [String]
});
module.exports = mongoose.model('Post', postSchema);