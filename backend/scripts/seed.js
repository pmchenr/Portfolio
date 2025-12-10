// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Destination = require('../models/Destination');
const Post = require('../models/Post');
const Trip = require('../models/Trip');

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
  // Clear existing destinations and start fresh
  await Destination.deleteMany({});
  const items = [
    {
      name: 'Lisbon',
      description: 'Portugal\'s sun-drenched capital perched on seven hills overlooking the Tagus River. Wander through cobblestone streets in Alfama, ride vintage trams, and savor pastéis de nata in centuries-old bakeries.',
      coverImage: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800'
    },
    {
      name: 'Tokyo',
      description: 'A mesmerizing blend of ultra-modern and traditional. Neon-lit skyscrapers tower over ancient temples, while tranquil gardens offer respite from the bustling streets. Experience world-class cuisine from Michelin-starred restaurants to humble ramen shops.',
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
    },
    {
      name: 'Bali',
      description: 'Indonesia\'s island paradise where emerald rice terraces cascade down volcanic hillsides. Discover sacred temples, pristine beaches, and a spiritual culture that welcomes travelers with open arms.',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
    },
    {
      name: 'Marrakech',
      description: 'Step into a world of vibrant souks, ornate palaces, and aromatic spice markets. The Red City enchants with its maze-like medina, stunning riads, and the lively Jemaa el-Fnaa square.',
      coverImage: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800'
    },
    {
      name: 'Iceland',
      description: 'Land of fire and ice where glaciers meet volcanoes. Chase the Northern Lights, soak in geothermal hot springs, and witness dramatic waterfalls and black sand beaches.',
      coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800'
    },
    {
      name: 'Patagonia',
      description: 'The end of the world awaits in this remote wilderness of jagged peaks, massive glaciers, and pristine lakes. Trek through Torres del Paine and witness nature at its most dramatic.',
      coverImage: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800'
    }
  ];
  return Destination.insertMany(items);
}

async function seedPosts(dests) {
  // Clear existing posts and start fresh
  await Post.deleteMany({});
  const byName = new Map(dests.map((d) => [d.name, d]));
  const items = [
    {
      title: 'Getting Lost in Lisbon\'s Alfama District',
      content: 'There\'s something magical about wandering through Alfama\'s narrow alleyways without a map. Around every corner, you\'ll find tiled facades, laundry hanging from windows, and the distant sound of fado music. I spent three days here and barely scratched the surface. Pro tip: wear comfortable shoes - those cobblestones are beautiful but unforgiving!',
      destination: byName.get('Lisbon')?._id,
      date: new Date('2024-09-15'),
      images: ['https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800']
    },
    {
      title: 'Tokyo\'s Hidden Ramen Gems',
      content: 'Forget the tourist spots - the best ramen in Tokyo is found in tiny shops with just 8 seats. After weeks of research and many bowls later, I\'ve compiled my ultimate ramen guide. From rich tonkotsu in Shinjuku to light shio in Meguro, each neighborhood has its own specialty. The key is to follow the salarymen at lunch - they always know where the good stuff is.',
      destination: byName.get('Tokyo')?._id,
      date: new Date('2024-08-20'),
      images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800']
    },
    {
      title: 'Sunrise at Tegallalang Rice Terraces',
      content: 'Waking up at 4 AM was worth every lost minute of sleep. Watching the sun rise over Bali\'s famous rice terraces, with mist slowly lifting from the paddies, was one of those pinch-me travel moments. I\'d recommend hiring a local guide who can share the ancient Subak irrigation system that\'s been UNESCO-recognized.',
      destination: byName.get('Bali')?._id,
      date: new Date('2024-07-10'),
      images: ['https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=800']
    },
    {
      title: 'Navigating the Marrakech Medina',
      content: 'The medina can feel overwhelming at first - a sensory explosion of colors, sounds, and smells. But embrace the chaos! Get lost on purpose, haggle for leather goods, sip mint tea with shopkeepers, and let the city reveal itself. Just remember: if someone offers to "help" you find your way, agree on a price first.',
      destination: byName.get('Marrakech')?._id,
      date: new Date('2024-06-05'),
      images: ['https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800']
    },
    {
      title: 'Chasing Northern Lights in Iceland',
      content: 'After three nights of cloudy skies, we finally saw them - ribbons of green and purple dancing across the Arctic sky. The key to aurora hunting is patience and flexibility. Download aurora forecast apps, be ready to drive at a moment\'s notice, and find spots away from Reykjavik\'s light pollution. The Snæfellsnes Peninsula was our lucky spot.',
      destination: byName.get('Iceland')?._id,
      date: new Date('2024-11-20'),
      images: ['https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800']
    },
    {
      title: 'Trekking the W Circuit in Torres del Paine',
      content: 'Five days, 80 kilometers, and countless jaw-dropping views. The W Trek in Patagonia pushed me physically but rewarded me with some of the most spectacular scenery I\'ve ever witnessed. From the iconic Torres at sunrise to the massive Grey Glacier, every step was worth the aching legs. Book refugios early - they fill up months in advance!',
      destination: byName.get('Patagonia')?._id,
      date: new Date('2024-03-15'),
      images: ['https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800']
    }
  ];
  await Post.insertMany(items);
}

