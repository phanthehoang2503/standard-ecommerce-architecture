import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/users': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/products': 'http://localhost:8080',
      '/categories': 'http://localhost:8080',
      '/order': 'http://localhost:8080',
      '/cart': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
    }
  }
})
