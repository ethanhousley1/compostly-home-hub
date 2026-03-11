import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import mdx from "@mdx-js/rollup";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
      port: 8080,
    },
    proxy: {
      "/docs": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [mdx(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
