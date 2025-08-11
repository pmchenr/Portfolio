// frontend/src/admin/AdminDashboard.jsx
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4">
        Welcome back, <strong>{user.username || 'Admin'}</strong>!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/posts')}
          className="border p-4 rounded hover:bg-gray-100"
        >
          📄 Manage Posts
        </button>
        <button
          onClick={() => navigate('/admin/destinations')}
          className="border p-4 rounded hover:bg-gray-100"
        >
          🌍 Manage Destinations
        </button>
        <button
          onClick={() => navigate('/admin/gallery')}
          className="border p-4 rounded hover:bg-gray-100"
        >
          🖼 Manage Gallery
        </button>
        <button
          onClick={() => navigate('/admin/settings')}
          className="border p-4 rounded hover:bg-gray-100"
        >
          ⚙️ Settings
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}
