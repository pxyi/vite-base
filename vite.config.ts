import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite'
const path = require('path');

export default defineConfig({
  alias: [
    { find: '/@', replacement: path.resolve(__dirname, './src') },
    { find: '/$', replacement: path.resolve(__dirname, './src/utils/$') },
    { find: '/@u', replacement: path.resolve(__dirname, './src/utils') },
    { find: '/@a', replacement: path.resolve(__dirname, './src/assets') },,
  ],
  build: {
    commonjsOptions: {
      dynamicRequireTargets: ['crypto-js', 'element-plus'],
    }
  },
  plugins: [vue()],
})
