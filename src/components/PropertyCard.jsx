import { useEffect, useState } from "react";
import "../styles/PropertyCard.css";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function PropertyCard({ property, onDeleted, onUpdated, allTags }) {
  const { user } = useAuth();

  const canManage =
    user && (user.role === "admin" || user._id === property.createdBy?._id);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    title: property.title || "",
    description: property.description || "",
    tags: property.tags || [],
    image: null,
  });

  useEffect(() => {
    setEditForm({
      title: property.title || "",
      description: property.description || "",
      tags: property.tags || [],
      image: null,
    });
  }, [property._id, property.title, property.description, property.tags]);

  const toggleEditTag = (tag) => {
    setEditForm((prev) => {
      const exists = prev.tags.includes(tag);
      const nextTags = exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag];
      return { ...prev, tags: nextTags };
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setEditForm((prev) => ({ ...prev, image: files?.[0] || null }));
      return;
    }

    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this property?")) return;

    try {
      await api.delete(`/properties/${property._id}`);
      onDeleted?.();
    } catch (err) {
      console.error("Delete property error:", err);
      alert("Failed to delete property");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", editForm.title);
    fd.append("description", editForm.description);
    fd.append("tags", editForm.tags.join(","));
    if (editForm.image) fd.append("image", editForm.image);

    try {
      await api.patch(`/properties/${property._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsEditOpen(false);
      onUpdated?.();
    } catch (err) {
      console.error("Update property error:", err);
      alert("Failed to update property");
    }
  };

  return (
    <>
      <div className="property-card">
        {/* ACTION BUTTONS */}
        {canManage && (
          <div className="property-actions">
            <button
              type="button"
              className="property-edit-btn"
              onClick={() => setIsEditOpen(true)}
            >
              ✎
            </button>

            <button
              type="button"
              className="property-delete-btn"
              onClick={handleDelete}
            >
              ✖
            </button>
          </div>
        )}

        {property.imageUrl && <img src={property.imageUrl} alt={property.title} />}

        <div className="property-info">
          <h3>{property.title}</h3>
          <p>{property.description}</p>

          <p className="property-author">
            Published by <strong>{property.createdBy?.nickname || "Unknown"}</strong>
          </p>

          {property.tags?.length > 0 && (
            <div className="property-tags">
              {property.tags.map((t) => (
                <span className="property-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ EDIT MODAL (SORTIE DE LA CARD) */}
      {canManage && isEditOpen && (
        <div className="re-modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="re-modal re-modal--compact" onClick={(e) => e.stopPropagation()}>
            <div className="re-modal-header">
              <h3>Edit property</h3>
              <button
                type="button"
                className="re-modal-close"
                onClick={() => setIsEditOpen(false)}
              >
                ✖
              </button>
            </div>

            <form className="property-form" onSubmit={handleUpdate}>
              <label>Title</label>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                required
              />

              <label>Tags</label>
              <div className="tag-picker">
                {(allTags || []).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tag-chip ${editForm.tags.includes(t) ? "selected" : ""}`}
                    onClick={() => toggleEditTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label>Replace image (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditChange}
              />

              <button type="submit">SAVE CHANGES</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}