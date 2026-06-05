import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.CAPACITOR_BUILD ? './' : '/cerveceria-burgos-recipes-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cervecería Burgos — Recetas',
        short_name: 'Recetas Burgos',
        description: 'Carta de recetas interna para el equipo de Cervecería Burgos',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        scope: '/cerveceria-burgos-recipes-app/',
        start_url: '/cerveceria-burgos-recipes-app/',
        icons: [
          {
            src: '/cerveceria-burgos-recipes-app/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/cerveceria-burgos-recipes-app/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
    }),
  ],
})
