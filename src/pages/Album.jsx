import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Album() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAlbum();
    fetchPhotos();
  }, []);

  // === Récupérer les infos de l’album ===
  const fetchAlbum = async () => {
    try {
      const res = await api.get("/gallery/albums");
      const found = res.data.find((a) => a._id === id);
      setAlbum(found || null);
    } catch (err) {
      console.error("❌ Error fetching album:", err);
    }
  };

  // === Récupérer les photos associées à cet album ===
  const fetchPhotos = async () => {
    try {
      const res = await api.get(`/gallery/albums/${id}/photos`);
      setPhotos(res.data);
    } catch (err) {
      console.error("❌ Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  };

  // === Upload d’une photo ===
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await api.post(`/gallery/albums/${id}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchPhotos();
      fetchAlbum(); // met à jour la cover si c’était la première photo
    } catch (err) {
      console.error("❌ Error uploading photo:", err);
    }
  };

  // === Supprimer une photo ===
  const handleDelete = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await api.delete(`/gallery/photos/${photoId}`);
      fetchPhotos();
      fetchAlbum();
    } catch (err) {
      console.error("❌ Error deleting photo:", err);
    }
  };

  if (loading) return <p className="loading">Loading album...</p>;
  if (!album) return <p>Album not found.</p>;

  const canEdit =
    user && (user.role === "admin" || user._id === album.createdBy?._id);

  return (
    <div className="album-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>{album.title}</h2>
      <p>
        Created by <strong>{album.createdBy?.nickname || "Unknown"}</strong>
      </p>

      {/* Upload form visible seulement pour créateur ou admin */}
      {canEdit && (
        <form className="upload-form" onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Upload photo</button>
        </form>
      )}

      {/* Galerie des photos */}
      <div className="photo-grid">
        {photos.length === 0 ? (
          <p>No photos yet.</p>
        ) : (
          photos.map((photo) => (
            <div key={photo._id} className="photo-card">
              <img src={photo.imageUrl} alt={album.title} />

              {/* ✅ Bouton visible pour admin ou créateur */}
              {(user?.role === "admin" ||
                user?._id === photo.createdBy?._id) && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(photo._id)}
                >
                  🗑
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}