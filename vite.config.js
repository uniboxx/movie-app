import { defineConfig } from 'vite';
import 'dotenv/config';
import vitePugPlugin from 'vite-plugin-pug-transformer';

export default defineConfig({
  plugins: [vitePugPlugin()],
  build: {
    outDir: 'dist',
  },
});
