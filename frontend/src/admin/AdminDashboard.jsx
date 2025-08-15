// src/admin/AdminDashboard.jsx
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
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="mb-6">Welcome back, <strong>{user.username || 'Admin'}</strong>!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/trips')}
          className="border p-5 rounded-xl hover:bg-gray-50 text-left"
        >
          🧭 <span className="font-semibold">Manage Trips</span>
          <p className="text-sm text-gray-600 mt-1">Add, edit, or delete trips</p>
        </button>

        <button
          onClick={() => navigate('/admin/gallery')}
          className="border p-5 rounded-xl hover:bg-gray-50 text-left"
        >
          🖼 <span className="font-semibold">Manage Gallery</span>
          <p className="text-sm text-gray-600 mt-1">Upload and organize images</p>
        </button>

        <button
          onClick={() => navigate('/admin/settings')}
          className="border p-5 rounded-xl hover:bg-gray-50 text-left"
        >
          ⚙️ <span className="font-semibold">Settings</span>
          <p className="text-sm text-gray-600 mt-1">Site & account preferences</p>
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
