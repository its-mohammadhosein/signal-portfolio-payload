import { all, defaultDuration, ease, gsap, ScrollTrigger, type Cleanup } from './shared'

/** Distance each column entrance travels, as in the theme */
const COLUMN_OFFSETS: Record<string, { x?: number; y?: number }> = {
  'fade-in-from-bottom': { y: 100 },
  'slight-fade-in-from-bottom': { y: 50 },
  'fade-in-from-top': { y: -100 },
  'fade-in-from-left': { x: -45 },
  'fade-in-from-right': { x: 45 },
}

/**
 * Split headings (the hero's letter reveal, the footer wordmark) and column entrances
 * (data-animation on .wpb_column), triggered where the theme's waypoints were.
 */
export function reveals(): Cleanup {
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  // -- split headings
  all('.nectar-split-heading:not(.custom-trigger)').forEach((el) => {
    const delay = parseInt(el.getAttribute('data-animation-delay') || '0', 10) / 1000
    const offset = el.getAttribute('data-animation-offset')
    // the theme's waypoint: "bottom-in-view" by default, or a % offset from the top
    const start = offset ? `top ${parseInt(offset, 10)}%` : 'bottom bottom'
    const letters = all<HTMLElement>(':scope > * > span span', el)
    const letterReveal = (el.getAttribute('data-text-effect') || '').includes('letter-reveal')

    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          if (letterReveal && letters.length) {
            const stagger = Math.min(Math.max(400 / letters.length, 20), 35) / 1000
            tweens.push(
              gsap.to(letters, {
                delay,
                duration: 1.2,
                ease: ease.letterReveal,
                stagger,
                y: '0em',
              }),
            )
          }
          window.setTimeout(() => el.classList.add('animated-in'), delay * 1000)
        },
      }),
    )
  })

  // -- column entrances
  const duration = defaultDuration()
  all(
    '.col.has-animation:not([data-animation*="reveal"]), .wpb_column.has-animation:not([data-animation*="reveal"])',
  ).forEach((el) => {
    const offset = COLUMN_OFFSETS[el.getAttribute('data-animation') || '']
    if (!offset) return
    const delay = parseInt(el.getAttribute('data-delay') || '0', 10) / 1000
    gsap.set(el, { opacity: 0, x: offset.x || 0, y: offset.y || 0 })

    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: el.getAttribute('data-animation-offset')
          ? `top ${parseInt(el.getAttribute('data-animation-offset')!, 10)}%`
          : 'top 88%',
        once: true,
        onEnter: () => {
          el.classList.add('triggered-animation')
          tweens.push(
            gsap.to(el, {
              delay,
              duration,
              ease: ease.easeOutCubic,
              onComplete: () => el.classList.add('animated-in'),
              opacity: 1,
              x: 0,
              y: 0,
            }),
          )
        },
      }),
    )
  })

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
  }
}
