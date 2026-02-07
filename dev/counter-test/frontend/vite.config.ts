import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // tudo que começar com /api vai para o backend
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
