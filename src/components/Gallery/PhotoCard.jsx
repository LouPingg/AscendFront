// src/components/Gallery/PhotoCard.jsx
import "../../styles/photocard.css";

export default function PhotoCard({ photo, onDelete, onOpen }) {
  return (
    <div className="photo-card" onClick={onOpen}>
      <img src={photo.imageUrl} className="photo-img" alt="album photo" />

      {onDelete && (
        <button
          className="photo-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ✖
        </button>
      )}
    </div>
  );
}