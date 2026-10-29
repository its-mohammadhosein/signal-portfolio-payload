import { on, state, type Cleanup } from './shared'

const THRESHOLD = 60 // px scrolled before the header starts hiding
const DELTA = 2 // px of movement that counts as a scroll direction

/**
 * <body data-hhun="1">: the header hides while scrolling down and comes back when scrolling up,
 * at the top of the page and at the very bottom. The movement itself is the theme's CSS.
 */
export function header(): Cleanup {
  const el = document.getElementById('header-outer')
  if (!el || document.body.getAttribute('data-hhun') !== '1') return () => {}

  const permanentTransparent = el.getAttribute('data-permanent-transparent') === '1'
  let last = window.scrollY
  let bodyHeight = document.body.offsetHeight
  let raf = 0
  let queued = false

  const heightTimer = window.setInterval(() => {
    if (!state.materialOffCanvasOpen) bodyHeight = document.body.offsetHeight
  }, 1500)

  const frame = () => {
    el.classList.add('detached')
    const y = window.scrollY
    const moved = Math.abs(y - last)
    const toggle = document.querySelector('#header-outer .slide-out-widget-area-toggle a')

    if (
      !state.animatedScrolling &&
      !state.ocmOpen &&
      !state.materialOffCanvasOpen &&
      !el.classList.contains('side-widget-open') &&
      !toggle?.classList.contains('animating')
    ) {
      if (y > THRESHOLD) {
        if (!permanentTransparent && !queued) {
          queued = true
          window.setTimeout(() => {
            if (!state.ocmOpen) {
              el.classList.remove('transparent')
              el.classList.add('scrolling')
            }
            queued = false
          }, 400)
        }
        el.classList.remove('no-transition')
        if (moved >= DELTA) {
          if (y > last) {
            el.classList.add('invisible')
            el.classList.remove('at-top')
          } else {
            el.classList.remove('invisible')
          }
        }
      } else if (y <= 0) {
        el.classList.add('at-top', 'transparent')
        el.classList.remove('invisible', 'scrolling')
        el.style.transform = 'translateY(0)'
      }
      if (window.innerHeight + y + 30 >= bodyHeight) el.classList.remove('invisible')
    }

    last = y
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  const offResize = on(window, 'resize', () => (bodyHeight = document.body.offsetHeight))

  return () => {
    cancelAnimationFrame(raf)
    window.clearInterval(heightTimer)
    offResize()
  }
}
