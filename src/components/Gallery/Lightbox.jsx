// src/components/Gallery/Lightbox.jsx
import { useEffect } from "react";
import "../../styles/lightbox.css";

export default function Lightbox({ photo, photos, onClose, onNavigate }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate("next");
      if (e.key === "ArrowLeft") onNavigate("prev");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photo]);

  if (!photo) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        
        {/* IMAGE */}
        <img src={photo.imageUrl} alt="" className="lightbox-img" />

        {/* CLOSE */}
        <button className="lightbox-close" onClick={onClose}>✖</button>

        {/* NAVIGATION */}
        <button className="lightbox-prev" onClick={() => onNavigate("prev")}>
          ‹
        </button>

        <button className="lightbox-next" onClick={() => onNavigate("next")}>
          ›
        </button>

      </div>
    </div>
  );
}