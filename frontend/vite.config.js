import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

module.exports = {
  root: 'src',
  build: {
    outDir: '../build',
    emptyOutDir: true, // also necessary
  },
  preview: {
    port: 3000
  },
  server: {
    port: 8080
  },
};