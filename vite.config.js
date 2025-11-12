import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Nom de ton repo GitHub Pages
const repoName = "AscendFront";

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`, // ✅ essentiel pour GitHub Pages
  server: {
    port: 5173,
  },
});
