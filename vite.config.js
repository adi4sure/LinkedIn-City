import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url?.split('?')[0] ?? '';
          const isViteInternal = url.startsWith('/@') || url.startsWith('/node_modules');
          const isAsset = url.includes('.');
          const isApi = url.startsWith('/api');

          if (!isViteInternal && !isAsset && !isApi && url !== '/') {
            req.url = '/';
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    strictPort: true,
  }
})
