import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationPage from './pages/DestinationPage';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Stories from './pages/Stories';
import Trips from './pages/Trips';
import Navbar from './components/Navbar';
import TripPage from "./pages/TripPage";

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminPosts from './admin/AdminPosts';
import AdminTrips from './admin/AdminTrips';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 p-0">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route
                        path="/destinations/:id"
                        element={<DestinationPage />}
                    />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/posts" element={<AdminPosts />} />
                    <Route
                        path="/admin/trips"
                        element={
                            <ProtectedRoute>
                                <AdminTrips />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/stories" element={<Stories />} />
                    <Route path="/trips" element={<Trips />} />
                    <Route path="/trips/:slug" element={<TripPage />} />
                </Routes>
            </main>
        </div>
    );
}
