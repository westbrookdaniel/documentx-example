import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import documentxserver from './plugin'

export default defineConfig({
  plugins: [documentxserver()],
})
