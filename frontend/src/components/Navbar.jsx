export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-line">
      <div className="container flex items-center justify-between py-3">
        <a href="/" className="font-serif text-2xl tracking-tight">Travel Notes</a>
        <nav className="flex items-center gap-6 text-sm text-ash">
          <a className="hover:text-ink" href="/destinations">Destinations</a>
          <a className="hover:text-ink" href="/gallery">Gallery</a>
          <a className="hover:text-ink" href="/about">About</a>
          <a className="hover:text-ink" href="/contact">Contact</a>
          <a className="hover:text-ink" href="/admin/login">Admin</a>
        </nav>
      </div>
    </header>
  );
}
