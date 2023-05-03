import { render } from 'documentx'
import { Reference } from './ref'

export const renderAsync = (
  el: Reference | { target: HTMLElement },
  options: {
    loading: () => JSX.Element
    error: (err: unknown) => JSX.Element
    data: () => Promise<JSX.Element>
  }
) => {
  options
    .data()
    .then((data) => {
      if (!('target' in el)) throw new Error('Invalid reference')
      el.target.replaceChildren(render(data))
    })
    .catch((err) => {
      if (!('target' in el)) throw new Error('Invalid reference')
      el.target.replaceChildren(render(options.error(err)))
    })
  return options.loading()
}
