// TripCard.jsx
export default function TripCard({ title, location, dates, image, summary, onClick }) {
  return (
    <button onClick={onClick} className="group block text-left w-full">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm font-medium text-slate-500 mb-3">
            {location}{dates ? ` • ${dates}` : ""}
          </p>
          {summary && (
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
              {summary}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
