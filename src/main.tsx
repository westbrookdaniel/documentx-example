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

render(<App />).then((children) => {
  document.querySelector('#app')!.replaceChildren(...children)
})
