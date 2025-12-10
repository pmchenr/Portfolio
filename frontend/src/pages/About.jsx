import { useState, useEffect } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import API from '../api';
import ImageUpload from '../components/ImageUpload';

export default function About() {
  const [content, setContent] = useState({
    title: 'About Me',
    bio: '',
    image: ''
  });
  const [editData, setEditData] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdmin = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await API.get('/settings/about');
        if (data.value) {
          setContent(data.value);
          setEditData(data.value);
        }
      } catch (err) {
        console.error('Failed to load about content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/settings/about', { value: editData });
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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">About</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        {editing ? (
          <input
            type="text"
            value={editData.title || ''}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 outline-none"
          />
        ) : (
          <h1 className="text-3xl font-bold">{content.title || 'About Me'}</h1>
        )}

        {isAdmin && !editing && (
          <Button onClick={() => setEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
        {editing && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {editing ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Profile Photo</label>
              <ImageUpload
                images={editData.image ? [editData.image] : []}
                onChange={(images) => setEditData({ ...editData, image: images[0] || '' })}
                multiple={false}
              />
            </div>
          ) : (
            content.image && (
              <img
                src={content.image}
                alt="About"
                className="w-full rounded-xl object-cover"
              />
            )
          )}
        </div>

        <div>
          {editing ? (
            <textarea
              value={editData.bio || ''}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full p-4 border rounded-lg min-h-[300px]"
              placeholder="Write about yourself - your background, hobbies, why you love travel..."
            />
          ) : (
            <div className="prose prose-lg">
              {content.bio ? (
                <p className="whitespace-pre-wrap">{content.bio}</p>
              ) : (
                <p className="text-gray-500">No bio added yet. Click Edit to add one.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}