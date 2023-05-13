import { defineConfig } from 'vite'
import { documentxssr } from 'documentx-ssr'

export default defineConfig({
  plugins: [documentxssr()],
})
