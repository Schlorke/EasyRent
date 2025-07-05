import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Garantir que arquivos grandes sejam incluídos
    assetsInlineLimit: 0,
    // Copiar todos os arquivos estáticos
    copyPublicDir: true,
  },
})
