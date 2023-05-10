import { IncomingMessage, ServerResponse } from 'http'
import { Connect, ViteDevServer } from 'vite'
import { renderToString } from 'documentx'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// @ts-expect-error
import _server from '/virtual:vite-dev-server'
const server = _server as ViteDevServer

export default async function handler(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction
) {
  const path = req.originalUrl
  const filename = path === '/' ? '/index' : path

  // Load root
  const { default: App } = await server.ssrLoadModule(`src/main.tsx`)

  // get path to file in src/pages
  const filePath = `src/pages${filename}.tsx`

  let html: string

  if (!fs.existsSync(filePath)) {
    // render 404 html
    const notFoundPath = `src/pages/404.tsx`
    if (!fs.existsSync(notFoundPath)) next()
    const { default: NotFound } = await server.ssrLoadModule(notFoundPath)
    html = renderToString(App({ children: NotFound({}) }))
  } else {
    // render html
    const { default: Component } = await server.ssrLoadModule(filePath)
    html = renderToString(App({ children: Component({}) }))
  }

  // get index.html
  let template = fs.readFileSync(`index.html`, 'utf-8')
  template = template.replace('<!--ssr-outlet-->', html)

  // send html
  res.end(template)
}
