import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': isProd 
        ? JSON.stringify('https://authentra-backend.onrender.com/api')
        : JSON.stringify('')
    }
  }
})
