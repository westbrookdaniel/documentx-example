export class Store<T> {
  private subs: ((s: T) => void)[] = []

  state: T

  constructor(state: T) {
    this.state = state
  }

  sub(fn: (s: T) => void) {
    this.subs.push(fn)
  }

  unsub(fn: (s: T) => void) {
    this.subs = this.subs.filter((f) => f !== fn)
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
