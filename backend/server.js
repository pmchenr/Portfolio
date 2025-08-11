require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const destRoutes = require('./routes/destinations');
const uploadsRoutes = require('./routes/uploads');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const MONGODB_URI = process.env.MONGODB_URI;   // <— changed
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/destinations', destRoutes);
app.use('/api/uploads', uploadsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
