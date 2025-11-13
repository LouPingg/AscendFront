// src/pages/Gallery.jsx
import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

import AlbumCard from "../components/Gallery/AlbumCard";
import "../styles/gallery.css";

export default function Gallery() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  // === FETCH ALBUMS + PHOTO COUNT ===
  const fetchAlbums = async () => {
    try {
      const res = await api.get("/gallery/albums");

      const enriched = await Promise.all(
        res.data.map(async (album) => {
          try {
            const photos = await api.get(`/gallery/albums/${album._id}/photos`);
            return {
              ...album,
              photoCount: photos.data.length,
            };
          } catch {
            return {
              ...album,
              photoCount: 0,
            };
          }
        })
      );

      setAlbums(enriched);
    } catch (err) {
      console.error("❌ Error fetching albums:", err);
    }
  };

  // === CREATE ALBUM ===
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fd = new FormData();
    fd.append("title", title);
    if (file) fd.append("image", file);

    try {
      await api.post("/gallery/albums", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setFile(null);
      fetchAlbums();
    } catch (err) {
      console.error("❌ Error creating album:", err);
    }
  };

  // === DELETE ALBUM ===
  const handleDelete = async (albumId) => {
    if (!window.confirm("Delete this album?")) return;

    try {
      await api.delete(`/gallery/albums/${albumId}`);
      fetchAlbums();
    } catch (err) {
      console.error("❌ Error deleting album:", err);
    }
  };

  return (
    <section className="gallery-page">
      <h2 className="gallery-title">
        <span className="icon">📁</span> Gallery
      </h2>

      {/* ===== CREATE ALBUM ===== */}
      {user && (
        <form className="create-album-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Album title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit">Create album</button>
        </form>
      )}

      {/* ===== ALBUM GRID ===== */}
      <div className="album-grid">
        {albums.length === 0 ? (
          <p>No albums yet.</p>
        ) : (
          albums.map((album) => (
            <AlbumCard
              key={album._id}
              album={album}
              onDelete={
                user &&
                (user.role === "admin" || user._id === album.createdBy?._id)
                  ? handleDelete
                  : null
              }
            />
          ))
        )}
      </div>
    </section>
  );
}