import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';

export default function DestinationPage(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(()=>{API.get(`/destinations/${id}`).then(r=>setData(r.data)).catch(()=>{});},[id]);
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-3xl font-bold">{data.destination.name}</h1>
      <p className="text-gray-600">{data.destination.description}</p>
      <section className="mt-6">
        <h2 className="text-2xl mb-4">Posts</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.posts.map(p => <PostCard key={p._id} post={p} />)}
        </div>
      </section>
    </div>
  );
}