import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

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
        res.data.sort(
          (a, b) => new Date(a.startAt) - new Date(b.startAt)
        )
      );
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm({ ...form, image: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const start = new Date(form.startAt);
    const end = new Date(form.endAt);
    const now = new Date();

    // ✅ Vérification côté front avant envoi
    if (isNaN(start) || isNaN(end)) {
      alert("Please select valid start and end dates.");
      return;
    }
    if (end <= now) {
      alert("End date must be in the future.");
      return;
    }
    if (end <= start) {
      alert("End date must be after start date.");
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) =>
        fd.append(key, val)
      );
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
      alert(
        err.response?.data?.message || "Failed to create event."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };

  const canEdit = (ev) =>
    user &&
    (user.role === "admin" || user._id === ev.createdBy?._id);

  return (
    <section className="events">
      <h2>All Events</h2>

      {/* ✅ Tous les utilisateurs connectés peuvent créer */}
      {user && (
        <form className="event-form" onSubmit={handleCreate}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <label>Start date:</label>
          <input
            type="datetime-local"
            name="startAt"
            value={form.startAt}
            onChange={handleChange}
            required
          />
          <label>End date:</label>
          <input
            type="datetime-local"
            name="endAt"
            value={form.endAt}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Create event</button>
        </form>
      )}

      <div className="event-list">
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          events.map((ev) => (
            <div key={ev._id} className="event-card">
              {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} />}
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
              <p>
                {new Date(ev.startAt).toLocaleString()} →{" "}
                {new Date(ev.endAt).toLocaleString()}
              </p>
              <p>by {ev.createdBy?.nickname || "?"}</p>

              {canEdit(ev) && (
                <button onClick={() => handleDelete(ev._id)}>🗑</button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}