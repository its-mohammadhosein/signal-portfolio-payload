'use client'

import { useEffect } from 'react'

/**
 * Starts the page's animations and interactions (src/site/effects) once it has hydrated.
 * Loaded on demand: Flickity and fitty expect a browser, so the effects never run on the server.
 */
export function SignalEffects() {
  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false
    import('../effects').then(({ startEffects }) => {
      if (!cancelled) cleanup = startEffects()
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return null
}
