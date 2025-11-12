import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Admin() {
  const [whitelist, setWhitelist] = useState([]);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wl, us] = await Promise.all([
        api.get("/auth/whitelist"),
        api.get("/auth/users"),
      ]);
      setWhitelist(wl.data);
      setUsers(us.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  // === Autoriser un pseudo ===
  const authorizeUser = async () => {
    if (!nickname.trim()) return;
    try {
      await api.post("/auth/authorize", { nickname });
      setNickname("");
      loadData();
    } catch {
      alert("Failed to authorize user");
    }
  };

  // === Retirer un pseudo de la whitelist ===
  const removeFromWhitelist = async (nick) => {
    if (!confirm(`Remove ${nick} from whitelist?`)) return;
    try {
      await api.delete(`/auth/whitelist/${nick}`);
      setWhitelist(whitelist.filter((u) => u.nickname !== nick));
    } catch {
      alert("Failed to remove user");
    }
  };

  // === Réinitialiser le mot de passe ===
  const resetPassword = async (nick) => {
    if (!password.trim()) {
      alert("Enter new password first!");
      return;
    }
    try {
      await api.post("/auth/reset-password", {
        nickname: nick,
        newPassword: password,
      });
      setPassword("");
      alert("Password reset successful");
    } catch {
      alert("Failed to reset password");
    }
  };

  // === Supprimer un utilisateur ===
  const deleteUser = async (id, nick) => {
    if (!confirm(`Delete user ${nick}?`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  return (
    <section className="admin">
      <h2>Admin Panel</h2>

      {/* === Whitelist management === */}
      <div className="panel">
        <h3>Whitelist Management</h3>
        <div className="add-form">
          <input
            type="text"
            placeholder="Nickname to authorize"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={authorizeUser}>Authorize</button>
        </div>

        <ul className="whitelist">
          {whitelist.map((u) => (
            <li key={u.nickname}>
              {u.nickname}
              <button
                className="danger"
                onClick={() => removeFromWhitelist(u.nickname)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* === User management === */}
      <div className="panel">
        <h3>User Management</h3>
        <div className="password-reset">
          <input
            type="text"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Nickname</th>
              <th>Role</th>
              <th>Authorized</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.nickname}</td>
                <td>{u.role}</td>
                <td>{u.authorized ? "✅" : "❌"}</td>
                <td>
                  <button onClick={() => resetPassword(u.nickname)}>
                    Reset
                  </button>
                  <button
                    className="danger"
                    onClick={() => deleteUser(u._id, u.nickname)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}