'use client'

import { useEffect } from 'react'

export type LegacyScript = {
  attributes?: Record<string, string>
  code?: string
  id?: string
  src?: string
  type?: string
}

declare global {
  interface Window {
    __signalScriptsLoaded?: boolean
  }
}

const insert = (script: LegacyScript) =>
  new Promise<void>((resolve) => {
    const el = document.createElement('script')
    if (script.id) el.id = script.id
    if (script.type) el.type = script.type
    Object.entries(script.attributes || {}).forEach(([name, value]) => el.setAttribute(name, value))
    el.async = false

    // The theme's delayed scripts (type="salientlazyscript") are not run by the browser; the
    // theme's own delay script starts them on the first interaction, like on the original site
    const runs = !script.type || script.type === 'text/javascript'
    if (script.src && runs) {
      el.addEventListener('load', () => resolve())
      el.addEventListener('error', () => resolve())
    }
    if (script.src) el.src = script.src
    else el.text = script.code || ''

    document.body.appendChild(el)
    if (!script.src || !runs) resolve()
  })

/**
 * Runs the original Salient scripts once the page has hydrated, one after the other in their
 * original order. They enhance the server-rendered markup the same way they did on the old site.
 */
export function LegacyScripts({ scripts }: { scripts: LegacyScript[] }) {
  useEffect(() => {
    if (window.__signalScriptsLoaded) return
    window.__signalScriptsLoaded = true

    scripts.reduce((previous, script) => previous.then(() => insert(script)), Promise.resolve())
  }, [scripts])

  return null
}
