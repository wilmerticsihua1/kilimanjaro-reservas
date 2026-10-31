import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Si el puerto 3000 está ocupado (por ejemplo, otra versión abierta), usa el siguiente libre
    strictPort: false,
    // Abre el navegador automáticamente
    open: true
  }
})
