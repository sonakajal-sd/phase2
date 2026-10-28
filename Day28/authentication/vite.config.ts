import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Send /api requests to the Express backend.
    // Frontend and backend then look like one site, so cookies just work (no CORS setup).
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
