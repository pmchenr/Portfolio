import { useState, useEffect } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import API from '../api';
import ImageUpload from '../components/ImageUpload';

export default function About() {
  const [content, setContent] = useState({
    aboutMe: {
      title: 'About Me',
      bio: '',
      image: ''
    },
    aboutCompany: {
      title: 'About Take More Sick Days',
      bio: '',
      image: ''
    }
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
          // Handle migration from old format
          if (data.value.bio !== undefined && !data.value.aboutMe) {
            // Old format - migrate to new
            const migrated = {
              aboutMe: {
                title: data.value.title || 'About Me',
                bio: data.value.bio || '',
                image: data.value.image || ''
              },
              aboutCompany: {
                title: 'About Take More Sick Days',
                bio: '',
                image: ''
              }
            };
            setContent(migrated);
            setEditData(migrated);
          } else {
            setContent(data.value);
            setEditData(data.value);
          }
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

  const updateAboutMe = (field, value) => {
    setEditData({
      ...editData,
      aboutMe: { ...editData.aboutMe, [field]: value }
    });
  };

  const updateAboutCompany = (field, value) => {
    setEditData({
      ...editData,
      aboutCompany: { ...editData.aboutCompany, [field]: value }
    });
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
    <div className="p-6 max-w-4xl mx-auto space-y-16">
      {/* Edit/Save buttons */}
      <div className="flex justify-end">
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

      {/* About Me Section */}
      <section>
        {editing ? (
          <input
            type="text"
            value={editData.aboutMe?.title || ''}
            onChange={(e) => updateAboutMe('title', e.target.value)}
            className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 outline-none mb-6 w-full"
          />
        ) : (
          <h1 className="text-3xl font-bold mb-6">{content.aboutMe?.title || 'About Me'}</h1>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {editing ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium">Profile Photo</label>
                <ImageUpload
                  images={editData.aboutMe?.image ? [editData.aboutMe.image] : []}
                  onChange={(images) => updateAboutMe('image', images[0] || '')}
                  multiple={false}
                />
              </div>
            ) : (
              content.aboutMe?.image && (
                <img
                  src={content.aboutMe.image}
                  alt="About Me"
                  className="w-full rounded-xl object-cover"
                />
              )
            )}
          </div>

          <div>
            {editing ? (
              <textarea
                value={editData.aboutMe?.bio || ''}
                onChange={(e) => updateAboutMe('bio', e.target.value)}
                className="w-full p-4 border rounded-lg min-h-[400px]"
                placeholder="Write about yourself..."
              />
            ) : (
              <div className="prose prose-lg">
                {content.aboutMe?.bio ? (
                  <p className="whitespace-pre-wrap">{content.aboutMe.bio}</p>
                ) : (
                  <p className="text-gray-500">No bio added yet. Click Edit to add one.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* About the Company Section */}
      <section>
        {editing ? (
          <input
            type="text"
            value={editData.aboutCompany?.title || ''}
            onChange={(e) => updateAboutCompany('title', e.target.value)}
            className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 outline-none mb-6 w-full"
          />
        ) : (
          <h2 className="text-3xl font-bold mb-6">{content.aboutCompany?.title || 'About Take More Sick Days'}</h2>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            {editing ? (
              <textarea
                value={editData.aboutCompany?.bio || ''}
                onChange={(e) => updateAboutCompany('bio', e.target.value)}
                className="w-full p-4 border rounded-lg min-h-[400px]"
                placeholder="Write about your company/mission..."
              />
            ) : (
              <div className="prose prose-lg">
                {content.aboutCompany?.bio ? (
                  <p className="whitespace-pre-wrap">{content.aboutCompany.bio}</p>
                ) : (
                  <p className="text-gray-500">No company description added yet. Click Edit to add one.</p>
                )}
              </div>
            )}
          </div>

          <div className="order-1 md:order-2">
            {editing ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium">Company/Mission Image</label>
                <ImageUpload
                  images={editData.aboutCompany?.image ? [editData.aboutCompany.image] : []}
                  onChange={(images) => updateAboutCompany('image', images[0] || '')}
                  multiple={false}
                />
              </div>
            ) : (
              content.aboutCompany?.image && (
                <img
                  src={content.aboutCompany.image}
                  alt="About the Company"
                  className="w-full rounded-xl object-cover"
                />
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
