import { defineConfig } from 'vite';

// `base: './'` keeps asset paths relative, so the build works on GitHub Pages
// (https://<user>.github.io/mms-todo-app/) as well as on any other static host.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
  },
});
