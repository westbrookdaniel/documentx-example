import { renderToString } from 'documentx'
import fs from 'node:fs'
import path from 'node:path'
import { Request, Response, NextFunction } from 'express'
import type { Manifest } from 'vite'

/**
 * Map from route path to file path
 *
 * e.g. { '/': 'src/pages/index.tsx' }
 * e.g. { '/user/:id': 'src/pages/user/:id.tsx' }
 *
 * Also contains special keys:
 * - _main: path to root (main) file
 * - _404: path to 404 file
 * - _html: path to index.html
 */
function createRouteManifest(manifest: Manifest) {
  const routeManifest: Record<string, string> = {}

  // Server runs files from ./server, cilent should run files from ./client
  const serverDir = './server/'
  routeManifest['_html'] = './client/index.html'

  for (const key in manifest) {
    const value = serverDir + manifest[key].file

    if (key === 'index.html') {
      routeManifest['_main'] = value
    } else if (key === 'src/pages/404.tsx') {
      routeManifest['_404'] = value
    } else if (key.startsWith('src/pages')) {
      let routeKey = key.replace('src/pages', '').replace('.tsx', '')
      if (routeKey.endsWith('/index')) routeKey = routeKey.replace('/index', '')
      if (routeKey === '') routeKey = '/'
      routeManifest[routeKey] = value
    }
  }

  return routeManifest
}

declare const MANIFEST: Manifest
const routeManifest = createRouteManifest(MANIFEST)

export default async function handler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const routePath = findRoutePath(routeManifest, req.originalUrl)

  // Load root (main)
  const { default: App } = await import(routeManifest['_main'])

  // get path to file in src/pages
  const filePath = path.resolve(__dirname, routeManifest[routePath])

  let html: string

  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(routeManifest['_404'])) next()
    const { default: NotFound } = await import(routeManifest['_404'])
    html = renderToString(App({ children: NotFound({}) }))
  } else {
    // render html
    const { default: Component } = await import(filePath)
    html = renderToString(App({ children: Component({}) }))
  }

  // get index.html
  let template = fs.readFileSync(routeManifest['_html'], 'utf-8')
  template = template.replace('<!--ssr-outlet-->', html)

  // send html
  res.end(template)
}

/**
 * Find best matching key in manfest object based on url
 * e.g. / -> /
 * e.g. /foo -> /foo
 * e.g. /user/4 -> /user/:id
 */
function findRoutePath(mainfest: Record<string, string>, url: string) {
  const keys = Object.keys(mainfest)
  const routePaths = keys.filter((key) => key.startsWith('/'))

  let bestMatch = ''
  let bestMatchScore = 0

  for (const routePath of routePaths) {
    const score = scoreRoutePath(routePath, url)
    if (score > bestMatchScore) {
      bestMatch = routePath
      bestMatchScore = score
    }
  }

  return bestMatch
}

/**
 * Score route path based on url
 */
function scoreRoutePath(routePath: string, url: string): number {
  const routePathParts = routePath.split('/')
  const urlParts = url.split('/')
  let score = 0
  for (let i = 0; i < routePathParts.length; i++) {
    const routePathPart = routePathParts[i]
    const urlPart = urlParts[i]

    if (routePathPart === urlPart) {
      score += 2
    } else if (routePathPart.startsWith(':')) {
      score += 1
    } else {
      return 0
    }
  }
  return score
}
