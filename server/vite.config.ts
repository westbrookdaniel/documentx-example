import { PluginOption, defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { renderToString } from 'documentx'
import * as vite from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function ensureExists(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
  return path
}

const documentxPlugin = async (): Promise<PluginOption[]> => {
  return [
    {
      name: 'documentx-ssr-dev',
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            const path = req.originalUrl
            const filename = path === '/' ? '/index' : path

            // Load root
            const { default: App } = await server.ssrLoadModule(
              `${__dirname}/src/main.tsx`
            )

            // get path to file in src/pages
            const filePath = `${__dirname}/src/pages${filename}.tsx`

            let html: string

            if (!fs.existsSync(filePath)) {
              // render 404 html
              const notFoundPath = `${__dirname}/src/pages/404.tsx`
              if (!fs.existsSync(notFoundPath)) next()
              const { default: NotFound } = await server.ssrLoadModule(
                notFoundPath
              )
              html = renderToString(App({ children: NotFound({}) }))
            } else {
              // render html
              const { default: Component } = await server.ssrLoadModule(
                filePath
              )
              html = renderToString(App({ children: Component({}) }))
            }

            // get index.html
            let template = fs.readFileSync(`${__dirname}/index.html`, 'utf-8')
            template = template.replace('<!--ssr-outlet-->', html)

            // send html
            res.end(template)
          })
        }
      },
      config(config) {
        return {
          ...config,
          build: {
            ...config.build,
            outDir: ensureExists(
              path.join(path.resolve(__dirname, 'dist'), 'client')
            ),
          },
        }
      },
      writeBundle: {
        sequential: true,
        handler() {
          // prerender inner html for each route into dist/prerendered
          // and create simple file server
          // that replaces <!--ssr-outlet--> in dist/client/index.html with prerendered html
          // add that node server into the root of dist to be deployed
        },
      },
    },
  ]
}

export default defineConfig({
  plugins: [documentxPlugin()],
})
