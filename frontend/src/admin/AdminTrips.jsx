// src/admin/AdminTrips.jsx
import { useEffect, useState } from 'react';
import API from '../api';

const empty = { title: '', location: '', dates: '', coverImage: '', summary: '', published: true };

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await API.get('/trips');
    setTrips(data);
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/trips/${editingId}`, form);
      } else {
        await API.post('/trips', form);
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const edit = (t) => {
    setForm({
      title: t.title || '',
      location: t.location || '',
      dates: t.dates || '',
      coverImage: t.coverImage || '',
      summary: t.summary || '',
      published: !!t.published,
    });
    setEditingId(t._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => {
    if (!confirm('Delete this trip?')) return;
    await API.delete(`/trips/${id}`);
    await load();
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">{editingId ? 'Edit Trip' : 'New Trip'}</h1>

      <form onSubmit={save} className="card p-4 space-y-3">
        <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
        <input className="input" placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required />
        <input className="input" placeholder="Dates (e.g., Nov 2025)" value={form.dates} onChange={e=>setForm({...form,dates:e.target.value})} />
        <input className="input" placeholder="Cover Image URL" value={form.coverImage} onChange={e=>setForm({...form,coverImage:e.target.value})} />
        <textarea className="input" rows="4" placeholder="Summary" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} />
          Published
        </label>

        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={loading}>{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" className="btn" onClick={()=>{ setEditingId(null); setForm(empty); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-semibold mt-8 mb-3">All Trips</h2>
      <div className="space-y-3">
        {trips.map(t => (
          <div key={t._id} className="card p-4 flex items-start justify-between">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-ash">{t.location}{t.dates ? ` • ${t.dates}` : ''}</div>
              <div className="text-sm mt-1 line-clamp-2">{t.summary}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={()=>edit(t)}>Edit</button>
              <button className="btn" onClick={()=>del(t._id)}>Delete</button>
            </div>
          </div>
        ))}
        {trips.length === 0 && <p className="text-ash">No trips yet.</p>}
      </div>
    </div>
  );
}
