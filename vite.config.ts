import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'https://pub-48f5c35bbeac46cebd7922bbf8239e36.r2.dev/Bakery%20Shop/mk-bakery-logo.webp'],
      manifest: {
        name: 'MK Bakery',
        short_name: 'MK Bakery',
        description: 'Artisanal Cakes & Pastries',
        theme_color: '#F48E89', // strawberry color
        background_color: '#FAFAFA',
        display: 'standalone',
        icons: [
          {
            src: 'https://pub-48f5c35bbeac46cebd7922bbf8239e36.r2.dev/Bakery%20Shop/mk-bakery-logo.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'https://pub-48f5c35bbeac46cebd7922bbf8239e36.r2.dev/Bakery%20Shop/mk-bakery-logo.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform/resolvers')) {
              return 'vendor-forms';
            }
            if (id.includes('date-fns') || id.includes('lenis')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})


