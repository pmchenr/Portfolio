import { useEffect, useState } from 'react';
import API from '../api';
import ImageLightbox from '../components/ImageLightbox';

// Shuffle array randomly
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        // Fetch trips and posts in parallel
        const [tripsRes, postsRes] = await Promise.all([
          API.get('/trips'),
          API.get('/posts')
        ]);

        // Get gallery images from trips
        const tripImages = tripsRes.data.flatMap(trip => trip.galleryImages || []);

        // Get images from posts
        const postImages = postsRes.data.flatMap(post => post.images || []);

        // Combine and shuffle all images
        const allImages = shuffleArray([...tripImages, ...postImages]);
        setImages(allImages);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllImages();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Gallery</h1>
        <p>Loading photos...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Gallery</h1>

      {images.length === 0 ? (
        <p className="text-gray-500">No photos yet. Add images to your trips to see them here!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Gallery photo ${i + 1}`}
              className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
    </div>
  );
}