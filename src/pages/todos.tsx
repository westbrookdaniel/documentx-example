import { render } from 'documentx'
import { Store, ref } from '../util'

type Todo = {
  id: number
  text: string
  done: boolean
}

let id = 4

const initialTodos: Todo[] = [
  { id: 1, text: 'Basic JSX', done: true },
  { id: 1, text: 'Make Router', done: false },
  { id: 2, text: 'Improve Types', done: false },
]

// Store is a simple state for holding state and subscribing to changes
const todos = new Store(initialTodos)

// This is our main todos component
// It's just a function that returns jsx
export default function Todos() {
  // We can use ref to get a reference to the main element
  const el = ref()

  // This will re-render the todos when the state changes
  // You can get the new state from the callback if you want
  // store also has unsub but it's not needed here
  //
  // Manual renders means less overhead, and more fine grained control
  // In this case we're just rerendering all of the todos when the state changes
  //
  // render is async because components can be async!
  // children is also always an array of elements (or text nodes)
  // for making working with fragments easier
  todos.sub(async (_newState) => {
    const children = await render(<TodoItems todos={todos} />)
    el.target.replaceChildren(...children)
  })

  // Just normal html form submission
  function onSubmit(e: any) {
    e.preventDefault()
    const data = new FormData(e.target)
    const text = data.get('todo') as string
    todos.set((s) => {
      // just mutate id, and the state
      s.unshift({ id: id++, text, done: false as boolean })
      return s
    })
    e.target.reset()
  }

  return (
    <div>
      <h1>Todos</h1>
      <form onSubmit={onSubmit}>
        <input type="text" name="todo" />
        <button type="submit">Add</button>
      </form>
      {/* Pass the ref defined above to get a reference to the dom element */}
      <main ref={el}>
        {/* Custom components with props */}
        <TodoItems todos={todos} />
      </main>
    </div>
  )
}

// Props get passed in as usual for jsx
const TodoItems = ({ todos }: { todos: Store<Todo[]> }) => {
  return (
    <ul>
      {/* With the power of jsx we can map over the todos */}
      {todos.state.map((todo) => {
        return (
          <li>
            <input
              type="checkbox"
              checked={todo.done}
              // Subscribe to the change event and mutate the state
              onChange={() => (todo.done = !todo.done)}
            />
            <span>{todo.text}</span>
            <External id={todo.id} />
            <button
              onClick={() => {
                return todos.set((s) => {
                  s.splice(s.indexOf(todo), 1)
                  return s
                })
              }}
            >
              Delete
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const cache = new Map()

/**
 * An async component that fetches data from an external source
 * This will be awaited during render
 */
const External = async ({ id }: { id: number }) => {
  let data = cache.get(id)
  if (!data) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    const d = await res.json()
    cache.set(id, d)
    data = d
  }

  return <span style="margin-left: 4px; color: #777">{data.title}</span>
}
