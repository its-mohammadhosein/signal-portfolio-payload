import { all, state, type Cleanup } from './shared'

const OPEN_LOCK = 700 // ms the toggle ignores clicks while the menu animates (theme value)

/**
 * The material "slide out from right" menu. Opening and closing only toggle the theme's classes;
 * the motion is its CSS. The markup is already in its opened-ready structure (see SiteShell).
 */
export function offCanvas(): Cleanup {
  const body = document.body
  const menu = document.getElementById('slide-out-widget-area')
  const bg = document.getElementById('slide-out-widget-area-bg')
  const header = document.getElementById('header-outer')
  const content = document.getElementById('ajax-content-wrap')
  const effectWrap = document.querySelector<HTMLElement>('.ocm-effect-wrap')
  const effectInner = document.querySelector<HTMLElement>('.ocm-effect-wrap-inner')
  if (!menu || !bg || !header || !content || !effectWrap) return () => {}

  const toggles = () =>
    all('.slide-out-widget-area-toggle:not(.std-menu):not(.simple-mobile-menu) > div > a')
  const closeButton = () =>
    document.querySelector<HTMLElement>('body > .slide_out_area_close__wrap .slide_out_area_close')
  const timers: number[] = []
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))

  // The hamburger's close icon fades in once rendered
  later(
    () =>
      all('header#top .slide-out-widget-area-toggle a > span .close-wrap').forEach((el) =>
        el.classList.add('loaded'),
      ),
    200,
  )

  const open = () => {
    if (state.ocmAnimating || state.ocmOpen) return
    state.ocmOpen = true
    state.ocmAnimating = true
    later(() => (state.ocmAnimating = false), OPEN_LOCK)
    header.classList.remove('no-transition')

    const scrollTop = window.scrollY
    ;[menu, bg, ...all('#header-outer .slide-out-widget-area-toggle')].forEach((el) =>
      el.classList.add('material-open'),
    )
    later(() => toggles().forEach((a) => a.classList.remove('animating')), 300)
    content.style.position = 'relative'
    content.style.top = `-${scrollTop}px`
    if (effectInner) effectInner.style.paddingTop = '0px'
    state.materialOffCanvasOpen = true
    body.classList.add('material-ocm-open', 'nectar-no-flex-height')
    effectWrap.style.height = `${window.innerHeight}px`
    later(() => effectWrap.classList.add('material-ocm-open'), 40)
    closeButton()?.classList.add('follow-body')
    all(
      '#header-outer:not([data-format="left-header"]) header#top .slide-out-widget-area-toggle a',
    ).forEach((a) => a.classList.add('effect-shown'))
    later(() => {
      const close = closeButton()
      close?.classList.add('material-ocm-open')
      close?.classList.remove('hide_until_rendered')
    }, 350)

    header.classList.remove('side-widget-closed')
    header.classList.add('side-widget-open')
    toggles().forEach((a) => {
      a.classList.remove('closed')
      a.classList.add('open', 'animating')
      a.setAttribute('aria-expanded', 'true')
    })
  }

  const close = () => {
    if (state.ocmAnimating || !state.ocmOpen) return
    state.ocmOpen = false
    header.classList.remove('no-transition')
    toggles().forEach((a) => {
      a.classList.remove('open')
      a.classList.add('closed', 'animating')
      a.setAttribute('aria-expanded', 'false')
    })

    menu.classList.remove('open')
    ;[menu, bg, ...all('#header-outer .slide-out-widget-area-toggle')].forEach((el) =>
      el.classList.remove('material-open'),
    )
    ;[effectWrap, ...all('.ocm-effect-wrap-shadow'), closeButton()].forEach((el) =>
      el?.classList.remove('material-ocm-open'),
    )
    closeButton()?.classList.remove('follow-body')

    later(() => {
      toggles().forEach((a) => a.classList.remove('animating'))
      body.classList.remove('material-ocm-open', 'nectar-no-flex-height')
      effectWrap.style.height = '100%'
      if (effectInner) effectInner.style.paddingTop = '0'
      const top = Math.abs(parseInt(content.style.top || '0', 10))
      content.style.position = ''
      content.style.top = ''
      window.scrollTo(0, top)
      state.materialOffCanvasOpen = false
    }, 900)
    later(() => {
      all(
        '#header-outer:not([data-format="left-header"]) header#top .slide-out-widget-area-toggle a',
      ).forEach((a) => {
        a.classList.add('no-trans')
        a.classList.remove('effect-shown')
      })
    }, 200)
    later(
      () =>
        all('header#top .slide-out-widget-area-toggle a').forEach((a) =>
          a.classList.remove('no-trans'),
        ),
      500,
    )
    header.classList.remove('side-widget-open')
    header.classList.add('side-widget-closed')
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const toggle = target.closest('.slide-out-widget-area-toggle:not(.std-menu) a')
    if (toggle) {
      event.preventDefault()
      if (toggle.classList.contains('animating')) return
      if (toggle.classList.contains('closed')) open()
      else close()
      return
    }
    if (
      state.ocmOpen &&
      (target.closest('.slide_out_area_close') ||
        target.closest('#slide-out-widget-area-bg') ||
        (body.classList.contains('material-ocm-open') && target.closest('#ajax-content-wrap')))
    ) {
      event.preventDefault()
      close()
    }
  }

  // Menu links to sections of the current page close the menu (the anchor effect scrolls)
  const onMenuLink = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      '#slide-out-widget-area a[href*="#"]',
    )
    if (link && state.ocmOpen && link.pathname === window.location.pathname) close()
  }

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && state.ocmOpen) close()
  }

  document.addEventListener('click', onClick)
  document.addEventListener('click', onMenuLink, true)
  document.addEventListener('keydown', onKey)

  return () => {
    document.removeEventListener('click', onClick)
    document.removeEventListener('click', onMenuLink, true)
    document.removeEventListener('keydown', onKey)
    timers.forEach((t) => window.clearTimeout(t))
  }
}

/** Close the menu from another effect (e.g. before an anchor scroll) */
export const closeOffCanvas = () =>
  document
    .querySelector<HTMLElement>('.slide-out-widget-area-toggle:not(.std-menu) > div > a.open')
    ?.click()
