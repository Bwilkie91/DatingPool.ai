import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/DatingPool.ai/' : '/',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/') && !id.includes('react-intersection') && !id.includes('react-router')) return 'react-vendor'
            if (id.includes('framer-motion')) return 'framer-motion'
            if (id.includes('react-router') || id.includes('@remix-run')) return 'router'
            if (id.includes('react-intersection-observer')) return 'intersection-observer'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 600,
  },
})

