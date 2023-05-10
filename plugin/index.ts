import type { Plugin, UserConfig, ViteDevServer } from 'vite'
import path from 'node:path'
import url from 'node:url'
import crypto from 'node:crypto'

// dirname for here
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export default function documentxserver(): Plugin[] {
  return [
    exposeDevServer(),
    {
      name: 'documentx-server-resolve',
      enforce: 'pre',
      async resolveId(id) {
        if (id === '/virtual:documentx-handler') {
          return path.resolve(__dirname, 'handler')
        } else if (id === '/virtual:documentx-server') {
          return path.resolve(__dirname, 'entry.mjs').replace(/\\/g, '/')
        }
      },
    },
    {
      name: 'documentx-server',
      enforce: 'post',
      config(config, env) {
        const common: UserConfig = {
          optimizeDeps: {
            // This silences the "could not auto-determine entry point" warning
            include: [],
          },
        }
        if (env.command === 'build' && config.build?.ssr) {
          return {
            ...common,
            build: {
              rollupOptions: {
                input: {
                  index: '/virtual:documentx-server',
                },
              },
            },
          }
        }
        return common
      },

      configureServer(server) {
        server.middlewares.use(async (req, res) => {
          function send(status: number, message: string) {
            res.statusCode = status
            res.end(message)
          }

          // Restore the original URL (SPA middleware may have changed it)
          req.url = req.originalUrl || req.url

          try {
            const handler = (
              await server.ssrLoadModule(path.resolve(__dirname, 'handler'))
            ).default
            await handler(req, res, () => {
              if (!res.writableEnded) send(404, 'Not found')
            })
          } catch (err) {
            if (err instanceof Error) {
              server.ssrFixStacktrace(err)
              send(500, err.stack || err.message)
            } else {
              send(500, 'Unknown error')
            }
          }
        })
      },
    },
  ]
}

function exposeDevServer(): Plugin {
  let dev: boolean
  let viteDevServer: ViteDevServer | undefined
  let globalSymbol: string

  const getModule = () => `export default ${globalSymbol}`

  return {
    name: 'documentx-expose-dev-server',
    enforce: 'pre',

    buildStart() {
      globalSymbol = 'VITE_DEV_SERVER_' + crypto.randomBytes(20).toString('hex')
      ;(global as any)[globalSymbol] = viteDevServer
    },

    closeBundle() {
      delete (global as any)[globalSymbol]
    },

    load(id, options) {
      if (id === '/virtual:vite-dev-server' && dev && options?.ssr) {
        return getModule()
      }
    },

    config(_config, env) {
      dev = env.command === 'serve'
      return {
        optimizeDeps: {
          exclude: ['/virtual:vite-dev-server'],
        },
      }
    },

    configureServer(server) {
      viteDevServer = server
    },
  }
}
