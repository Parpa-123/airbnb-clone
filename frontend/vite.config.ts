import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',

      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Mantine UI
          'vendor-mantine': ['@mantine/core', '@mantine/hooks', '@mantine/form', '@mantine/dropzone'],
          // Material UI
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled'],
          // Icons
          'vendor-icons': ['react-icons'],
          // Maps
          'vendor-maps': ['leaflet', 'react-leaflet'],
          // Data/utilities
          'vendor-data': ['dayjs', 'axios'],
          // State management & forms
          'vendor-forms': ['@reduxjs/toolkit', 'react-redux', 'react-hook-form', '@hookform/resolvers', 'yup'],
        },
      },
    },
  },
})
