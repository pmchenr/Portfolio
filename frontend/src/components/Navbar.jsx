import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isHome = pathname === '/';
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if logged in
        const token = localStorage.getItem('token');
        setIsAdmin(!!token);
    }, [pathname]); // Re-check on route change

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAdmin(false);
        navigate('/');
    };

    const linkClass = ({ isActive }) =>
        `px-1 hover:text-ink underline-offset-4 ${
            isActive ? 'underline text-ink' : ''
        }`;

    const homeLinkClass = "text-white hover:text-white/80";

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
                    className={`font-serif text-2xl tracking-tight ${
                        isHome ? 'text-white' : 'text-ink'
                    }`}
                >
                    Travel Notes
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                    {isHome ? (
                        <>
                            {isAdmin ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-white flex items-center gap-1">
                                        <User className="h-4 w-4" /> Admin
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white hover:text-white/80 flex items-center gap-1"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/admin/login" className={homeLinkClass}>
                                    Login
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <NavLink to="/trips" className={linkClass}>
                                Trips
                            </NavLink>
                            <NavLink to="/gallery" className={linkClass}>
                                Gallery
                            </NavLink>
                            <NavLink to="/about" className={linkClass}>
                                About
                            </NavLink>
                            {isAdmin ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-ink flex items-center gap-1">
                                        <User className="h-4 w-4" /> Admin
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-ink hover:text-ink/80 flex items-center gap-1"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <NavLink to="/admin/login" className={linkClass}>
                                    Login
                                </NavLink>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
