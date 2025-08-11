const mongoose = require('mongoose');
const destSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  coverImage: String
});
module.exports = mongoose.model('Destination', destSchema);