// src/components/LogoBanner.jsx
import logo from "../assets/ascend.png";
import "../styles/LogoBanner.css";

export default function LogoBanner() {
  return <img src={logo} alt="Ascend Logo" className="banner-logo" />;
}