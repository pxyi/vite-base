import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  alias: [
    { find: '/@', replacement: resolve(__dirname, './src') },
    { find: '$', replacement: resolve(__dirname, './src/utils/$/index') }
  ],
  build: {
    commonjsOptions: {
      dynamicRequireTargets: ['crypto-js'],
    }
  },
  plugins: [vue()],
})
