import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    // recharts imports `react-is`; force both into prebundle so resolution succeeds
    include: ['react-is', 'recharts'],
  },
})
