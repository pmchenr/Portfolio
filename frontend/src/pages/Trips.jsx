// src/pages/Trips.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import TripCard from "../components/TripCard";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/trips?published=true");
        setTrips(data || []);
      } catch (e) {
        console.error("Failed to load trips", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container px-4 md:px-0">
        <section className="my-10">
          <h1 className="font-serif text-4xl md:text-5xl">Trips</h1>
          <p className="text-ash mt-2">All adventures in one place.</p>
        </section>
        <p className="text-ash">Loading trips…</p>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-0 pt-20 md:pt-24">
      <section className="my-10">
        <h1 className="font-serif text-4xl md:text-5xl">Trips</h1>
        <p className="text-ash mt-2">All adventures in one place.</p>
      </section>

      {trips.length === 0 ? (
        <p className="text-ash">No trips yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {trips.map((t) => {
            const slug = t.slug || t._id; // fallback just in case
            return (
              <Link key={t._id} to={`/trips/${slug}`}>
                <TripCard
                  title={t.title}
                  location={t.location}
                  dates={t.dates}
                  image={t.coverImage}
                  summary={t.summary}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
