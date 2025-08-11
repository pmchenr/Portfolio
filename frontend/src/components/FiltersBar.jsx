// src/components/FiltersBar.jsx
export default function FiltersBar({ filters = [], active, onChange }) {
    return (
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={[
              "px-3 py-1.5 rounded-full border text-sm",
              active === f.value
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink border-line hover:border-ink/40"
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>
    );
  }
  