import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Для статичного хостингу (Netlify): фото з src/images доступні як /seed-images/...
    // так само, як їх роздає CMS-сервер у dev і на Render
    {
      name: 'copy-seed-images',
      apply: 'build',
      closeBundle() {
        fs.cpSync(path.resolve(__dirname, 'src/images'), path.resolve(__dirname, 'dist/seed-images'), { recursive: true })
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3001",
      "/uploads": "http://127.0.0.1:3001",
      "/seed-images": "http://127.0.0.1:3001",
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
