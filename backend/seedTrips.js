// backend/seedTrips.js
require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('./models/Trip');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Trip.deleteMany(); // clear existing

  await Trip.insertMany([
    {
      title: 'Patagonia Trek',
      location: 'El Chaltén, Argentina',
      dates: 'Nov 2025',
      coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop',
      summary: 'Fitz Roy viewpoints, day hikes, and glacier-side mate.',
      published: true
    },
    {
      title: 'Iceland Ring Road',
      location: 'Iceland',
      dates: 'May 2024',
      coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      summary: 'Waterfalls, black-sand beaches, and hot springs galore.',
      published: true
    },
    {
      title: 'Lisbon & Sintra',
      location: 'Portugal',
      dates: 'Sep 2023',
      coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      summary: 'Tiled streets, pastéis de nata, and seaside cliffs.',
      published: true
    }
  ]);

  console.log('✅ Trips seeded');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
