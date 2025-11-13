// src/pages/Album.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

import PhotoCard from "../components/Gallery/PhotoCard";
import Lightbox from "../components/Gallery/Lightbox";

import "../styles/album.css";
import "../styles/lightbox.css";

export default function Album() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);

  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    fetchAlbum();
    fetchPhotos();
  }, [id]); // dépend de l'id

  // === FETCH ALBUM (liste complète puis find) ===
  const fetchAlbum = async () => {
    try {
      const res = await api.get("/gallery/albums");
      const found = res.data.find((a) => a._id === id);
      setAlbum(found || null);
    } catch (err) {
      console.error("❌ Error fetching album:", err);
    }
  };

  // === FETCH PHOTOS ===
  const fetchPhotos = async () => {
    try {
      const res = await api.get(`/gallery/albums/${id}/photos`);
      setPhotos(res.data); // le backend renvoie un tableau de photos
    } catch (err) {
      console.error("❌ Error fetching photos:", err);
    }
  };

  // === UPLOAD PHOTO ===
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      await api.post(`/gallery/albums/${id}/photos`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      fetchPhotos();
      fetchAlbum(); // met à jour le compteur côté album
    } catch (err) {
      console.error("❌ Error uploading:", err);
    }
  };

  // === DELETE PHOTO ===
  const handleDelete = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;

    try {
      await api.delete(`/gallery/photos/${photoId}`);
      fetchPhotos();
      fetchAlbum();
    } catch (err) {
      console.error("❌ Error deleting:", err);
    }
  };

  // === NAVIGATION LIGHTBOX ===
  const navigateLightbox = (dir) => {
    if (!photos.length || currentIndex === null) return;

    let newIndex =
      dir === "next"
        ? (currentIndex + 1) % photos.length
        : (currentIndex - 1 + photos.length) % photos.length;

    setCurrentIndex(newIndex);
    setLightboxPhoto(photos[newIndex]);
  };

  if (!album) return <p>Album not found.</p>;

  const canEdit =
    user && (user.role === "admin" || user._id === album.createdBy?._id);

  return (
    <section className="album-page">
      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => navigate("/gallery")}>
        ← Back
      </button>

      <h2 className="section-title">
        <span className="icon">📷</span> {album.title}
      </h2>

      <p className="album-author-info">
        Created by <strong>{album.createdBy?.nickname || "Unknown"}</strong>
      </p>

      {/* UPLOAD FORM */}
      {canEdit && (
        <form className="upload-form" onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Upload Photo</button>
        </form>
      )}

      {/* GRID DES PHOTOS */}
      <div className="photo-grid">
        {photos.length === 0 ? (
          <p>No photos yet.</p>
        ) : (
          photos.map((photo, index) => (
            <PhotoCard
              key={photo._id}
              photo={photo}
              onOpen={() => {
                setLightboxPhoto(photo);
                setCurrentIndex(index);
              }}
              onDelete={
                user &&
                (user.role === "admin" ||
                  user._id === photo.createdBy?._id)
                  ? () => handleDelete(photo._id)
                  : null
              }
            />
          ))
        )}
      </div>

      {/* LIGHTBOX */}
      <Lightbox
        photo={lightboxPhoto}
        photos={photos}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={navigateLightbox}
      />
    </section>
  );
}