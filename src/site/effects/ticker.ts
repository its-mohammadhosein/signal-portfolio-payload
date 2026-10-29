import Flickity from 'flickity'

import { all, isMobileBrowser, on, type Cleanup } from './shared'

/** Flickity internals the theme's ticker drives directly */
type FlickityInternals = Flickity & {
  dragEndRestingSelect: () => number
  selectedIndex: number
  settle: (x: number) => void
  slider: HTMLElement
  slideableWidth: number
  slides: unknown[]
  x: number
}

const SPEEDS: Record<string, number> = { fast: 2, medium: 1.2, slow: 0.5 }

/** The theme gives carousel cells the height of the tallest one */
const equalHeights = (el: HTMLElement) => {
  const cells = all('.flickity-slider > .cell', el)
  cells.forEach((cell) => (cell.style.height = 'auto'))
  const tallest = Math.max(0, ...cells.map((cell) => cell.offsetHeight))
  cells.forEach((cell) => (cell.style.height = tallest < 10 ? 'auto' : `${tallest}px`))
}

/**
 * .nectar-flickity carousels; with .ticker-rotate (the services row) the slider glides on its
 * own, pausing on hover and while dragged, as in the theme's tickerRotate.
 */
function carousel(el: HTMLElement): Cleanup {
  // The server markup already has Flickity's wrappers; Flickity builds its own
  const viewport = el.querySelector(':scope > .flickity-viewport')
  const slider = viewport?.querySelector(':scope > .flickity-slider')
  if (viewport && slider) {
    Array.from(slider.children).forEach((cell) => el.appendChild(cell))
    viewport.remove()
  }

  const ticker = el.classList.contains('ticker-rotate')
  const controls = el.getAttribute('data-controls') || ''
  const reverse = el.getAttribute('data-ticker-direction') === 'reverse'
  const speed = (SPEEDS[el.getAttribute('data-ticker-speed') || 'slow'] || 0.5) * (reverse ? -1 : 1)
  const centered = el.getAttribute('data-centered-cells') === 'true'

  const flkty = new Flickity(el, {
    accessibility: false,
    adaptiveHeight: el.getAttribute('data-adaptive-height') === 'true',
    autoPlay: false,
    cellAlign: 'center',
    contain: true,
    draggable: true,
    dragThreshold: isMobileBrowser() ? 25 : 3,
    groupCells: !centered && !ticker,
    imagesLoaded: true,
    pageDots: !ticker && controls !== 'none' && !controls.startsWith('next_prev'),
    pauseAutoPlayOnHover: el.getAttribute('data-pause-on-hover') === 'true',
    percentPosition: true,
    prevNextButtons: controls.startsWith('next_prev'),
    resize: true,
    selectedAttraction: 0.025,
    setGallerySize: true,
    wrapAround: ticker || el.getAttribute('data-wrap') !== 'no-wrap',
  } as Flickity.Options & Record<string, unknown>) as FlickityInternals

  const cells = all(':scope > .flickity-viewport > .flickity-slider > *', el)
  cells.forEach((cell, i) => {
    cell.setAttribute('role', 'group')
    cell.setAttribute('aria-roledescription', 'slide')
    cell.setAttribute('aria-label', `${i + 1} / ${cells.length}`)
  })

  const timers: number[] = []
  flkty.on('dragStart', () => {
    timers.forEach((t) => window.clearTimeout(t))
    el.classList.add('is-dragging', 'is-moving')
  })
  flkty.on('dragEnd', () => {
    el.classList.remove('is-dragging')
    timers.push(window.setTimeout(() => el.classList.remove('is-moving'), 300))
  })
  if (
    el.classList.contains('nectar-carousel') &&
    el.getAttribute('data-adaptive-height') !== 'true'
  ) {
    flkty.on('ready', () => equalHeights(el))
    window.setTimeout(() => equalHeights(el), 300)
  }
  const offResize = on(window, 'resize', () => equalHeights(el))
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0')

  // -- ticker
  let raf = 0
  let paused = false
  let inView = false
  let lastTs: number | null = null
  let fpsBase = 0
  let calibrate: { duration: number; frames: number } | null = { duration: 0, frames: 0 }

  const rotate = (ts?: number) => {
    if (paused || !inView) {
      flkty.slider.style.willChange = ''
      raf = 0
      return
    }
    const now = typeof ts === 'number' ? ts : performance.now()
    if (!lastTs) lastTs = now
    let dt = (now - lastTs) / 1000
    if (dt <= 0 || dt > 0.25) dt = 1 / 60
    lastTs = now
    if (!fpsBase && calibrate) {
      calibrate.frames++
      calibrate.duration += dt
      if (calibrate.frames >= 12) {
        fpsBase = Math.max(50, Math.min(144, Math.round(calibrate.frames / calibrate.duration)))
        calibrate = null
      }
    }
    flkty.slider.style.willChange = 'transform'
    if (flkty.slides) {
      const step = speed * ((fpsBase || 60) * dt)
      flkty.x = (flkty.x - step) % flkty.slideableWidth
      flkty.selectedIndex = flkty.dragEndRestingSelect()
      flkty.settle(flkty.x)
    }
    raf = requestAnimationFrame(rotate)
  }
  const resume = () => {
    if (ticker && inView && !paused && !raf) rotate()
  }

  let observer: IntersectionObserver | null = null
  const listeners: Cleanup[] = []
  if (ticker) {
    observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) resume()
        else {
          flkty.slider.style.willChange = ''
          cancelAnimationFrame(raf)
          raf = 0
          lastTs = null
        }
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 },
    )
    observer.observe(el)
    flkty.on('dragStart', () => (paused = true))
    const leave = () => {
      paused = false
      resume()
    }
    el.addEventListener('mouseleave', leave)
    listeners.push(() => el.removeEventListener('mouseleave', leave))
    if (el.getAttribute('data-pause-on-hover') === 'true') {
      const enter = () => {
        paused = true
        cancelAnimationFrame(raf)
        raf = 0
        lastTs = null
      }
      el.addEventListener('mouseenter', enter)
      listeners.push(() => el.removeEventListener('mouseenter', enter))
    }
  }

  return () => {
    observer?.disconnect()
    cancelAnimationFrame(raf)
    listeners.forEach((l) => l())
    offResize()
    timers.forEach((t) => window.clearTimeout(t))
    flkty.destroy()
  }
}

export function ticker(): Cleanup {
  const cleanups: Cleanup[] = []
  // Like the theme, a carousel is only built when it comes near the viewport
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        cleanups.push(carousel(entry.target as HTMLElement))
      }),
    { rootMargin: '350px 0px 350px 0px', threshold: 0 },
  )
  all('.nectar-flickity:not(.masonry)').forEach((el) => observer.observe(el))

  return () => {
    observer.disconnect()
    cleanups.forEach((c) => c())
  }
}
