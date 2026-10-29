import { ease, gsap, state, type Cleanup } from './shared'

/**
 * <body data-animated-anchors="true">: links to a section of the current page scroll there,
 * 1.3s plus 0.3s per 1000px (at most 1.5s more), easeInOutQuint, like the theme.
 */
export function anchors(): Cleanup {
  if (document.body.getAttribute('data-animated-anchors') !== 'true') return () => {}

  const scrollTo = (target: HTMLElement) => {
    const y = target.getBoundingClientRect().top + window.scrollY + 1
    const distance = Math.abs(window.scrollY - y)
    const duration = (1300 + Math.min(300 * Math.floor(distance / 1000), 1500)) / 1000

    state.animatedScrolling = true
    document.body.classList.add('animated-scrolling')
    gsap.to(window, {
      duration,
      ease: ease.easeInOutQuint,
      onComplete: () => {
        state.animatedScrolling = false
        document.body.classList.remove('animated-scrolling')
      },
      scrollTo: { autoKill: false, y },
    })
  }

  const onClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]')
    if (!link || link.getAttribute('href') === '#' || link.closest('.slide-out-widget-area-toggle'))
      return
    if (link.pathname !== window.location.pathname || link.host !== window.location.host) return
    if (link.matches('[data-filter], .testimonial-next-prev a, .nectar_video_lightbox')) return

    const id = decodeURIComponent(link.hash.slice(1))
    const target = id && document.getElementById(id)
    if (!target) return

    event.preventDefault()
    // let the off-canvas menu start closing first
    window.setTimeout(() => scrollTo(target), state.ocmOpen ? 50 : 0)
    history.replaceState(null, '', `#${id}`)
  }

  document.addEventListener('click', onClick)

  // Arriving with a hash (e.g. /#services from another page): scroll once laid out
  const initial = window.location.hash.slice(1)
  const timer = initial
    ? window.setTimeout(() => {
        const target = document.getElementById(decodeURIComponent(initial))
        if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY + 1)
      }, 100)
    : 0

  return () => {
    document.removeEventListener('click', onClick)
    window.clearTimeout(timer)
  }
}
