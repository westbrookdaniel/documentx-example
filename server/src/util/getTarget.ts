import { Reference } from '.'

/**
 * Safely get the target during ssr
 */
export const getTarget = (
  e: Reference | { target: HTMLElement }
): Partial<HTMLElement> => {
  if (typeof document === 'undefined') return {}
  if (!('target' in e))
    throw new Error(
      'Invalid reference, maybe you tried to use it before the initial render?'
    )
  return e.target
}
