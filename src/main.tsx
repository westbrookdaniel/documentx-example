import './style.css'
import { render } from 'documentx'
import { Store, ref } from './util'

const count = new Store(0)

const App = () => {
  const el = ref()

  count.sub((s) => {
    el.target.innerText = `Count ${s}`
  })

  return (
    <div>
      <h1 ref={el}>Count {count.state}</h1>
      <button onClick={() => count.set((s) => s - 1)}>-</button>
      <button onClick={() => count.set((s) => s + 1)}>+</button>
    </div>
  )
}

document.querySelector('#app')!.replaceChildren(render(<App />))
