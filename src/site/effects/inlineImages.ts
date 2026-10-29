import { all, isMobileBrowser, ScrollTrigger, SplitText, state, type Cleanup } from './shared'

/**
 * Text with inline images (the "In a world full of noise" statement). With the scroll_fade
 * animation the words and images switch to .visible one by one as the block scrolls through
 * the viewport; the fade itself is the theme's CSS.
 */
function inlineImages(el: HTMLElement): Cleanup {
  const inner = el.querySelector<HTMLElement>('.nectar-text-inline-images__inner')
  if (!inner) return () => {}

  const scrollFade = el.classList.contains('nectar-text-inline-images--animation_scroll_fade')
  const disableOnMobile =
    el.classList.contains('nectar-text-inline-images--rm-mobile-animation') && isMobileBrowser()
  const markers = () => all('.nectar-text-inline-images__marker', el)
  let split: SplitText | null = null
  let nodes: HTMLElement[] = []
  let raf = 0
  let top = 0
  let startScroll = 0

  // Each image gets the width it renders at, so it can grow from 0 to it
  const positionImages = () => {
    split?.revert()
    split = null
    markers().forEach((marker) => {
      const media = marker.querySelector('img, video') as HTMLElement | null
      if (!media) return
      if (media.tagName === 'VIDEO') media.style.width = `${1.7 * marker.offsetHeight}px`
      const width = `${media.getBoundingClientRect().width}px`
      marker.setAttribute('data-calculated-width', width)
      marker.style.width = width
    })
    el.classList.add('nectar-text-inline-images--calculated')
  }

  const setup = () => {
    if (!scrollFade || disableOnMobile) return
    const heading = inner.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6') || inner
    split = new SplitText(heading, { linesClass: 'line', type: 'lines, words', wordsClass: 'word' })
    nodes = all('.word, .nectar-text-inline-images__marker', heading)
    all('[data-calculated-width]', inner).forEach((marker) => {
      marker.classList.add('no-transition')
      marker.style.width = '0'
    })
    window.setTimeout(
      () => all('.no-transition', inner).forEach((n) => n.classList.remove('no-transition')),
      50,
    )
  }

  const measure = () => {
    top = el.getBoundingClientRect().top
    startScroll = window.scrollY
  }

  const frame = () => {
    if (!state.materialOffCanvasOpen) {
      const height = el.getBoundingClientRect().height
      const vh = window.innerHeight
      const y = window.scrollY
      const elementTop = top - (y - startScroll)
      const atTop = y === 0
      let progress = atTop ? 0 : (vh - elementTop - 0.2 * vh) / (vh + height - 0.9 * vh)
      progress = Math.min(Math.max(progress, 0), 1)

      nodes.forEach((node, i) => {
        const visible = progress >= (i + 1) / nodes.length
        const isMarker = node.classList.contains('nectar-text-inline-images__marker')
        if (visible && !node.classList.contains('visible')) {
          if (isMarker) node.style.width = node.getAttribute('data-calculated-width') || ''
          node.classList.add('visible')
        } else if (!visible && node.classList.contains('visible')) {
          node.classList.remove('visible')
          if (isMarker) {
            node.classList.remove('no-transition')
            node.style.width = '0'
          }
        }
      })
    }
    raf = requestAnimationFrame(frame)
  }

  positionImages()
  setup()

  const observer = scrollFade
    ? new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !disableOnMobile) {
            measure()
            if (!raf) raf = requestAnimationFrame(frame)
          } else {
            cancelAnimationFrame(raf)
            raf = 0
          }
        },
        { rootMargin: '400px 0px 400px 0px', threshold: 0 },
      )
    : null
  observer?.observe(el)

  // Each image animates in once fully in view
  const triggers = markers().map((marker) =>
    ScrollTrigger.create({
      once: true,
      onEnter: () => marker.classList.add('animated-in'),
      start: 'bottom bottom',
      trigger: marker,
    }),
  )

  const onResize = () => {
    positionImages()
    setup()
    if (raf) measure()
  }
  window.addEventListener('resize', onResize)

  return () => {
    observer?.disconnect()
    cancelAnimationFrame(raf)
    triggers.forEach((t) => t.kill())
    window.removeEventListener('resize', onResize)
    split?.revert()
  }
}

export function inlineImagesEffect(): Cleanup {
  const cleanups: Cleanup[] = []
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        cleanups.push(inlineImages(entry.target as HTMLElement))
      }),
    { rootMargin: '300px 0px 300px 0px', threshold: 0 },
  )
  all('.nectar-text-inline-images').forEach((el) => observer.observe(el))
  return () => {
    observer.disconnect()
    cleanups.forEach((c) => c())
  }
}
