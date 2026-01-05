import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import "../styles/RealEstate.css";

export default function RealEstate() {
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [tags, setTags] = useState([]);

  // Filters
  const [selectedTags, setSelectedTags] = useState([]); // multi
  const [creatorQuery, setCreatorQuery] = useState("");

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create form
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: [],
    image: null,
  });

  useEffect(() => {
    fetchTags();
    fetchProperties();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await api.get("/properties/tags");
      setTags(res.data);
    } catch (err) {
      console.error("Error fetching property tags:", err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties");
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  // ✅ Filter behavior: ANY selected tag matches (OR)
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const pTags = p.tags || [];

      const okTags =
        selectedTags.length > 0
          ? selectedTags.some((t) => pTags.includes(t))
          : true;

      const nick = (p.createdBy?.nickname || "").toLowerCase();
      const q = creatorQuery.toLowerCase().trim();
      const okCreator = q ? nick.includes(q) : true;

      return okTags && okCreator;
    });
  }, [properties, selectedTags, creatorQuery]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files?.[0] || null }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Form tags (for creation)
  const toggleFormTag = (tag) => {
    setForm((prev) => {
      const exists = prev.tags.includes(tag);
      const nextTags = exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag];
      return { ...prev, tags: nextTags };
    });
  };

  // Filter tags (for filtering list)
  const toggleFilterTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSelectedTags([]);
    setCreatorQuery("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("tags", form.tags.join(","));
    if (form.image) fd.append("image", form.image);

    try {
      await api.post("/properties", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ title: "", description: "", tags: [], image: null });
      setIsCreateOpen(false);
      fetchProperties();
    } catch (err) {
      console.error("Error creating property:", err);
      alert("Failed to create property");
    }
  };

  return (
    <section className="real-estate">
      <h2 className="section-title">
        <span className="icon">🏠</span> Ascend Real Estate
      </h2>

      {/* FILTERS */}
      <div className="re-filters">
        <div className="re-filter">
          <label>Filter by tags</label>
          <div className="re-tag-filters">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={`re-tag-chip ${selectedTags.includes(t) ? "selected" : ""}`}
                onClick={() => toggleFilterTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="re-filter">
          <label>Filter by creator</label>
          <input
            type="text"
            placeholder="Nickname..."
            value={creatorQuery}
            onChange={(e) => setCreatorQuery(e.target.value)}
          />
        </div>

        <button type="button" className="re-reset" onClick={resetFilters}>
          Reset filters
        </button>
      </div>

      {/* OPEN CREATE MODAL */}
      {user && (
        <button
          type="button"
          className="re-open-create"
          onClick={() => setIsCreateOpen(true)}
        >
          + Add property
        </button>
      )}

      {/* CREATE MODAL */}
      {user && isCreateOpen && (
        <div className="re-modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="re-modal" onClick={(e) => e.stopPropagation()}>
            <div className="re-modal-header">
              <h3>Create property</h3>
              <button
                type="button"
                className="re-modal-close"
                onClick={() => setIsCreateOpen(false)}
              >
                ✖
              </button>
            </div>

            <form className="property-form" onSubmit={handleCreate}>
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />

              <label>Tags</label>
              <div className="tag-picker">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tag-chip ${form.tags.includes(t) ? "selected" : ""}`}
                    onClick={() => toggleFormTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label>Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />

              <button type="submit">CREATE PROPERTY</button>
            </form>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="property-list">
        {filtered.length === 0 ? (
          <div className="no-event-block">
            <p>No properties yet.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <PropertyCard
              key={p._id}
              property={p}
              allTags={tags}
              onDeleted={fetchProperties}
              onUpdated={fetchProperties}
            />
          ))
        )}
      </div>
    </section>
  );
}