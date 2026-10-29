import { all, ease, gsap, type Cleanup } from './shared'

/**
 * The "minimal" testimonial slider: one quote at a time, prev/next arrows and an "1 / 3"
 * counter, swipe and arrow keys. Slides fade and slide via the theme's CSS; the slider height
 * follows the active quote (450ms easeOutCubic).
 */
function slider(el: HTMLElement): Cleanup {
  const slides = el.querySelector<HTMLElement>('.slides')
  const quotes = all(':scope > blockquote', slides || el)
  if (!slides || el.getAttribute('data-style') !== 'minimal') return () => {}

  gsap.to(el, { duration: 0.8, opacity: 1 })
  quotes.forEach((q) => {
    q.setAttribute('role', 'group')
    q.setAttribute('aria-roledescription', 'slide')
  })
  const live = document.createElement('div')
  live.className = 'screen-reader-text nectar-slide-live'
  live.setAttribute('aria-live', 'polite')
  live.setAttribute('aria-atomic', 'true')
  el.appendChild(live)

  const animateHeight = (index: number) => {
    if (el.classList.contains('disable-height-animation')) return
    gsap.to(slides, {
      duration: 0.45,
      ease: ease.easeOutCubic,
      height: quotes[index].offsetHeight + 40,
    })
  }

  const show = (index: number) => {
    quotes.forEach((q) => {
      q.classList.add('no-trans')
      Object.assign(q.style, { opacity: '0', transform: 'translateX(-25px)', zIndex: '1' })
      q.classList.remove('active')
    })
    const q = quotes[index]
    q.classList.add('active')
    q.classList.remove('no-trans')
    Object.assign(q.style, { opacity: '1', transform: 'translateX(0px)', zIndex: '20' })
    const ul = el.querySelector<HTMLElement>('.control-wrap ul')
    if (ul) ul.style.transform = `translateX(-${20 * index}px)`
    animateHeight(index)
    live.textContent = `${index + 1} / ${quotes.length}`
  }

  if (quotes.length < 2) {
    if (quotes[0])
      Object.assign(quotes[0].style, { opacity: '1', transform: 'translateX(0px)', zIndex: '20' })
    return () => live.remove()
  }

  // Controls the theme adds: numbers, "/ total", and the arrows
  const controls = document.createElement('div')
  controls.className = 'controls'
  controls.innerHTML = `<div class="control-wrap"><ul style="width:${20 * quotes.length + 1}px">${quotes
    .map((_, i) => `<li>${i + 1}</li>`)
    .join('')}</ul></div><span class="out-of">/</span><span class="total">${quotes.length}</span>`
  const arrows = document.createElement('div')
  arrows.className = 'testimonial-next-prev'
  arrows.innerHTML =
    '<a href="#" role="button" aria-label="Previous" class="prev fa fa-angle-left"></a><a href="#" role="button" aria-label="Next" class="next fa fa-angle-right"></a>'
  el.append(controls, arrows)

  let active = 0
  const first = quotes[0]
  first.classList.add('active')
  Object.assign(first.style, { opacity: '1', transform: 'translateX(0px)', zIndex: '20' })
  if (!el.classList.contains('disable-height-animation'))
    slides.style.height = `${first.offsetHeight + 40}px`

  const step = (direction: 1 | -1) => {
    active = (active + direction + quotes.length) % quotes.length
    show(active)
  }
  const onArrow = (event: MouseEvent) => {
    const a = (event.target as HTMLElement).closest('.testimonial-next-prev a')
    if (!a) return
    event.preventDefault()
    step(a.classList.contains('next') ? 1 : -1)
  }
  arrows.addEventListener('click', onArrow)

  el.setAttribute('tabindex', '0')
  const onKey = (event: KeyboardEvent) => {
    if (event.target !== el) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      step(event.key === 'ArrowRight' ? 1 : -1)
    }
  }
  el.addEventListener('keydown', onKey)

  let touchX: number | null = null
  const onTouchStart = (event: TouchEvent) => (touchX = event.touches[0]?.clientX ?? null)
  const onTouchEnd = (event: TouchEvent) => {
    if (touchX === null) return
    const dx = (event.changedTouches[0]?.clientX ?? touchX) - touchX
    if (Math.abs(dx) > 75) step(dx < 0 ? 1 : -1)
    touchX = null
  }
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchend', onTouchEnd)

  const onResize = () => animateHeight(active)
  window.addEventListener('resize', onResize)

  return () => {
    arrows.removeEventListener('click', onArrow)
    el.removeEventListener('keydown', onKey)
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('resize', onResize)
    controls.remove()
    arrows.remove()
    live.remove()
  }
}

export function testimonials(): Cleanup {
  const cleanups = all('.testimonial_slider').map(slider)
  return () => cleanups.forEach((c) => c())
}
