import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { componentTagger } from 'lovable-tagger'

export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Leave blank to ensure `/api` requests hit Vercel backend
    },
  },
})