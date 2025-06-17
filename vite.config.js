import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import ViteRestart from "vite-plugin-restart";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Allow access from other devices on the network
    port: 5173, // Default Vite port
  },
  build: {
    outDir: "dist", // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    sourcemap: true, // Generate source maps for easier debugging
  },
  plugins: [
    react(),
    tailwindcss(),
    ViteRestart({
      restart: ["../src/**/*.{js,jsx,ts,tsx}", "public/**/*"], // Reload on changes in these directories
    }),
  ],
});
