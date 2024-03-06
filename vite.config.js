import { defineConfig } from 'vite';
import path from 'path';
import vitePugPlugin from 'vite-plugin-pug-transformer';

export default defineConfig({
  plugins: [vitePugPlugin()],
  root: 'src',
  build: {
    outDir: '../dist',
  },
});
