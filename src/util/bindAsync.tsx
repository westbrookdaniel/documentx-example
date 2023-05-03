import { render } from 'documentx'
import { Reference } from './ref'

export const bindAsync = <T,>(
  el: Reference | { target: HTMLElement },
  promise: Promise<T>,
  options: {
    loading: () => JSX.Element
    error: (err: unknown) => JSX.Element
    data: (data: T) => JSX.Element
  }
) => {
  promise
    .then((data) => {
      el.target.replaceChildren(render(options.data(data)))
    })
    .catch((err) => {
      el.target.replaceChildren(render(options.error(err)))
    })
  return render(options.loading())
}
