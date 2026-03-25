import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@supabase/supabase-js')) return 'vendor-supabase'
          if (id.includes('zustand')) return 'vendor-zustand'
          if (id.includes('react-dom') || /node_modules[\\/]react[\\/]/.test(id)) return 'vendor-react'

          return 'vendor'
        },
      },
    },
  },
})
