import "../styles/EventCard.css";

export default function EventCard({ event, active }) {
  return (
    <div className={`event-card ${active ? "active" : ""}`}>
      {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}

      <div className="event-info">
        <h3>{event.title}</h3>

        <p>{event.description}</p>

        <p>
          {new Date(event.startAt).toLocaleString()} →{" "}
          {new Date(event.endAt).toLocaleString()}
        </p>

        <p className="countdown">⏳ {event.countdown}</p>
      </div>
    </div>
  );
}