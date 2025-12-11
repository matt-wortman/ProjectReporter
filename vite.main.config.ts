import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['better-sqlite3'],
    },
  },
  resolve: {
    // Ensure native modules are not bundled
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});
