// src/components/StoryCard.jsx
import { Link } from 'react-router-dom';

export default function StoryCard({ to, image, title, excerpt, tag, tall=false }) {
  return (
    <article className={`group overflow-hidden rounded-brand border border-line bg-paper shadow-card hover:shadow-lg transition-shadow ${tall ? 'row-span-2' : ''}`}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${tall ? 'h-96' : 'h-60'}`}
          loading="lazy"
        />
        {tag && (
          <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur border border-line">
            {tag}
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl md:text-2xl leading-snug">
          <Link to={to} className="no-underline hover:underline underline-offset-4">{title}</Link>
        </h3>
        {excerpt && <p className="text-ash mt-2 line-clamp-3">{excerpt}</p>}
        <div className="mt-4">
          <Link to={to} className="inline-flex items-center gap-2 text-ink hover:underline underline-offset-4">
            Read more
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
