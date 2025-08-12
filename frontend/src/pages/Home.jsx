import { useEffect, useState } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';

export default function Home(){
  const [posts, setPosts] = useState([]);
  useEffect(()=>{API.get('/posts').then(r=>setPosts(r.data)).catch(()=>{});},[]);
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-4xl font-bold">Welcome to my travel blog</h1>
        <p className="text-gray-600 mt-2">Stories and photos from my adventures.</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.slice(0,4).map(p=> <PostCard key={p._id} post={p} />)}
        </div>
      </section>
    </div>
  );
}

