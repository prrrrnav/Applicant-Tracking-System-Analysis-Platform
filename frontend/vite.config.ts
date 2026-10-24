import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Applicant-Tracking-System-Analysis-Platform/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://server:5000",
        changeOrigin: true,
      },
    },
  },
}));
