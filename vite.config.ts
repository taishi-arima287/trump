import { defineConfig } from 'vite'
import type { ViteDevServer } from 'vite'

export default defineConfig({
  root: './',
  base: './',
  build: {
    rollupOptions: {
      input: {
        poker: './src/poker/index.html'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    open: false
  },
  plugins: [{
    name: 'configure-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: any, res, next) => {
        if (req.url === '/poker' || req.url === '/poker/') {
          req.url = '/src/poker/index.html'
        }
        next()
      })
    }
  }]
}) 