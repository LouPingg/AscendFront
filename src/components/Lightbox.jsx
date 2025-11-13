import "../styles/Lightbox.css";

export default function Lightbox({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={image} alt="Preview" />
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
}