import { render } from 'documentx'
import { Todos } from './todos'
import { hijackLinks } from './util/hijackLinks'
import { createBrowserHistory } from 'history'
import { ref } from './util'
import { UserPage } from './user'

const routes = {
  '/': () => <h1>Home</h1>,
  '/todos': () => <Todos />,
  '/users/:id': () => <UserPage />,
}

const NotFound = () => <h1>Not Found</h1>

const App = () => {
  const el = ref()

  const history = createBrowserHistory()
  hijackLinks(history)

  const getRouteElement = () => {
    const path = history.location.pathname
    const Route = routes[path as keyof typeof routes] || NotFound
    return <Route />
  }

  history.listen(() => {
    const route = getRouteElement()
    el.target.replaceChildren(render(route))
  })

  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/todos">Todos</a>
        <a href="/foo">Other</a>
      </nav>
      <div ref={el}>{getRouteElement()}</div>
    </div>
  )
}

// render just returns a dom element, so doing this will create our app
document.querySelector('#app')!.replaceChildren(render(<App />))
