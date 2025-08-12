import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-1 hover:text-ink underline-offset-4 ${
      isActive ? "underline text-ink" : ""
    }`;

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur border-b border-line">
      <div className="container flex items-center justify-between py-3">
        <NavLink to="/" className="font-serif text-2xl tracking-tight">
          Travel Notes
        </NavLink>
        <nav className="flex items-center gap-6 text-sm text-white">
          <NavLink to="/past-trips" className={linkClass}>Past Trips</NavLink>
          <NavLink to="/future-trips" className={linkClass}>Future Trips</NavLink>
          <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/admin/login" className={linkClass}>Login</NavLink>
        </nav>
      </div>
    </header>
  );
}
