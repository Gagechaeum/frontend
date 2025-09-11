// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const API_BASE = env.VITE_API_BASE_URL;

  return {
    plugins: [
      vue(),
      AutoImport({ imports: ['vue', 'vue-router'], dts: false }),
      Components({ dts: false }),
    ],
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },

    server: {
      proxy: {
        '/api': { target: API_BASE, changeOrigin: true, secure: false },
        '/oauth2': { target: API_BASE, changeOrigin: true, secure: false },
        '/login': { target: API_BASE, changeOrigin: true, secure: false },
        '/logout': { target: API_BASE, changeOrigin: true, secure: false },
      },
    },
  };
});
