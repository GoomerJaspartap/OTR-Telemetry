import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['react-map-gl', 'mapbox-gl'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "mapbox-gl/dist/mapbox-gl.css";`
      }
    }
  }
})
