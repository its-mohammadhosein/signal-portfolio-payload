import { isMobileBrowser, type Cleanup } from './shared'

/** The theme's first body script: device classes and the --scroll-bar-w variable */
export function device(): Cleanup {
  document.documentElement.classList.remove('no-js')
  const body = document.body

  if (isMobileBrowser()) body.classList.add('using-mobile-browser', 'mobile')
  if (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 2) {
    body.classList.add('using-ios-device')
  }

  if (!('ontouchstart' in window)) {
    const winW = window.innerWidth
    const bodyW = body.clientWidth
    let scrollBar = 0
    if (winW > bodyW + 4) {
      const probe = document.createElement('div')
      probe.style.cssText = 'position:absolute;top:-9999px;width:100vw'
      body.appendChild(probe)
      const vw = probe.offsetWidth
      body.removeChild(probe)
      if (vw > bodyW + 4) scrollBar = winW - bodyW - 4
    }
    body.style.setProperty('--scroll-bar-w', `${scrollBar}px`)
  }

  return () => {}
}