async function seedTrips() {
  // Clear existing trips and start fresh
  await Trip.deleteMany({});
  const items = [
    {
      title: 'Portugal Coastal Adventure',
      slug: 'portugal-coastal-adventure',
      location: 'Lisbon to Porto, Portugal',
      dates: 'March 2025',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-25'),
      coverImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800',
      summary: 'A 10-day journey along Portugal\'s stunning Atlantic coast. From Lisbon\'s historic charm to Porto\'s riverside beauty, we\'ll explore hidden beaches, taste world-class wines, and soak in the laid-back Portuguese lifestyle.',
      content: 'Day 1-3: Lisbon exploration including Alfama, Belém, and Sintra day trip\nDay 4-5: Surf and chill in Ericeira\nDay 6-7: Nazaré and Óbidos medieval town\nDay 8-10: Porto\'s wine cellars, Ribeira district, and Douro Valley',
      published: true
    },
    {
      title: 'Japan in Cherry Blossom Season',
      slug: 'japan-cherry-blossom',
      location: 'Tokyo, Kyoto & Osaka, Japan',
      dates: 'April 2025',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-14'),
      coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
      summary: 'Experience Japan at its most magical during sakura season. Two weeks exploring ancient temples framed by pink blossoms, bustling city streets, and the perfect blend of tradition and innovation.',
      content: 'Day 1-5: Tokyo - Shibuya, Shinjuku, Asakusa, day trips to Nikko\nDay 6-10: Kyoto - Fushimi Inari, Arashiyama, Gion district, Nara deer park\nDay 11-14: Osaka food tour, Hiroshima day trip, Dotonbori nightlife',
      published: true
    },
    {
      title: 'Bali Wellness Retreat',
      slug: 'bali-wellness-retreat',
      location: 'Ubud & Uluwatu, Bali',
      dates: 'May 2025',
      startDate: new Date('2025-05-10'),
      endDate: new Date('2025-05-20'),
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      summary: 'Reset your mind and body in Bali\'s spiritual heartland. Daily yoga, meditation sessions, traditional healing ceremonies, and plenty of time to explore rice terraces and sacred temples.',
      content: 'Day 1-5: Ubud - morning yoga, rice terrace walks, cooking classes, temple visits\nDay 6-8: Sidemen - off-the-beaten-path villages, Mount Agung views\nDay 9-10: Uluwatu - cliff temples, sunset sessions, beach time',
      published: true
    },
    {
      title: 'Morocco Desert & Cities',
      slug: 'morocco-desert-cities',
      location: 'Marrakech to Sahara, Morocco',
      dates: 'October 2025',
      startDate: new Date('2025-10-05'),
      endDate: new Date('2025-10-15'),
      coverImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
      summary: 'From the bustling medinas to the silent Sahara, this trip captures Morocco\'s incredible contrasts. Sleep under the stars in a desert camp, wander through blue-washed Chefchaouen, and get lost in centuries of history.',
      content: 'Day 1-3: Marrakech - medina exploration, Jardin Majorelle, hammam experience\nDay 4-6: Atlas Mountains crossing, Ait Benhaddou, Dades Gorge\nDay 7-8: Sahara Desert - camel trek, overnight in luxury desert camp\nDay 9-10: Fes - world\'s largest car-free urban area',
      published: true
    },
    {
      title: 'Iceland Ring Road',
      slug: 'iceland-ring-road',
      location: 'Full Circle, Iceland',
      dates: 'September 2025',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-12'),
      coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800',
      summary: 'The ultimate Icelandic road trip around the entire island. Waterfalls, glaciers, volcanic landscapes, hot springs, and maybe even the Northern Lights - this is nature at its most dramatic.',
      content: 'Day 1-2: Reykjavik & Golden Circle\nDay 3-4: South Coast - Seljalandsfoss, Skógafoss, black sand beaches\nDay 5-6: Glacier lagoon, diamond beach, Vatnajökull\nDay 7-8: East Fjords scenic drive\nDay 9-10: North Iceland - Mývatn, Goðafoss, whale watching\nDay 11-12: Snæfellsnes Peninsula & return',
      published: true
    },
    {
      title: 'Patagonia Expedition',
      slug: 'patagonia-expedition',
      location: 'Chile & Argentina',
      dates: 'February 2026',
      startDate: new Date('2026-02-10'),
      endDate: new Date('2026-02-24'),
      coverImage: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800',
      summary: 'Two weeks in the world\'s most dramatic wilderness. Trek past towering granite spires, witness calving glaciers, and experience the raw beauty of the end of the earth.',
      content: 'Day 1-2: Arrive Puerto Natales, gear prep\nDay 3-7: W Trek in Torres del Paine\nDay 8-9: Recovery day, Milodon Cave, Puerto Natales\nDay 10-12: El Chaltén, Argentina - Fitz Roy base camp hikes\nDay 13-14: Perito Moreno Glacier, El Calafate',
      published: true
    }
  ];
  await Trip.insertMany(items);
}

(async () => {
  try {
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing from environment');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    await ensureAdmin();
    console.log('Admin user ready');

    const dests = await seedDestinations();
    console.log('Destinations seeded');

    await seedPosts(dests);
    console.log('Posts seeded');

    await seedTrips();
    console.log('Trips seeded');

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect().catch(() => {});
    process.exit(0);
  }
})();
