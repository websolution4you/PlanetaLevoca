import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        booking: resolve(__dirname, 'booking.html'),
        catering: resolve(__dirname, 'catering.html'),
        contact: resolve(__dirname, 'contact.html'),
        daily: resolve(__dirname, 'daily-menu.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        menu: resolve(__dirname, 'menu.html'),
        oslavy: resolve(__dirname, 'oslavy.html'),
        service: resolve(__dirname, 'service.html'),
        testimonial: resolve(__dirname, 'testimonial.html'),
        admin: resolve(__dirname, 'admin-menu.html')
      }
    }
  }
})

