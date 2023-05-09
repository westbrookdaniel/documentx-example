export type Reference = {
  target: HTMLElement
  (el: HTMLElement): void
}

export const ref = () => {
  const r: any = (el: HTMLElement) => (r.target = el)
  return r as Reference
}
