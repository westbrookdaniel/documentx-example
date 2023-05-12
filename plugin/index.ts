import type { Manifest, Plugin, UserConfig, ViteDevServer } from 'vite'
import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

function createDevManifest() {
  // e.g. { "index.html": { file: "src/pages/index.tsx" } }
  // e.g. { "src/pages/index.tsx": { file: "src/pages/index.tsx" } }
  const manifest: Manifest = {}

  fs.readdirSync('./src/pages').forEach((file) => {
    if (file.endsWith('.tsx')) {
      const key = file.replace('.tsx', '')
      manifest[key] = { file: `src/pages/${file}` }
    }
  })

  return manifest
}

export default function documentxserver(): Plugin[] {
  return [
    {
      name: 'documentx-server',
      enforce: 'post',
      config(config, env) {
        const common: UserConfig = config

        if (env.command === 'build') {
          if (config.build?.ssr === 'index.html') {
            // Step 2 build client for server

            return {
              ...common,
              build: {
                ...common.build,
                // not actually an ssr build
                ssr: false,
                outDir: 'dist/server',
                target: 'node16',
                rollupOptions: {
                  treeshake: true,
                  input: {
                    index: 'index.html',
                  },
                },
                emptyOutDir: false,
                manifest: true,
              },
            }
          } else if (config.build?.ssr) {
            // Step 3 build server entry
            return {
              build: {
                ...common.build,
                rollupOptions: {
                  input: { index: path.resolve(__dirname, 'entry') },
                },
                emptyOutDir: false,
              },
              define: {
                ...common.define,
                MANIFEST: fs.readFileSync(
                  './dist/server/manifest.json',
                  'utf-8'
                ),
              },
            }
          } else {
            // Step 1 build client
            return {
              ...common,
              build: {
                ...common.build,
                outDir: 'dist/client',
                manifest: true,
                emptyOutDir: false,
              },
            }
          }
        }
        return {
          ...common,
          define: {
            ...common.define,
            MANIFEST: createDevManifest(),
          },
        }
      },

      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
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
            await handler(req, res, next)
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
