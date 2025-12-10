import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Pencil, Save, X, Upload } from 'lucide-react';
import API from '../api';

export default function Hero() {
    const [content, setContent] = useState({
        backgroundImage: 'https://res.cloudinary.com/dhtv5scfv/image/upload/v1755015541/IMG_7989_nz2jgd.jpg',
        headline: ''
    });
    const [editData, setEditData] = useState({});
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const isAdmin = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await API.get('/settings/home');
                if (data.value) {
                    setContent(data.value);
                    setEditData(data.value);
                }
            } catch (err) {
                console.error('Failed to load home content');
            }
        };
        fetchContent();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await API.put('/settings/home', { value: editData });
            setContent(editData);
            setEditing(false);
        } catch (err) {
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(content);
        setEditing(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await API.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditData({ ...editData, backgroundImage: data.url });
        } catch (err) {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <section className="relative h-[100svh] md:h-screen w-full overflow-hidden">
            {/* Background image */}
            <img
                src={editing ? editData.backgroundImage : content.backgroundImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Admin Edit Controls */}
            {isAdmin && (
                <div className="absolute top-20 right-4 z-20 flex gap-2">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition"
                        >
                            <Pencil className="h-4 w-4" /> Edit Home
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition"
                            >
                                <X className="h-4 w-4" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition"
                            >
                                <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Edit Panel */}
            {editing && (
                <div className="absolute top-32 right-4 z-20 bg-white/95 backdrop-blur rounded-xl p-4 w-80 shadow-xl">
                    <h3 className="font-semibold mb-3">Edit Home Page</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Background Image</label>
                            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <Upload className="h-4 w-4" />
                                {uploading ? 'Uploading...' : 'Upload Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Headline (optional)</label>
                            <input
                                type="text"
                                value={editData.headline || ''}
                                onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Welcome to my travels..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="mx-auto max-w-5xl px-4 text-center">
                    {/* Optional Headline */}
                    {content.headline && !editing && (
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 animate-fadeUp">
                            {content.headline}
                        </h1>
                    )}

                    <div className="mt-8 flex justify-center flex-wrap gap-4">
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                                <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-5xl animate-fadeUp">
                                    <Link
                                        to="/trips"
                                        className="flex-1 flex items-center justify-center px-6 py-5 border border-white text-white text-2xl sm:text-3xl font-semibold rounded-lg hover:bg-white/10 transition"
                                    >
                                        Trips
                                    </Link>
                                    <Link
                                        to="/gallery"
                                        className="flex-1 flex items-center justify-center px-6 py-5 border border-white text-white text-2xl sm:text-3xl font-semibold rounded-lg hover:bg-white/10 transition"
                                    >
                                        Gallery
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="flex-1 flex items-center justify-center px-6 py-5 border border-white text-white text-2xl sm:text-3xl font-semibold rounded-lg hover:bg-white/10 transition"
                                    >
                                        About
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
