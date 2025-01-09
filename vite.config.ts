import type { ViteDevServer } from "vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  base: "./",
  build: {
    rollupOptions: {
      input: {
        poker: "./src/poker/index.html",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true,
    open: false,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    {
      name: "configure-server",
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: any, res, next) => {
          if (req.url === "/poker" || req.url === "/poker/") {
            req.url = "/src/poker/index.html";
          }
          next();
        });
      },
    },
  ],
});
