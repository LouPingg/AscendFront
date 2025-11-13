import "../styles/EventsSection.css";

export default function EventsSection({
  active = [],
  upcoming = [],
  rframeImg,
}) {
  const getCountdown = (target) => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return "Ended";
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <section className="event-section">
      <h2>🔥 Ongoing Event</h2>

      {active.length === 0 ? (
        <div className="no-events">
          <p>Nothing here → Rframe's nap 😴</p>
          {rframeImg && <img src={rframeImg} alt="Rframe sleeping" />}
        </div>
      ) : (
        <div className="event-list">
          {active.map((ev) => (
            <div key={ev._id} className="event-card active">
              {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} />}
              <div className="event-info">
                <h3>{ev.title}</h3>
                <p>{ev.description}</p>
                <p>
                  🕐 {new Date(ev.startAt).toLocaleString()} →{" "}
                  {new Date(ev.endAt).toLocaleString()}
                </p>
                <p className="countdown">⏳ Ends in {getCountdown(ev.endAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>🕒 Upcoming Events</h2>

      {upcoming.length === 0 ? (
        <p className="no-events">No upcoming events.</p>
      ) : (
        <div className="event-list">
          {upcoming.map((ev) => (
            <div key={ev._id} className="event-card">
              {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} />}
              <div className="event-info">
                <h3>{ev.title}</h3>
                <p>{ev.description}</p>
                <p>Starts: {new Date(ev.startAt).toLocaleString()}</p>
                <p className="countdown">
                  ⏳ Starts in {getCountdown(ev.startAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}