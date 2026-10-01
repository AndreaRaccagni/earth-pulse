import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/earth-pulse/',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
