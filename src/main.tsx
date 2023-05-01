import { render } from 'documentx'
import { Todos } from './todos'

const App = () => {
  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/todos">Todos</a>
      </nav>
      <Todos />
    </div>
  )
}

// render just returns a dom element, so doing this will create our app
document.querySelector('#app')!.replaceChildren(render(<App />))
