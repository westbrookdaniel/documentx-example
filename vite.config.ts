import { defineConfig } from 'vite'
import documentxssr from 'documentx-ssr/plugin'

export default defineConfig({
  plugins: [documentxssr()],
})
