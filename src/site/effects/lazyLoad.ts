import { all, type Cleanup } from './shared'

const load = (el: HTMLElement) => {
  const src = el.getAttribute('data-nectar-img-src')
  if (!src) return

  if (el.classList.contains('nectar-lazy') && el instanceof HTMLImageElement) {
    el.addEventListener(
      'load',
      () => {
        if (!el.classList.contains('keep-calculated-size')) {
          el.style.height = ''
          el.style.width = ''
        }
        el.classList.add('loaded')
        el.removeAttribute('data-nectar-img-src')
      },
      { once: true },
    )
    el.src = src
    const srcset = el.getAttribute('data-nectar-img-srcset')
    if (srcset) {
      el.setAttribute('srcset', srcset)
      el.removeAttribute('data-nectar-img-srcset')
    }
    el.parentElement?.classList.add('img-loaded')
  } else {
    // background images (e.g. the services cards)
    el.style.backgroundImage = `url('${src}')`
    el.classList.add('loaded')
    el.removeAttribute('data-nectar-img-src')
  }
}

const loadVideo = (video: HTMLVideoElement) => {
  video.querySelectorAll('source').forEach((source) => {
    const src = source.getAttribute('data-nectar-video-src')
    if (src) source.src = src
  })
  video.load()
  video.classList.remove('lazy')
  video.classList.add('loaded')
}

/**
 * The theme's lazy loader: images and backgrounds with data-nectar-img-src load 450px before
 * they scroll into view. The images the content trail clones are loaded by the trail itself.
 */
export function lazyLoad(): Cleanup {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (entry.target instanceof HTMLVideoElement) loadVideo(entry.target)
        else load(entry.target as HTMLElement)
      }),
    { rootMargin: '450px' },
  )

  all('[data-nectar-img-src]').forEach((el) => observer.observe(el))
  all<HTMLVideoElement>('video.nectar-lazy-video').forEach((el) => observer.observe(el))

  return () => observer.disconnect()
}

/** Load images that other effects reveal outside the normal flow (e.g. after a slider change) */
export const loadNow = (root: ParentNode) => all('[data-nectar-img-src]', root).forEach(load)
