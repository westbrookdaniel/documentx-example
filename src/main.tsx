import { render } from 'documentx'
import { ref, createRouter, lazy } from './util'

export const router = createRouter({
  '/': lazy(() => import('./pages')),
  '/todos': lazy(() => import('./pages/todos')),
  '/users/:id': lazy(() => import('./pages/user')),
  '404': lazy(() => import('./pages/404')),
})

type InjectedProps = {
  children?: JSX.Element
}

export default function App({ children }: InjectedProps) {
  const el = ref()

  router.bind(el, {
    loading: () => <h1>Loading...</h1>,
    error: (err) => <h1>Error: {err}</h1>,
  })

  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/todos">Todos</a>
        <a href="/foo">Other</a>
      </nav>
      <div ref={el}>{children}</div>
    </div>
  )
}

if (typeof document !== 'undefined') {
  /**
   * Things TODO:
   *
   * 1. SSR
   * 2. Hydration
   * 3. Async components (Suspense)
   * 4. Error boundaries
   *
   */
  document.querySelector('#app')!.replaceChildren(render(<App />))
}
