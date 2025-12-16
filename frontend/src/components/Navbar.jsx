import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, User, Eye } from 'lucide-react';
import { useViewMode } from '../context/ViewModeContext';

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isHome = pathname === '/';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { viewMode, setViewMode, actualIsAdmin } = useViewMode();

    useEffect(() => {
        // Check if logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [pathname]); // Re-check on route change

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setViewMode('admin'); // Reset view mode
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
                    Take More Sick Days
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                    {isHome ? (
                        <>
                            {isLoggedIn ? (
                                <div className="flex items-center gap-4">
                                    {actualIsAdmin && (
                                        <ViewModeSwitcher
                                            viewMode={viewMode}
                                            setViewMode={setViewMode}
                                            isHome={true}
                                        />
                                    )}
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
                                <Link to="/login" className={homeLinkClass}>
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
                            {isLoggedIn ? (
                                <div className="flex items-center gap-4">
                                    {actualIsAdmin && (
                                        <ViewModeSwitcher
                                            viewMode={viewMode}
                                            setViewMode={setViewMode}
                                            isHome={false}
                                        />
                                    )}
                                    <span className="text-ink flex items-center gap-1">
                                        <User className="h-4 w-4" /> {actualIsAdmin ? 'Admin' : 'Account'}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-ink hover:text-ink/80 flex items-center gap-1"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <NavLink to="/login" className={linkClass}>
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

function ViewModeSwitcher({ viewMode, setViewMode, isHome }) {
    const baseClass = isHome
        ? "text-white/80 hover:text-white"
        : "text-ink/80 hover:text-ink";
    const activeClass = isHome
        ? "bg-white/20 text-white"
        : "bg-ink/10 text-ink";

    return (
        <div className="flex items-center gap-1 mr-2">
            <Eye className={`h-4 w-4 ${isHome ? 'text-white/60' : 'text-ink/60'}`} />
            <div className="flex rounded overflow-hidden border border-current/20">
                <button
                    onClick={() => setViewMode("admin")}
                    className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                        viewMode === "admin" ? activeClass : baseClass
                    }`}
                    title="View as Admin"
                >
                    Admin
                </button>
                <button
                    onClick={() => setViewMode("subscriber")}
                    className={`px-2 py-0.5 text-xs font-medium transition-colors border-x border-current/20 ${
                        viewMode === "subscriber" ? activeClass : baseClass
                    }`}
                    title="View as Subscriber"
                >
                    Sub
                </button>
                <button
                    onClick={() => setViewMode("guest")}
                    className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                        viewMode === "guest" ? activeClass : baseClass
                    }`}
                    title="View as Guest"
                >
                    Guest
                </button>
            </div>
        </div>
    );
}
