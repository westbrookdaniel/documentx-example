import { render } from 'documentx'
import './style.css'
import { Store } from './util/store'
import { ref } from './util/ref'

const count = new Store(0)

const App = () => {
  let el = ref()

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
