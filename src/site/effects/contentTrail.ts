import { all, ease, gsap, isMobileBrowser, lerp, state, type Cleanup } from './shared'

type Animation = 'none' | 'scale' | 'fade' | 'circle_mask'

/**
 * Images that follow the cursor across the hero (nectar-content-trail). Every `frequency` px of
 * movement the next image appears at the cursor and animates in then out, as configured.
 */
function trail(el: HTMLElement): Cleanup {
  const references = all<HTMLImageElement>('.nectar-content-trail__list img', el)
  const sources = references.map((img) => img.getAttribute('data-nectar-img-src') || img.src)
  if (!sources.length) return () => {}

  const data = el.dataset
  const durationMs = 1000 * parseFloat(data.duration || '1')
  let threshold = parseFloat(data.frequency || '100')
  let smoothing = Math.max((100 - parseFloat(data.lerp || '70')) / 100, 0.1)
  const randomize = data.randomize === 'true'
  const randomRotation = data.randomizeRotation === 'true'
  const animIn = (data.animationIn || 'none') as Animation
  const animOut = (data.animationOut || 'none') as Animation
  const mobile = isMobileBrowser()
  if (mobile) {
    el.style.pointerEvents = 'none'
    threshold *= 0.6
    smoothing = Math.max(0.8 * smoothing, 0.05)
  }

  let position = 0
  let zIndex = 1
  let interacted = false
  let visible = false
  let running = false
  let raf = 0
  let mouse = { x: 0, y: 0 }
  let last = { x: 0, y: 0 }
  const cache = { x: 0, y: 0 }
  const rendered: HTMLElement[] = []

  const preload = () => sources.forEach((src) => (new Image().src = src))

  const tweenIn = (img: HTMLElement, tl: gsap.core.Timeline, x: number, y: number) => {
    const d = durationMs / 1000
    tl.to(img, { duration: d, ease: ease.easeOutExpo, left: x, top: y }, 0)
    if (animIn === 'scale') {
      tl.fromTo(img, { opacity: 0 }, { duration: 0.3, ease: ease.easeOutCubic, opacity: 1 }, 0)
      tl.fromTo(img, { scale: 0 }, { duration: d, ease: ease.swiftOut, scale: 1 }, 0)
    } else if (animIn === 'fade') {
      tl.fromTo(img, { opacity: 0 }, { duration: 0.4, ease: ease.swiftOut, opacity: 1 }, 0)
    } else if (animIn === 'circle_mask') {
      tl.fromTo(img, { opacity: 0 }, { duration: 0.2, ease: ease.easeOutCubic, opacity: 1 }, 0)
      tl.fromTo(
        img,
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(75% at 50% 50%)', duration: d, ease: ease.swiftOut },
        0,
      )
    } else {
      tl.set(img, { opacity: 1 }, 0)
    }
  }

  const tweenOut = (img: HTMLElement, tl: gsap.core.Timeline) => {
    // the "in" step lasts as long as its longest property: the position tween
    const at = durationMs / 1000
    if (animOut === 'scale') {
      tl.to(
        img,
        {
          delay: Math.max(durationMs - 500, 0) / 1000,
          duration: 0.3,
          ease: ease.easeOutCubic,
          opacity: 0,
        },
        at,
      )
      tl.to(img, { duration: (durationMs - 200) / 1000, ease: ease.easeOutQuart, scale: 0 }, at)
    } else if (animOut === 'fade') {
      tl.to(img, { duration: 0.4, ease: ease.easeOutQuart, opacity: 0 }, at)
    } else if (animOut === 'circle_mask') {
      tl.to(img, { duration: 0.25, ease: 'power2.inOut', opacity: 0 }, at)
    }
  }

  const showNext = () => {
    const reference = references[position]
    const img = document.createElement('img')
    img.className = reference.className
    img.src = sources[position]
    img.alt = ''
    img.style.willChange = 'transform, opacity'
    img.style.position = 'absolute'
    el.appendChild(img)
    rendered.push(img)
    if (rendered.length > 100) rendered.shift()?.remove()

    gsap.set(img, {
      left: cache.x,
      opacity: 0,
      rotation: randomRotation ? 40 * Math.random() - 20 : 0,
      scale: 1,
      top: cache.y,
      transformOrigin: '50% 50%',
      xPercent: -50,
      yPercent: -50,
      zIndex,
    })
    const tl = gsap.timeline({
      onComplete: () => {
        img.remove()
        const i = rendered.indexOf(img)
        if (i !== -1) rendered.splice(i, 1)
      },
    })
    tweenIn(img, tl, mouse.x, mouse.y)
    tweenOut(img, tl)
  }

  const render = () => {
    if (!visible) {
      running = false
      return
    }
    if (!state.materialOffCanvasOpen && !document.hidden) {
      const distance = Math.hypot(last.x - mouse.x, last.y - mouse.y)
      cache.x = lerp(cache.x || mouse.x, mouse.x, smoothing)
      cache.y = lerp(cache.y || mouse.y, mouse.y, smoothing)
      if (distance > threshold) {
        position = randomize
          ? Math.floor(Math.random() * sources.length)
          : position < sources.length - 1
            ? position + 1
            : 0
        showNext()
        zIndex++
        last = { ...mouse }
      }
    }
    raf = requestAnimationFrame(render)
  }

  const start = () => {
    if (visible && interacted && !running) {
      running = true
      raf = requestAnimationFrame(render)
    }
  }

  const onMove = (event: MouseEvent | TouchEvent) => {
    const rect = el.getBoundingClientRect()
    const point = 'touches' in event ? event.touches[0] : event
    if (!point) return
    const x = point.clientX - rect.left
    const y = point.clientY - rect.top
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
    mouse = { x, y }
    if (!interacted) {
      interacted = true
      preload()
    }
    start()
  }
  const onTouchEnd = () => (last = { x: 0, y: 0 })

  window.addEventListener('mousemove', onMove, { passive: true })
  if (mobile) {
    window.addEventListener('touchstart', onMove, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    },
    { threshold: 0 },
  )
  observer.observe(el)

  return () => {
    observer.disconnect()
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('touchstart', onMove)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onTouchEnd)
    rendered.forEach((img) => {
      gsap.killTweensOf(img)
      img.remove()
    })
  }
}

export function contentTrail(): Cleanup {
  const cleanups = all('.nectar-content-trail').map(trail)
  return () => cleanups.forEach((c) => c())
}
