import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/websocket': {
        target: 'ws://localhost:9000',
        ws: true
      },
    }
  }
})
