// src/pages/Stories.jsx
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import FiltersBar from '../components/FiltersBar';
import StoryCard from '../components/StoryCard';

export default function Stories() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/posts`);
        const published = (res.data || []).filter(p => p.published);
        // newest first
        setPosts(published.reverse());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [API]);

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Guides', value: 'guide' },
    { label: 'Itineraries', value: 'itinerary' },
    { label: 'Stories', value: 'story' },
  ];

  // naive category inference from title/excerpt keywords (until you add real categories)
  const normalized = useMemo(() => posts.map(p => {
    const text = `${p.title} ${p.excerpt}`.toLowerCase();
    let cat = 'story';
    if (text.includes('itinerary') || text.includes('day')) cat = 'itinerary';
    if (text.includes('guide') || text.includes('how to')) cat = 'guide';
    return { ...p, _cat: cat };
  }), [posts]);

  const filtered = useMemo(() => {
    let list = normalized;
    if (filter !== 'all') list = list.filter(p => p._cat === filter);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(needle) ||
        (p.excerpt || '').toLowerCase().includes(needle)
      );
    }
    return list;
  }, [normalized, filter, q]);

  // Patagonia style: airy hero band
  return (
    <div className="container px-4 md:px-0">
      <section className="rounded-brand border border-line bg-sand p-6 md:p-10 my-8">
        <h1 className="font-serif text-4xl md:text-5xl leading-tight">All Stories</h1>
        <p className="text-ash mt-2 max-w-2xl">
          Field notes, guides, and itineraries—told with big imagery and practical tips.
        </p>

        <div className="mt-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <FiltersBar filters={filters} active={filter} onChange={setFilter} />
          <div className="relative">
            <input
              className="input w-72"
              placeholder="Search stories…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Mosaic grid: mix tall + standard cards */}
      {filtered.length === 0 ? (
        <p className="text-ash mb-14">No stories match your filters.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 auto-rows-[1fr] mb-14">
          {filtered.map((p, i) => (
            <StoryCard
              key={p._id}
              to={`/posts/${p._id}`}
              image={p.coverImage || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop'}
              title={p.title}
              excerpt={p.excerpt}
              tag={p.destination?.name}
              tall={i % 7 === 0} // every 7th is tall for rhythm
            />
          ))}
        </div>
      )}
    </div>
  );
}
