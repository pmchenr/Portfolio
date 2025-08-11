export default function PostCard({ post }){
    return (
      <div className="border rounded p-4 bg-white">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="text-sm text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
        <p className="mt-2">{post.content?.slice(0, 150)}...</p>
      </div>
    );
  }