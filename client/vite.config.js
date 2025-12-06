import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react(),tailwindcss()],
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // true to listen on all addresses, false to listen on localhost only
    port: 5173       // specify the port number
    // strictPort: false, // if true, exit if the specified port is already in use
  },
})
