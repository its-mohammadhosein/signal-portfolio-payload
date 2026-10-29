import { all, gsap, isMobileBrowser, lerp, ScrollTrigger, type Cleanup } from './shared'

/** Filter tabs: the theme asked WordPress for the filtered grid; the items are all rendered, so filter them */
function filters(wrap: HTMLElement): Cleanup {
  const onClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      '.nectar-post-grid-filters a[data-filter]',
    )
    if (!link || !wrap.contains(link)) return
    event.preventDefault()
    if (link.classList.contains('active')) return

    all('.nectar-post-grid-filters a', wrap).forEach((a) =>
      a.classList.toggle('active', a === link),
    )
    const filter = link.getAttribute('data-filter')
    wrap.classList.add('loading')
    window.setTimeout(() => {
      all('.nectar-post-grid-item', wrap).forEach((item) => {
        const categories = (item.getAttribute('data-signal-categories') || '').split(' ')
        item.style.display = filter === '-1' || categories.includes(filter || '') ? '' : 'none'
      })
      wrap.classList.remove('loading')
      ScrollTrigger.refresh()
    }, 350)
  }
  wrap.addEventListener('click', onClick)
  return () => wrap.removeEventListener('click', onClick)
}

/** Grids with data-animation: filters and items animate in, items 90ms apart */
function entrance(wrap: HTMLElement): Cleanup {
  const grid = wrap.querySelector<HTMLElement>('.nectar-post-grid')
  if (!grid || (grid.getAttribute('data-animation') || 'none') === 'none') return () => {}
  const stagger = parseInt(grid.getAttribute('data-animation-stagger') || '90', 10)
  const start = grid.getAttribute('data-columns') === '1' ? 'top 85%' : 'top 75%'
  const timers: number[] = []

  const trigger = ScrollTrigger.create({
    once: true,
    onEnter: () => {
      wrap.querySelector('.nectar-post-grid-filters')?.classList.add('animated-in')
      all('.nectar-post-grid-item', wrap).forEach((item, i) =>
        timers.push(window.setTimeout(() => item.classList.add('animated-in'), i * stagger)),
      )
      timers.push(window.setTimeout(() => wrap.classList.add('finished-animating'), 950))
    },
    start,
    trigger: wrap,
  })
  return () => {
    trigger.kill()
    timers.forEach((t) => window.clearTimeout(t))
  }
}

/** Cursor-following elements: the "View" tooltip and the vertical list's featured image */
function cursorFollow(grid: HTMLElement, type: 'view-indicator' | 'post-grid-images'): Cleanup {
  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let x = mouseX
  let y = mouseY
  let raf = 0
  let timeout = 0
  const featuredFollow = grid.classList.contains('vert_list_hover_effect_featured_image_follow')
  const tooltip = grid.getAttribute('data-indicator-style') === 'tooltip_text'
  const damp = featuredFollow ? 0.1 : tooltip ? 0.24 : 0.18

  let targets: HTMLElement[]
  const listeners: Cleanup[] = []
  const listen = (el: Element, type: string, fn: EventListener) => {
    el.addEventListener(type, fn)
    listeners.push(() => el.removeEventListener(type, fn))
  }

  if (type === 'view-indicator') {
    let indicator = document.querySelector<HTMLElement>('.nectar-view-indicator')
    if (!indicator) {
      indicator = document.createElement('div')
      indicator.className = 'nectar-view-indicator'
      indicator.innerHTML = '<div class="color-circle"></div><span class="inner-layer"></span>'
      document.body.appendChild(indicator)
    }
    const view = indicator
    const style = grid.getAttribute('data-indicator-style') || ''
    const text = grid.getAttribute('data-indicator-text') || ''
    const color = grid.getAttribute('data-indicator-color') || ''
    const textColor = grid.getAttribute('data-indicator-text-color') || '#fff'
    view.querySelector('span')!.textContent = text
    targets = [view]

    all('.nectar-post-grid-item', grid).forEach((item) => {
      listen(item, 'mouseenter', () => {
        view.classList.add('visible')
        view.querySelector('span')!.textContent = text
        view.className = view.className.replace(/(^|\s)style-\S+/g, '')
        view.classList.add(`style-${style}`)
        if (style !== 'see-through') {
          ;(view.querySelector('.color-circle') as HTMLElement).style.backgroundColor = color
          ;(view.querySelector('.inner-layer') as HTMLElement).style.color = textColor
        }
        if (grid.getAttribute('data-indicator-blur') === 'true') view.classList.add('blurred-bg')
        window.clearTimeout(timeout)
      })
      listen(item, 'mouseleave', () => {
        timeout = window.setTimeout(() => view.classList.remove('visible', 'blurred-bg'), 100)
      })
    })
    all('.nectar-post-grid-item .meta-category a', grid).forEach((a) => {
      listen(a, 'mouseenter', () => view.classList.remove('visible'))
      listen(a, 'mouseleave', () => view.classList.add('visible'))
    })
  } else {
    const selector = featuredFollow
      ? '.nectar-post-grid-item-bg__media'
      : '.nectar-post-grid-item-bg-wrap'
    targets = all(selector, grid)
    grid.classList.add('mouse-move-bound')
    listen(grid, 'mouseenter', () => grid.classList.add('mouse-over'))
    listen(grid, 'mouseleave', () => grid.classList.remove('mouse-over'))
  }

  const onMove = (event: MouseEvent) => {
    mouseX = event.clientX
    mouseY = event.clientY
  }
  window.addEventListener('mousemove', onMove, { passive: true })

  const frame = () => {
    const goalX = featuredFollow
      ? 0.5 * window.innerWidth + (mouseX / window.innerWidth) * (window.innerWidth / 2)
      : mouseX
    x = lerp(x, goalX, damp)
    y = lerp(y, mouseY, damp)
    targets.forEach((t) => (t.style.transform = `translateX(${x}px) translateY(${y}px)`))
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    window.clearTimeout(timeout)
    window.removeEventListener('mousemove', onMove)
    listeners.forEach((l) => l())
  }
}

