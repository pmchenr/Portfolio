// TripCard.jsx
export default function TripCard({ title, location, dates, image, summary, onClick }) {
  return (
    <button onClick={onClick} className="group block text-left w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-90">
            {location}{dates ? ` • ${dates}` : ""}
          </p>
        </div>
      </div>
      {summary && (
        <p className="mt-3 text-sm text-slate-600 line-clamp-2">{summary}</p>
      )}
    </button>
  );
}
