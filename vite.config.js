import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows external access
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'bba12085eb8e.ngrok-free.app', // add your ngrok URL here
      '.ngrok-free.app'               // allow any subdomain of ngrok-free.app
    ]
  }
})