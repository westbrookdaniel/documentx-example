import path from 'node:path'
import { Plugin, defineConfig } from 'vite'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

function plugin(): Plugin[] {
  global.documentxssr = {
    css: [],
  }

  return [
    {
      name: 'documentx-ssr-assets',
      enforce: 'post',
      apply: 'serve',
      transform(_code, id, { ssr }) {
        if (ssr && id.endsWith('.css')) {
          const relativeId = path.relative(__dirname, id)
          global.documentxssr.css.push('/' + relativeId)
        }
      },
    },
    {
      name: 'documentx-ssr-build',
      enforce: 'pre',
      apply: 'build',
      config(config, env) {
        if (env.command === 'build' && config.build.ssr) {
          return {
            ...config,
            build: {
              ...config.build,
              rollupOptions: {
                input: {
                  main: path.resolve(__dirname, 'src/main.tsx'),
                },
              },
              emptyOutDir: false,
            },
          }
        }
        return config
      },
    },
  ]
}

export default defineConfig({
  plugins: [plugin()],
})
