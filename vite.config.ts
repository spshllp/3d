import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@react-three/fiber', '@react-three/drei', '@react-three/xr', 'three', 'react-colorful', 'html2canvas']
  },
});