/** The work page's stacked cards: each card scales down and blurs as the next one covers it */
function stacked(grid: HTMLElement): Cleanup {
  const effect = grid.getAttribute('data-stack-animation-effect') || 'none'
  if (effect === 'none' || effect === 'overlapping') return () => {}
  if (
    document.body.classList.contains('using-mobile-browser') &&
    grid.classList.contains('layout-stacked--disable-mobile')
  ) {
    return () => {}
  }

  const items = all(':scope .nectar-post-grid-item', grid)
  const vars =
    effect === 'blurred_scale'
      ? { filter: 'blur(5px)', scale: 0.8, startFilter: 'blur(0px)' }
      : { filter: undefined, scale: 0.8, startFilter: undefined }
  const navOffset = () => {
    if (!grid.classList.contains('subtract-nav-height')) return 0
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--header-nav-height')
      .trim()
    if (!value) return 0
    const probe = document.createElement('div')
    probe.style.cssText = 'position:absolute;visibility:hidden;top:0;left:0'
    probe.style.setProperty('height', value)
    document.body.appendChild(probe)
    const h = parseFloat(getComputedStyle(probe).height)
    probe.remove()
    return isNaN(h) ? 0 : h
  }
  const gapOf = () => {
    const spacing = grid.getAttribute('data-grid-spacing') || ''
    if (spacing.includes('vw')) return window.innerWidth * (parseInt(spacing, 10) / 100)
    return spacing === 'none' ? 0 : parseInt(spacing, 10) || 20
  }

  let sections: {
    el: HTMLElement
    height: number
    inner: HTMLElement | null
    offset: number
    tween: gsap.core.Tween
  }[] = []
  let active = 0
  let startIndex = 0
  let raf = 0

  const build = () => {
    sections.forEach((s) => s.tween.kill())
    sections = items.map((el) => ({
      el,
      height: el.offsetHeight,
      inner: el.querySelector<HTMLElement>(':scope > .inner'),
      offset: 0,
      tween: gsap.fromTo(
        el,
        { filter: vars.startFilter, scale: 1 },
        { duration: 1, ease: 'none', filter: vars.filter, paused: true, scale: vars.scale },
      ),
    }))
  }
  const offsets = () => {
    const gap = gapOf() + navOffset()
    const top = grid.getBoundingClientRect().top + window.scrollY
    sections.forEach((s, i) => {
      s.el.style.top = `${gap}px`
      s.height = s.el.offsetHeight
      s.offset = top - gap + s.height * i
    })
  }

  build()
  offsets()
  const scroll = window.scrollY
  sections.forEach((s, i) => {
    if (s.offset - s.height / 2 < scroll && s.offset + s.height / 2 > scroll) startIndex = i
  })

  const frame = () => {
    const y = window.scrollY
    sections.forEach((s, i) => {
      if (s.offset - 300 < y && i !== sections.length - 1) {
        const progress = (y - s.offset) / s.height
        if (!(startIndex === 0 && i !== active && i !== active - 1))
          s.tween.progress(Math.min(Math.max(progress, 0), 1))
      }
      if (s.inner) s.inner.style.visibility = i < active - 1 ? 'hidden' : 'visible'
      const half = s.height / 2
      if (s.offset - half < y && s.offset + half > y) active = i
    })
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  const onResize = () => offsets()
  const onLoad = () => {
    build()
    offsets()
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('load', onLoad)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('load', onLoad)
    sections.forEach((s) => s.tween.kill())
  }
}

export function postGrid(): Cleanup {
  const cleanups: Cleanup[] = []
  all('.nectar-post-grid-wrap').forEach((wrap) => {
    cleanups.push(filters(wrap), entrance(wrap))
  })
  if (!isMobileBrowser()) {
    all('.nectar-post-grid[data-indicator="yes"]').forEach((grid) =>
      cleanups.push(cursorFollow(grid, 'view-indicator')),
    )
    all(
      '.nectar-post-grid-wrap[data-style="mouse_follow_image"] .nectar-post-grid, .nectar-post-grid-wrap[data-style="vertical_list"] .nectar-post-grid.vert_list_hover_effect_featured_image_follow',
    ).forEach((grid) => cleanups.push(cursorFollow(grid, 'post-grid-images')))
  }
  all('.nectar-post-grid.layout-stacked').forEach((grid) => cleanups.push(stacked(grid)))
  return () => cleanups.forEach((c) => c())
}
