// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Destination = require('../models/Destination');
const Post = require('../models/Post');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const ADMIN_ROLE = 'admin';

function slugify(s) {
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureAdmin() {
  const existing = await User.findOne({ username: ADMIN_USERNAME });
  if (existing) return existing._id;

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const doc = await User.create({
    username: ADMIN_USERNAME,
    role: ADMIN_ROLE,
    passwordHash: hash,
  });
  return doc._id;
}

async function seedDestinations() {
  const count = await Destination.countDocuments();
  if (count > 0) return Destination.find();
  const items = [
    { name: 'Lisbon', description: 'Lovely city', coverImage: '' },
  ].map((d) => ({ ...d, slug: slugify(d.name) }));
  return Destination.insertMany(items);
}

async function seedPosts(dests) {
  const count = await Post.countDocuments();
  if (count > 0) return;
  const byName = new Map(dests.map((d) => [d.name, d]));
  const items = [
    {
      title: 'My Trip to Lisbon',
      excerpt: 'It was great!',
      content: 'It was great!',
      coverImage: '',
      destination: byName.get('Lisbon')?._id,
      published: true,
      slug: slugify('My Trip to Lisbon'),
    },
  ];
  await Post.insertMany(items);
}

(async () => {
  try {
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing from environment');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    await ensureAdmin();
    const dests = await seedDestinations();
    await seedPosts(dests);

    console.log('🎉 Seeding complete');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await mongoose.disconnect().catch(() => {});
    process.exit(0);
  }
})();
