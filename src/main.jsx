import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // ✅ changement ici
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/style.css";
import "./styles/responsives.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);