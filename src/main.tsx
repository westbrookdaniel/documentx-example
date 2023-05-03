import { render } from 'documentx'
import { ref, createRouter } from './util'
import { Todos } from './todos'
import { UserPage } from './user'

export const router = createRouter({
  '/': () => (
    <div>
      <h1>Home</h1>
      <p>Click on the links above to navigate</p>
      <a href={`/users/${Math.floor(Math.random() * 10) + 1}`}>Random User</a>
    </div>
  ),
  '/todos': () => <Todos />,
  '/users/:id': () => <UserPage />,
  '404': () => <h1>Not Found</h1>,
})

const App = () => {
  const el = ref()
  const initialRoute = router.bind(el)

  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/todos">Todos</a>
        <a href="/foo">Other</a>
      </nav>
      <div ref={el}>{initialRoute}</div>
    </div>
  )
}

// render just returns a dom element, so doing this will create our app
document.querySelector('#app')!.replaceChildren(render(<App />))
