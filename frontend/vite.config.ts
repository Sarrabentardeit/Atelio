import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En développement, /api est redirigé vers le backend (port 4100).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    proxy: {
      '/api': {
        target: 'http://localhost:4100',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
