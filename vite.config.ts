import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 7435,
    proxy: {
      '/api': {
        target: 'http://localhost:8784',
        changeOrigin: true,
        headers: {
          'Authorization': `Bearer ${process.env.THINKT_API_TOKEN || 'test-token'}`,
          'Origin': 'http://localhost:8784'
        }
      },
      '/swagger': {
        target: 'http://localhost:8784',
        changeOrigin: true
      },
      '/openapi.json': {
        target: 'http://localhost:8784',
        changeOrigin: true
      }
    },
    fs: {
      // Allow serving files from one level up to support the local ../ts-thinkt dependency
      allow: ['..']
    }
  }
});
