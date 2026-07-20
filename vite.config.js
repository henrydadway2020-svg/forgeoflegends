import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages: build output is /dist, base path is root.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
