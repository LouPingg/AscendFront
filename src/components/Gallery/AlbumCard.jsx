// src/components/Gallery/AlbumCard.jsx
import { useNavigate } from "react-router-dom";
import "../../styles/gallery.css";

export default function AlbumCard({ album, onDelete }) {
  const navigate = useNavigate();

  const cover = album.coverUrl || null;

  // ✅ Compteur de photos robuste
  const photoCount =
    album.photoCount ??
    album.photosCount ??
    (Array.isArray(album.photos) ? album.photos.length : 0) ??
    0;

  return (
    <div
      className="album-card"
      onClick={() => navigate(`/album/${album._id}`)}
    >
      {/* COVER / PLACEHOLDER */}
      {cover ? (
        <img src={cover} alt={album.title} className="album-img" />
      ) : (
        <div className="album-placeholder">
          <span className="placeholder-icon">📁</span>
          <p>No cover</p>
        </div>
      )}

      <h3 className="album-title">{album.title}</h3>

      <p className="album-count">📸 {photoCount} photos</p>

      <p className="album-author">
        by {album.createdBy?.nickname || "Unknown"}
      </p>

      {/* DELETE BUTTON */}
      {onDelete && (
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(album._id);
          }}
        >
          ✖
        </button>
      )}
    </div>
  );
}