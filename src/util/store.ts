export class Store<T> {
  private subs: ((s: T) => void)[] = []

  state: T

  constructor(state: T) {
    this.state = state
  }

  sub(fn: (s: T) => void) {
    this.subs.push(fn)
  }

  set(state: T | ((s: T) => T)) {
    if (typeof state === 'function') {
      this.state = (state as any)(this.state)
    } else {
      this.state = state
    }
    this.subs.forEach((fn) => fn(this.state))
  }
}
