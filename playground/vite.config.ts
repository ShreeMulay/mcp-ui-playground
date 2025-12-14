import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4567,
    open: true,
  },
  build: {
    outDir: 'dist',
  }
});
