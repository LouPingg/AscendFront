import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <h2>ASCEND</h2>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/events">Events</Link>

        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/signup">Sign Up</Link>}

        {user && (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}

        {user && user.role === "admin" && <Link to="/admin">Admin</Link>}
      </nav>
    </aside>
  );
}