import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (nickname, password) => {
    const res = await api.post("/auth/login", { nickname, password });
    const { token, nickname: name, role, _id } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ nickname: name, role, _id }));
    setUser({ nickname: name, role, _id });
    navigate("/");
  };

  const signup = async (nickname, password) => {
    await api.post("/auth/signup", { nickname, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);