import { NavLink, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { pathname } = useLocation();
    const isHome = pathname === '/';

    const linkClass = ({ isActive }) =>
        `px-1 hover:text-ink underline-offset-4 ${
            isActive ? 'underline text-ink' : ''
        }`;

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 ${
                isHome
                    ? 'bg-transparent border-none'
                    : 'bg-white/80 backdrop-blur border-b border-line'
            }`}
        >
            <div className="container flex items-center justify-between py-3">
                <Link
                    to="/"
                    className="font-serif text-2xl tracking-tight text-white"
                >
                    Travel Notes
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                    {isHome ? (
                        <Link to="/admin/login" className="text-white">
                            Login
                        </Link>
                    ) : (
                        <>
                            <NavLink to="/past-trips" className={linkClass}>
                                Past Trips
                            </NavLink>
                            <NavLink to="/future-trips" className={linkClass}>
                                Future Trips
                            </NavLink>
                            <NavLink to="/gallery" className={linkClass}>
                                Gallery
                            </NavLink>
                            <NavLink to="/about" className={linkClass}>
                                About
                            </NavLink>
                            <NavLink to="/admin/login" className={linkClass}>
                                Login
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
