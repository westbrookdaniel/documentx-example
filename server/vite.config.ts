import { PluginOption, defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { render, renderToString } from 'documentx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const documentxPlugin = async (): Promise<PluginOption[]> => {
  return [
    {
      name: 'documentx-ssr-dev',
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            const path = req.originalUrl
            const filename = path === '/' ? '/index' : path
            // read file in src/pages
            const filePath = `${__dirname}/src/pages${filename}.tsx`
            if (!fs.existsSync(filePath)) return next()
            const file = fs.readFileSync(filePath, 'utf-8')
            // render html
            const { default: Component } = await server.ssrLoadModule(filePath)
            const { default: App } = await server.ssrLoadModule(
              `${__dirname}/src/main.tsx`
            )
            const html = renderToString(App({ children: Component({}) }))
            // get index.html
            let template = fs.readFileSync(`${__dirname}/index.html`, 'utf-8')
            template = template.replace('<!--ssr-outlet-->', html)
            // send html
            res.end(template)
          })
        }
      },
    },
  ]
}

export default defineConfig({
  plugins: [documentxPlugin()],
})
