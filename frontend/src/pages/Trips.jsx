// src/pages/Trips.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "../api";
import TripCard from "../components/TripCard";

function slugify(s) {
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: '', location: '', dates: '' });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const isAdmin = !!localStorage.getItem("token");

  const fetchTrips = async () => {
    try {
      // Admins see all trips, regular users see only published
      const endpoint = isAdmin ? "/trips" : "/trips?published=true";
      const { data } = await API.get(endpoint);
      setTrips(data || []);
    } catch (e) {
      console.error("Failed to load trips", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async () => {
    if (!newTrip.title || !newTrip.location) {
      alert("Title and location are required");
      return;
    }

    setCreating(true);
    try {
      const slug = slugify(newTrip.title);
      const { data } = await API.post("/trips", {
        ...newTrip,
        slug,
        published: false // Start as draft
      });
      setShowNewForm(false);
      setNewTrip({ title: '', location: '', dates: '' });
      // Navigate to the new trip to continue editing
      navigate(`/trips/${data.slug || data._id}`);
    } catch (err) {
      alert("Failed to create trip");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTrip = async (e, tripId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      await API.delete(`/trips/${tripId}`);
      setTrips(trips.filter(t => t._id !== tripId));
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  if (loading) {
    return (
      <div className="container px-4 md:px-0">
        <section className="my-10">
          <h1 className="font-serif text-4xl md:text-5xl">Trips</h1>
          <p className="text-ash mt-2">All adventures in one place.</p>
        </section>
        <p className="text-ash">Loading trips...</p>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-0">
      <section className="my-10 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">Trips</h1>
          <p className="text-ash mt-2">All adventures in one place.</p>
        </div>

        {isAdmin && !showNewForm && (
          <Button onClick={() => setShowNewForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Trip
          </Button>
        )}
      </section>

      {/* New Trip Form */}
      {showNewForm && (
        <div className="mb-8 p-6 border rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Create New Trip</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={newTrip.title}
                onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Portugal Coastal Adventure"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                value={newTrip.location}
                onChange={(e) => setNewTrip({ ...newTrip, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Lisbon, Portugal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dates</label>
              <input
                type="text"
                value={newTrip.dates}
                onChange={(e) => setNewTrip({ ...newTrip, dates: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="March 2025"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => setShowNewForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTrip} disabled={creating}>
              {creating ? "Creating..." : "Create & Edit"}
            </Button>
          </div>
        </div>
      )}

      {trips.length === 0 ? (
        <p className="text-ash">No trips yet. {isAdmin && "Click 'New Trip' to create one!"}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {trips.map((t) => {
            const slug = t.slug || t._id;
            return (
              <div key={t._id} className="relative group">
                <Link to={`/trips/${slug}`}>
                  <TripCard
                    title={t.title}
                    location={t.location}
                    dates={t.dates}
                    image={t.coverImage}
                    summary={t.summary}
                  />
                  {/* Draft indicator */}
                  {isAdmin && !t.published && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                      Draft
                    </span>
                  )}
                </Link>

                {/* Delete button for admin */}
                {isAdmin && (
                  <button
                    onClick={(e) => handleDeleteTrip(e, t._id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete trip"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
