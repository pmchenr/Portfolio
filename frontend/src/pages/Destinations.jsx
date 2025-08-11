import { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Destinations(){
  const [d, setD] = useState([]);
  useEffect(()=>{API.get('/destinations').then(r=>setD(r.data)).catch(()=>{});},[]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Destinations</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {d.map(dest => (
          <Link to={`/destinations/${dest._id}`} key={dest._id} className="block bg-white p-4 border rounded">
            <h3 className="font-semibold">{dest.name}</h3>
            <p className="text-sm text-gray-600">{dest.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}