import "../styles/EventCard.css";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function EventCard({ event, active }) {
  const { user } = useAuth();

  const canDelete =
    user && (user.role === "admin" || user._id === event.createdBy?._id);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${event._id}`);
      window.location.reload();
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  return (
    <div className={`event-card ${active ? "active" : ""}`}>
      
      {/* DELETE BUTTON */}
      {canDelete && (
        <button className="event-delete-btn" onClick={handleDelete}>
          ✖
        </button>
      )}

      {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}

      <div className="event-info">
        <h3>{event.title}</h3>

        <p>{event.description}</p>

        <p>
          {new Date(event.startAt).toLocaleString()} →{" "}
          {new Date(event.endAt).toLocaleString()}
        </p>

        {/* 🆕 Published by */}
        <p className="event-author">
          Published by <strong>{event.createdBy?.nickname || "Unknown"}</strong>
        </p>

        <p className="countdown">⏳ {event.countdown}</p>
      </div>
    </div>
  );
}