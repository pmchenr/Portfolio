import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PostEditor() {
  const { id } = useParams(); // for edit mode
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [destination, setDestination] = useState("");
  const [image, setImage] = useState(null);
  const [destinationsList, setDestinationsList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/destinations")
      .then((res) => setDestinationsList(res.data))
      .catch(console.error);

    if (id) {
      axios
        .get(`http://localhost:5000/api/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setDestination(res.data.destination?._id || "");
        })
        .catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("destination", destination);
    if (image) formData.append("image", image);

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/posts/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/posts`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit Post" : "New Post"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2"
          rows="6"
          required
        />
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Select Destination</option>
          {destinationsList.map((dest) => (
            <option key={dest._id} value={dest._id}>
              {dest.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {id ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
}
