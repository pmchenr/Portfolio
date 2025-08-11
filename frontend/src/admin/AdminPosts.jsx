// frontend/src/admin/AdminPosts.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPosts() {
  // Trim trailing slashes in case the env has one
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [dests, setDests] = useState([]);   // must start as []
  const [posts, setPosts] = useState([]);

  // form state
  const [title, setTitle] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [itineraryItems, setItineraryItems] = useState([{ day: 1, text: '' }]);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Guard: if no token, back to login
  useEffect(() => {
    if (!token) navigate('/admin/login');
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, dRes] = await Promise.all([
          axios.get(`${API_BASE}/api/posts`),
          axios.get(`${API_BASE}/api/destinations`),
        ]);

        const postsData = Array.isArray(pRes.data)
          ? pRes.data
          : Array.isArray(pRes.data?.data)
          ? pRes.data.data
          : [];

        const destsData = Array.isArray(dRes.data)
          ? dRes.data
          : Array.isArray(dRes.data?.data)
          ? dRes.data.data
          : [];

        setPosts(postsData);
        setDests(destsData);
        // quick sanity logs while we’re debugging
        console.log('Loaded posts:', postsData.length, 'dests:', destsData.length);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts or destinations');
      } finally {
        setLoading(false);
      }
    };
    if (API_BASE) fetchData();
  }, [API_BASE]);

  const addItineraryItem = () => {
    setItineraryItems(prev => [...prev, { day: prev.length + 1, text: '' }]);
  };

  const updateItineraryItem = (idx, value) => {
    setItineraryItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], text: value };
      return copy;
    });
  };

  const removeItineraryItem = (idx) => {
    setItineraryItems(prev =>
      prev.filter((_, i) => i !== idx).map((item, i) => ({ ...item, day: i + 1 }))
    );
  };

  const buildContentMarkdown = () => {
    const dateLine =
      startDate && endDate
        ? `**Dates:** ${startDate} → ${endDate}\n\n`
        : startDate
        ? `**Dates:** ${startDate}\n\n`
        : '';

    const itineraryMd =
      itineraryItems
        .filter(i => i.text.trim().length > 0)
        .map(i => `**Day ${i.day}:** ${i.text.trim()}`)
        .join('\n\n') || '_(Itinerary to be announced)_';

    return `${dateLine}## Itinerary\n\n${itineraryMd}`;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const content = buildContentMarkdown();
      const payload = {
        title,
        excerpt,
        content,
        coverImage,
        destination: destinationId || undefined,
        published,
      };

      await axios.post(`${API_BASE}/api/posts`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // refresh list
      const pRes = await axios.get(`${API_BASE}/api/posts`);
      const postsData = Array.isArray(pRes.data)
        ? pRes.data
        : Array.isArray(pRes.data?.data)
        ? pRes.data.data
        : [];
      setPosts(postsData);

      // reset form
      setTitle('');
      setExcerpt('');
      setCoverImage('');
      setDestinationId('');
      setStartDate('');
      setEndDate('');
      setItineraryItems([{ day: 1, text: '' }]);
      setPublished(false);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Posts (Trip Plans)</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Create New Trip Plan */}
      <form onSubmit={handleCreate} className="border rounded p-4 mb-10">
        <h2 className="text-xl font-semibold mb-4">Create a Trip Plan</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              className="w-full border rounded p-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Portugal Friends Trip 2026"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Destination</label>
            <select
              className="w-full border rounded p-2"
              value={destinationId}
              onChange={e => setDestinationId(e.target.value)}
            >
              <option value="">(Optional) Choose destination</option>
              {(Array.isArray(dests) ? dests : []).map(d => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1">Short Summary (Excerpt)</label>
            <textarea
              className="w-full border rounded p-2"
              rows={2}
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="One-line summary your friends will see."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1">Cover Image URL</label>
            <input
              className="w-full border rounded p-2"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://res.cloudinary.com/.../cover.jpg"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
          <div className="space-y-3">
            {itineraryItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="mt-2 w-14 text-sm text-gray-600">Day {item.day}</span>
                <textarea
                  className="flex-1 border rounded p-2"
                  rows={2}
                  value={item.text}
                  onChange={e => updateItineraryItem(idx, e.target.value)}
                  placeholder="Morning in Alfama, lunch at Time Out Market, sunset at Miradouro da Senhora do Monte..."
                />
                {itineraryItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItineraryItem(idx)}
                    className="border rounded px-2 py-1"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItineraryItem}
            className="mt-3 border rounded px-3 py-2"
          >
            + Add Day
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
            />
            Published (check to show publicly)
          </label>

          <button className="border rounded px-4 py-2" disabled={saving}>
            {saving ? 'Saving…' : 'Create Trip Plan'}
          </button>
        </div>
      </form>

      {/* Existing Posts */}
      <h2 className="text-xl font-semibold mb-3">Existing Posts</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (Array.isArray(posts) ? posts : []).length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="divide-y border rounded">
          {(Array.isArray(posts) ? posts : []).map(p => (
            <li key={p._id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">
                  {p.published ? 'Published' : 'Draft'}
                </div>
              </div>
              {/* Adjust this link if your public route differs */}
              <a
                className="underline text-sm"
                href={`/posts/${p._id}`}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
