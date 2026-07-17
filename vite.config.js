import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/marafiq": {
        target: "https://app-api-marafiq-we-dev-001.azurewebsites.net",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/marafiq/, ""),
      },
    },
  },
});
