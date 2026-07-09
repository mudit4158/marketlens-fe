import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/gold': 'http://localhost:8001',
      '/dashboard': 'http://localhost:8001',
    },
  },
})
