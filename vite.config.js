import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ imports: ['vue', 'vue-router'], dts: false }),
    Components({ dts: false }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
