import Sidebar from "./Sidebar";
import VideoBanner from "./VideoBanner";
import "../styles/Layout.css";

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="page-wrapper">
        <div className="banner-wrapper">
          <VideoBanner />
        </div>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}