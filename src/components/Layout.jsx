// src/components/Layout.jsx
import Sidebar from "./Sidebar";
import LogoBanner from "./LogoBanner";
import "../styles/Layout.css";

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="page-wrapper">
        {/* Unique wrapper pour la bannière */}
        <div className="banner-wrapper">
          <LogoBanner />
        </div>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}