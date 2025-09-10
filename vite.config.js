// vite.config.js
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

  // 추가: 프록시 (개발용)
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
      '/oauth2': {
        target: import.meta.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: import.meta.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: import.meta.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
