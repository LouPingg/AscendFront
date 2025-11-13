import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Gallery from "./pages/Gallery";
import Album from "./pages/Album";
import Events from "./pages/Events";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  );
}