import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⚠️ Remplace par le nom EXACT de ton repo GitHub
export default defineConfig({
  plugins: [react()],
  base: "/AscendFront/",
});
