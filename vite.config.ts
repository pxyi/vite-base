import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default {
  alias: { '/@': resolve(__dirname, 'src') },
  plugins: [vue()],
  optimizeDeps: {
    include: ['lodash']
  },
}