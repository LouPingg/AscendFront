// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ASCEND</h2>

      <nav className="sidebar-nav">
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/events">Events</Link>

        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/signup">Signup</Link>}

        {user && (
          <button className="logout-btn" onClick={logout}>
            Logout ({user.nickname})
          </button>
        )}

        {user && user.role === "admin" && (
          <>
            <div className="sidebar-separator"></div>
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}