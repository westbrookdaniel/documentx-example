import { renderToString } from 'documentx'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

import fetch from 'cross-fetch'
global.fetch = fetch

const isDev = process.env.NODE_ENV === 'dev'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

async function main() {
  const app = new express()

  let vite

  if (isDev) {
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
  }

  if (isDev) {
    app.use(vite.middlewares)
  } else {
    app.use(express.static(__dirname))
  }

  const mainModule = isDev
    ? await vite.ssrLoadModule('/src/main.tsx')
    : await import(path.resolve(__dirname, './main.js'))

  const manifest = isDev ? global.documentxssr : { css: [] }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // send html
      let html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')

      if (isDev) html = await vite.transformIndexHtml(url, html)

      // replace outlet with app
      const { default: App, router } = mainModule

      router.history.replace(url)

      const appHtml = await renderToString({ type: App, props: {} })
      html = html.replace('<!--outlet-->', appHtml.join(''))

      // inject head assets
      html = html.replace(
        '<!--head-->',
        manifest.css
          .map((p) => `<link rel="stylesheet" href="${p}">`)
          .join('\n')
      )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (isDev) vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(3000)
  console.log('Server running on port 3000')
}

main()
