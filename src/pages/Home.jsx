import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Home() {
  const [active, setActive] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    fetchEvents();
    const timer = setInterval(fetchEvents, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      const now = new Date();

      const activeEvents = res.data.filter(
        (e) => new Date(e.startAt) <= now && new Date(e.endAt) >= now
      );

      const upcomingEvents = res.data
        .filter((e) => new Date(e.startAt) > now)
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

      setActive(activeEvents);
      setUpcoming(upcomingEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const getCountdown = (target) => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <section className="home">
      <h2>🔥 Ongoing Event</h2>
      {active.length === 0 ? (
        // 😴 Petit troll personnalisé
        <p className="no-events">Nothing here → Rframe's nap 😴</p>
      ) : (
        <div className="event-list">
          {active.map((ev) => (
            <div key={ev._id} className="event-card active">
              {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} />}
              <div className="event-info">
                <h3>{ev.title}</h3>
                <p>{ev.description}</p>
                <p>
                  🕐 From{" "}
                  {new Date(ev.startAt).toLocaleString()} →{" "}
                  {new Date(ev.endAt).toLocaleString()}
                </p>
                <p className="countdown">
                  ⏳ Ends in {getCountdown(ev.endAt)}
                </p>
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
                <p>
                  Starts: {new Date(ev.startAt).toLocaleString()}
                </p>
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