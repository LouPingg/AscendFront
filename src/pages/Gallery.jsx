import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  // === Récupérer tous les albums ===
  const fetchAlbums = async () => {
    try {
      const res = await api.get("/gallery/albums");
      setAlbums(res.data);
    } catch (err) {
      console.error("❌ Error fetching albums:", err);
    }
  };

  // === Créer un album (avec éventuellement une image de couverture) ===
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fd = new FormData();
    fd.append("title", title);
    if (file) fd.append("image", file);

    try {
      await api.post("/gallery/albums", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setFile(null);
      fetchAlbums();
    } catch (err) {
      console.error("❌ Error creating album:", err);
    }
  };

  // === Supprimer un album ===
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this album?")) return;
    try {
      await api.delete(`/gallery/albums/${id}`);
      fetchAlbums();
    } catch (err) {
      console.error("❌ Error deleting album:", err);
    }
  };

  return (
    <section className="gallery">
      <h2>Gallery</h2>

      {/* Formulaire de création d’album (visible pour les users connectés) */}
      {user && (
        <form className="create-album" onSubmit={handleCreate}>
          <input
            type="text"
            value={title}
            placeholder="Album title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Create Album</button>
        </form>
      )}

      {/* Liste des albums */}
      <div className="album-grid">
        {albums.length === 0 ? (
          <p>No albums yet.</p>
        ) : (
          albums.map((album) => (
            <div
              key={album._id}
              className="album-card"
              onClick={() => navigate(`/album/${album._id}`)}
            >
              {album.coverUrl ? (
                <img src={album.coverUrl} alt={album.title} />
              ) : (
                <div className="album-placeholder">No cover</div>
              )}

              <h3>{album.title}</h3>
              <p>by {album.createdBy?.nickname || "Unknown"}</p>

              {(user?.role === "admin" ||
                user?._id === album.createdBy?._id) && (
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(album._id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}