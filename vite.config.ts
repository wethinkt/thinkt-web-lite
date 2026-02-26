import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8784',
        changeOrigin: true,
        headers: {
          'Authorization': `Bearer ${process.env.THINKT_API_TOKEN || 'test-token'}`
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
    }
  }
});
