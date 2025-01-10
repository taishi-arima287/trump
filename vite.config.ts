import type { ViteDevServer } from "vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  base: "./",
  build: {
    outDir: "dist",
    cssCodeSplit: true,
    rollupOptions: {
      input: "./src/poker/index.html",
      output: {
        dir: "dist",
        assetFileNames: () => {
          return "src/poker/[name][extname]";
        },
        entryFileNames: "src/poker/index.js",
        chunkFileNames: "src/poker/[name].js",
        inlineDynamicImports: true,
      },
    },
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
