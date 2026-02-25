import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        headers: {
          'Authorization': `Bearer ${process.env.THINKT_API_TOKEN || 'test-token'}`
        }
      }
    }
  }
});
