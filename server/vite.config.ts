import { PluginOption, defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { render, renderToString } from 'documentx'
import { createServer } from 'vite'

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
      async buildEnd() {
        // create vite server for transforming files
        // TODO: Try use build instead
        const vite = await createServer({
          server: { middlewareMode: true },
          appType: 'custom',
        })

        // Prerender html from files in src/pages
        const pagesDir = path.join(__dirname, 'src', 'pages')
        const files = fs.readdirSync(pagesDir)

        // Load root
        const { default: App } = await vite.ssrLoadModule(
          `${__dirname}/src/main.tsx`
        )

        // Render to prerendered folder
        // TODO: This won't work because of script tags
        await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(pagesDir, file)
            const { default: Component } = await vite.ssrLoadModule(filePath)
            const html = renderToString(App({ children: Component({}) }))

            let template = fs.readFileSync(`${__dirname}/index.html`, 'utf-8')
            template = template.replace('<!--ssr-outlet-->', html)

            const filename =
              file === 'index.tsx' ? 'index' : file.replace('.tsx', '')

            ensureExists(path.join(__dirname, 'dist', 'prerendered'))

            fs.writeFileSync(
              path.join(__dirname, 'dist', 'prerendered', `${filename}.html`),
              template
            )
          })
        )

        await vite.close()
        // Do a second build to create the server
        // const serverDir = path.join(__dirname, 'dist', 'server')
        // await vite.build({
        //   ssr: {},
        // })
      },
    },
  ]
}

export default defineConfig({
  plugins: [documentxPlugin()],
})
