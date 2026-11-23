import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use import.meta.url instead of __dirname (ESM-safe)
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Target modern browsers — reduces bundle size
    target: 'es2020',
    // Warn if any chunk exceeds 500 KB (Lighthouse budget)
    chunkSizeWarningLimit: 500,
  },
})
