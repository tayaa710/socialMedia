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
        : JSON.stringify(''),
      'import.meta.env.VITE_SOCKET_URL': isProd
        ? JSON.stringify('https://socialmedia-wvs5.onrender.com')
        : JSON.stringify('ws://localhost:8900')
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Ignore warnings about "use client" directives
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && 
              warning.message.includes('"use client"')) {
            return;
          }
          warn(warning);
        }
      }
    }
  }
})
