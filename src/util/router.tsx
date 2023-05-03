import { render } from 'documentx'
import { createBrowserHistory } from 'history'
import { hijackLinks } from './hijackLinks'
import { Reference } from './ref'

/**
 * Create a router
 * This router will hijack anchor tags and perform client-side routing
 *
 * @param routes Map of routes to components
 *
 * @example
 * const router = createRouter({
 *  '/': () => <h1>Home</h1>,
 *  '/about': () => <h1>About</h1>,
 *  '/users/:id': () => <h1>User {router.params().id}</h1>,
 *  '404': () => <h1>Not Found</h1>,
 * })
 */
export const createRouter = (routes: Record<string, () => JSX.Element>) => {
  const history = createBrowserHistory()
  hijackLinks(history)

  const router = {
    history,
    /**
     * Get the matching element for the current path
     */
    currentMatch: () => router.match(history.location.pathname),
    /**
     * Get the matching element for a given path
     * Handles 404s and dynamic routes
     */
    match: (path: string) => {
      const foundRoute = Object.keys(routes).find((route) => {
        const routeParts = route.split('/')
        const pathParts = path.split('/')
        if (routeParts.length !== pathParts.length) return false
        return routeParts.every((part, i) => {
          if (part.startsWith(':')) return true
          return part === pathParts[i]
        })
      })
      return {
        component: routes[foundRoute || '404'](),
        params: () => {
          const routeParts = foundRoute!.split('/')
          const pathParts = path.split('/')
          return routeParts.reduce((acc, part, i) => {
            if (part.startsWith(':')) acc[part.slice(1)] = pathParts[i]
            return acc
          }, {} as Record<string, string>)
        },
      }
    },
    /**
     * Get the params for the current route
     */
    params: () => router.currentMatch().params(),
    /**
     * Bind the router to an element
     *
     * @param el The element where the route component will be rendered within
     * @returns The element for the initial route
     */
    bind: (el: Reference | { target: HTMLElement }) => {
      history.listen(() => {
        const route = router.currentMatch()
        el.target.replaceChildren(render(route.component))
      })
      return router.currentMatch().component
    },
  }

  return router
}
