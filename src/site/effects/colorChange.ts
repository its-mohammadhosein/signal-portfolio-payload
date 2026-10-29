import { all, on, type Cleanup } from './shared'

const MIN_VISIBLE = 0.4
const DESCENDANT_VISIBLE = 0.05

/**
 * The page background follows the section in view (data-color-change-section-bg-color), as in the
 * theme's nectar-color-change-bg script. The colour itself transitions in CSS.
 */
export function colorChange(): Cleanup {
  let sections = all(
    'div[data-color-change-section-bg-color], section[data-color-change-section-bg-color]',
  )
  if (!sections.length) return () => {}

  const root = document.documentElement
  let current: HTMLElement | null = null
  let direction: 'down' | 'up' = 'down'
  let lastY = window.scrollY
  let raf = 0

  // Sections inside the global (footer) section need the page colours on the content wrapper
  if (sections.some((s) => s.closest('.nectar-global-section'))) {
    const wrap = document.querySelector<HTMLElement>('.container-wrap')
    const styles = getComputedStyle(root)
    const bg = styles.getPropertyValue('--nectar-bg-color').trim()
    const fg = styles.getPropertyValue('--nectar-font-color').trim()
    if (wrap && bg && fg) {
      wrap.setAttribute('data-color-change-section-bg-color', bg)
      wrap.setAttribute('data-color-change-section-text-color', fg)
      if (!sections.includes(wrap)) sections = [...sections, wrap]
    }
  }

  const visibility = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
    return rect.height > vh ? visible / vh : visible / rect.height
  }
  const inViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    return Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0) > 0
  }
  const hasVisibleDescendant = (el: HTMLElement) =>
    sections.some(
      (s) => s !== el && el.contains(s) && inViewport(s) && visibility(s) > DESCENDANT_VISIBLE,
    )
  const hasDescendant = (el: HTMLElement) => sections.some((s) => s !== el && el.contains(s))
  const shouldConsider = (el: HTMLElement) => {
    if (!current || current.classList.contains('container-wrap')) return true
    const a = current.getBoundingClientRect()
    const b = el.getBoundingClientRect()
    return direction === 'down' ? b.top >= a.top : b.top <= a.top
  }

  const apply = (el: HTMLElement) => {
    const bg = el.getAttribute('data-color-change-section-bg-color') || ''
    const fg = el.getAttribute('data-color-change-section-text-color') || ''
    root.style.setProperty('--nectar-page-background-color', bg)
    root.style.setProperty('--nectar-page-text-color', fg)
    root.style.setProperty('--nectar-page-light-text-color', fg)
    current = el
  }

  const nearest = () => {
    const middle = window.scrollY + window.innerHeight / 2
    let best: HTMLElement | null = null
    let bestDistance = Infinity
    for (const el of sections) {
      if (hasDescendant(el)) continue
      const rect = el.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const bottom = top + rect.height
      const distance = middle < top ? top - middle : middle > bottom ? middle - bottom : 0
      if (distance < bestDistance) {
        bestDistance = distance
        best = el
      } else if (
        distance === bestDistance &&
        best &&
        best.getBoundingClientRect().top + window.scrollY < middle &&
        top >= middle
      ) {
        best = el
      }
    }
    return best
  }

  const rescan = () => {
    raf = 0
    let chosen: HTMLElement | null = null
    let chosenVisibility = 0
    let mostVisible: HTMLElement | null = null
    let mostVisibility = 0
    let anyInView = false

    for (const el of sections) {
      if (!inViewport(el)) continue
      anyInView = true
      if (hasVisibleDescendant(el)) continue
      const v = visibility(el)
      if (v > mostVisibility) {
        mostVisibility = v
        mostVisible = el
      }
      if (v >= MIN_VISIBLE && v > chosenVisibility && shouldConsider(el)) {
        chosen = el
        chosenVisibility = v
      }
    }

    if (chosen && chosen !== current) apply(chosen)
    if (!chosen && !current && mostVisible) apply(mostVisible)
    if (!chosen && !current && !anyInView) {
      const el = nearest()
      if (el) apply(el)
    }
  }

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(rescan)
  }
  const onScroll = () => {
    const y = window.scrollY
    if (Math.abs(y - lastY) > 5) {
      direction = y > lastY ? 'down' : 'up'
      lastY = y
    }
    schedule()
  }

  root.style.setProperty('--page-color-change-section-transition-time', '0s')
  const observer = new IntersectionObserver(onScroll, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  })
  sections.forEach((s) => observer.observe(s))
  schedule()

  // The sections' own backgrounds give way to the page colour, which then starts transitioning
  const t1 = window.setTimeout(() => {
    sections.forEach((el) => {
      if (el.classList.contains('container-wrap')) return
      el.style.backgroundColor = 'transparent'
      const bg = el.querySelector<HTMLElement>('.row-bg.using-bg-color')
      if (bg) bg.style.backgroundColor = 'transparent'
    })
  }, 60)
  const t2 = window.setTimeout(() => {
    root.style.setProperty('--page-color-change-section-transition-time', '0.8s')
    document.body.classList.add('has-color-change-section-bg-color')
  }, 100)

  let resizeTimer = 0
  const offScroll = on(window, 'scroll', onScroll, { passive: true })
  const offResize = on(
    window,
    'resize',
    () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(schedule, 120)
    },
    { passive: true },
  )

  return () => {
    observer.disconnect()
    offScroll()
    offResize()
    cancelAnimationFrame(raf)
    window.clearTimeout(t1)
    window.clearTimeout(t2)
    window.clearTimeout(resizeTimer)
  }
}
