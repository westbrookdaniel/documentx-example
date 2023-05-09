import { render } from 'documentx'
import { Reference } from './ref'
import { getTarget } from './getTarget'

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
      getTarget(el).replaceChildren?.(render(data))
    })
    .catch((err) => {
      getTarget(el)?.replaceChildren?.(render(options.error(err)))
    })
  return options.loading()
}
