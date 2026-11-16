import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@vidyafloww/ui': path.resolve(__dirname, '../../packages/ui/index.ts'),
      '@vidyafloww/types': path.resolve(__dirname, '../../packages/types/index.ts'),
      '@vidyafloww/utils': path.resolve(__dirname, '../../packages/utils/index.ts'),
      '@vidyafloww/constants': path.resolve(__dirname, '../../packages/constants/index.ts'),
    },
  },
  server: {
    port: 3001,
  },
  build: {
    sourcemap: true,
  },
});
