import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    target: "esnext",
    rollupOptions: {
      input: {
        index: "index.html",
        blog: "blog.html",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/media": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
