import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import "../styles/Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    image: null,
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(
        res.data.sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
      );
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => fd.append(key, val));

    try {
      await api.post("/events", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        title: "",
        description: "",
        startAt: "",
        endAt: "",
        image: null,
      });

      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event");
    }
  };

  return (
    <section className="events">
      <h2 className="section-title"><span className="icon">🕒</span> All Events</h2>

      {user && (
        <form className="event-form" onSubmit={handleCreate}>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label>Start date</label>
          <input
            type="datetime-local"
            name="startAt"
            value={form.startAt}
            onChange={handleChange}
            required
          />

          <label>End date</label>
          <input
            type="datetime-local"
            name="endAt"
            value={form.endAt}
            onChange={handleChange}
            required
          />

          <label>Event image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">CREATE EVENT</button>
        </form>
      )}

      <div className="event-list">
        {events.map((ev) => (
          <EventCard key={ev._id} event={ev} />
        ))}
      </div>
    </section>
  );
}