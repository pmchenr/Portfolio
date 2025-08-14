// src/pages/Trips.jsx
import TripCard from '../components/TripCard';

const trips = [
  {
    id: 't1',
    title: 'Patagonia Trek',
    location: 'El Chaltén, Argentina',
    dates: 'Nov 2025',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop',
    summary: 'Fitz Roy viewpoints, day hikes, and glacier-side mate.'
  },
  {
    id: 't2',
    title: 'Iceland Ring Road',
    location: 'Iceland',
    dates: 'May 2024',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
    summary: 'Waterfalls, black‑sand beaches, and hot springs galore.'
  },
  {
    id: 't3',
    title: 'Lisbon & Sintra',
    location: 'Portugal',
    dates: 'Sep 2023',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    summary: 'Tiled streets, pastéis de nata, and seaside cliffs.'
  },
  {
    id: 't4',
    title: 'Dolomites Huts',
    location: 'South Tyrol, Italy',
    dates: 'Jul 2023',
    image: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=1600&auto=format&fit=crop',
    summary: 'Rifugios, via ferrata vibes, and alpenglow evenings.'
  },
  {
    id: 't5',
    title: 'Kyoto Autumn',
    location: 'Japan',
    dates: 'Nov 2022',
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=1600&auto=format&fit=crop',
    summary: 'Temples, tea houses, and blazing momiji leaves.'
  },
  {
    id: 't6',
    title: 'Utah Desert Loop',
    location: 'USA',
    dates: 'Mar 2022',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop',
    summary: 'Canyons, arches, and star‑drenched campsites.'
  }
];

export default function Trips() {
  return (
    <div className="container px-4 md:px-0">
      <section className="my-10">
        <h1 className="font-serif text-4xl md:text-5xl">Trips</h1>
        <p className="text-ash mt-2">All adventures in one place.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {trips.map(t => (
          <TripCard
            key={t.id}
            title={t.title}
            location={t.location}
            dates={t.dates}
            image={t.image}
            summary={t.summary}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
