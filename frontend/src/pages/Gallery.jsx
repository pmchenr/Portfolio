import { useEffect, useState } from 'react';
import API from '../api';
import ImageGrid from '../components/ImageGrid';

export default function Gallery(){
  const [images, setImages] = useState([]);
  useEffect(()=>{
    API.get('/posts').then(r=>{
      const imgs = r.data.flatMap(p => p.images || []);
      setImages(imgs);
    }).catch(()=>{});
  },[]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Gallery</h1>
      <ImageGrid images={images} />
    </div>
  );
}