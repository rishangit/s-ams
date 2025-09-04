import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_SERVER_PORT) || 3001,
      host: env.VITE_SERVER_HOST || 'localhost',
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001',
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: env.VITE_UPLOADS_BASE_URL || 'http://localhost:5001',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
