import fitty, { type FittyInstance } from 'fitty'

import { all, isMobileBrowser, type Cleanup } from './shared'

const availableWidth = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  const style = getComputedStyle(el)
  return Math.max(
    0,
    rect.width - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0),
  )
}

/** [data-has-fit-text] headings (the SIGNAL wordmark) fill their container's width (fitty, max 1100px) */
export function fitText(): Cleanup {
  const wrappers = new Map<HTMLElement, HTMLElement>()

  // fitty needs a block parent; the theme wraps headings that sit in a flex column
  all('[data-has-fit-text="true"]').forEach((el) => {
    const parent = el.parentElement
    if (!parent || parent.hasAttribute('data-fit-text-wrapper')) return
    const style = getComputedStyle(parent)
    if (style.display !== 'flex' || !style.flexDirection.startsWith('column')) return
    const wrapper = document.createElement('div')
    wrapper.setAttribute('data-fit-text-wrapper', 'true')
    wrapper.style.cssText = 'display:block;box-sizing:border-box'
    parent.insertBefore(wrapper, el)
    wrapper.appendChild(el)
    const width = `${availableWidth(parent)}px`
    wrapper.style.width = width
    wrapper.style.maxWidth = width
    wrappers.set(el, wrapper)
  })

  // window resizes are handled below, as in the theme (fitty's own observer is global)
  ;(fitty as unknown as { observeWindow: boolean }).observeWindow = false
  const fitties: FittyInstance[] = fitty('[data-has-fit-text="true"]', { maxSize: 1100 })
  fitties.forEach((f) =>
    f.element.addEventListener('fit', () => f.element.classList.add('fitty-fit')),
  )

  const refit = () =>
    fitties.forEach((f) => {
      const wrapper = wrappers.get(f.element)
      if (wrapper?.parentElement) {
        const width = `${availableWidth(wrapper.parentElement)}px`
        wrapper.style.width = width
        wrapper.style.maxWidth = width
      }
      f.fit()
    })

  const event = isMobileBrowser() ? 'orientationchange' : 'resize'
  window.addEventListener(event, refit)
  // the theme refits after load, once fonts have settled
  const timers = [window.setTimeout(refit, 100), window.setTimeout(refit, 300)]
  document.fonts?.ready.then(refit)

  return () => {
    window.removeEventListener(event, refit)
    timers.forEach((t) => window.clearTimeout(t))
    fitties.forEach((f) => f.unsubscribe())
    wrappers.forEach((wrapper, el) => {
      wrapper.parentElement?.insertBefore(el, wrapper)
      wrapper.remove()
    })
  }
}
