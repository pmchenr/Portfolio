// src/components/layout/MainLayout.jsx
import Navbar from "../Navbar.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Shared Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 container mx-auto px-4 md:px-0 pt-20 md:pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-sm opacity-70">
        <div className="container mx-auto px-4 md:px-0">
          © {new Date().getFullYear()} Weird & Wander — All adventures welcome.
        </div>
      </footer>
    </div>
  );
}
