import './style.css'
import { render } from 'documentx'
import { ref, createRouter, lazy } from './util'

export const router = createRouter({
  '/': lazy(() => import('./pages')),
  '/todos': lazy(() => import('./pages/todos')),
  '/users/:id': lazy(() => import('./pages/user')),
  '404': lazy(() => import('./pages/404')),
})

export default function App() {
  const el = ref()
  const initalEl = router.bind(el, {
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
      <div ref={el}>{initalEl}</div>
    </div>
  )
}

if (typeof document !== 'undefined') {
  /**
   * Things TODO:
   *
   * 1. Async components (Suspense)
   * 2. Error boundaries
   * 3. SSR
   * 4. Hydration
   */
  render(<App />).then((children) => {
    document.querySelector('#app')!.replaceChildren(...children)
  })
}
