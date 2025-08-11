// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    // email: { type: String, unique: true, sparse: true }, // optional
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
