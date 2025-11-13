import { useEffect, useState } from "react";
import api from "../utils/api";
import EventCard from "../components/EventCard";
import rframeImg from "../assets/rframe.png";

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

      setActive(
        activeEvents.map((e) => ({
          ...e,
          countdown: getCountdown(e.endAt),
        }))
      );

      setUpcoming(
        upcomingEvents.map((e) => ({
          ...e,
          countdown: getCountdown(e.startAt),
        }))
      );
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

      {/* 🔥 ONGOING EVENT */}
      <h2 className="section-title">
        <span className="icon">🔥</span> Ongoing Event
      </h2>

      {active.length === 0 ? (
        <div className="rframe-wrapper">
          <img src={rframeImg} alt="Rframe sleeping" className="rframe-img" />
          <p className="rframe-text">Nothing here → Rframe’s nap 😴</p>
        </div>
      ) : (
        <div className="event-list">
          {active.map((ev) => (
            <EventCard key={ev._id} event={ev} active={true} />
          ))}
        </div>
      )}

      {/* 🕒 UPCOMING EVENTS */}
      <h2 className="section-title">
        <span className="icon">🕒</span> Upcoming Events 
      </h2>

      {upcoming.length === 0 ? (
        <div className="no-event-block">
  <p>No upcoming events 😭</p>
</div>
      ) : (
        <div className="event-list">
          {upcoming.map((ev) => (
            <EventCard key={ev._id} event={ev} active={false} />
          ))}
        </div>
      )}
    </section>
  );
}