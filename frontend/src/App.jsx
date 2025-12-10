import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationPage from "./pages/DestinationPage";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Stories from "./pages/Stories";
import Trips from "./pages/Trips";
import TripPage from "./pages/TripPage";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPosts from "./admin/AdminPosts";
import AdminTrips from "./admin/AdminTrips";

import MainLayout from "./components/layout/MainLayout";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/destinations"
          element={
            <MainLayout>
              <Destinations />
            </MainLayout>
          }
        />
        <Route
          path="/destinations/:id"
          element={
            <MainLayout>
              <DestinationPage />
            </MainLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <MainLayout>
              <Gallery />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/stories"
          element={
            <MainLayout>
              <Stories />
            </MainLayout>
          }
        />
        <Route
          path="/trips"
          element={
            <MainLayout>
              <Trips />
            </MainLayout>
          }
        />
        <Route
          path="/trips/:slug"
          element={
            <MainLayout>
              <TripPage />
            </MainLayout>
          }
        />

        {/* Admin */}
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
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute>
              <AdminPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trips"
          element={
            <ProtectedRoute>
              <AdminTrips />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
