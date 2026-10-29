import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(CustomEase, ScrollToPlugin, ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

/** Removes listeners, observers and timelines an effect created */
export type Cleanup = () => void

/** State the effects share; mirrors the theme's own flags (nectarState) */
export const state = {
  animatedScrolling: false,
  materialOffCanvasOpen: false,
  ocmAnimating: false,
  ocmOpen: false,
}

export const isMobileBrowser = () =>
  /(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/.test(navigator.userAgent)

/** The theme's easings, named as in its scripts (anime.js / jQuery easing names) */
export const ease = {
  /** cubicBezier(0,.2,.2,1) */
  swiftOut: CustomEase.create('signalSwiftOut', '0,0.2,0.2,1'),
  /** cubicBezier(0.25,1,0.5,1) */
  letterReveal: CustomEase.create('signalLetterReveal', '0.25,1,0.5,1'),
  easeOutCubic: 'power2.out',
  easeOutQuart: 'power3.out',
  easeOutExpo: 'expo.out',
  easeInOutCubic: 'power2.inOut',
  easeInOutQuint: 'power4.inOut',
}

/** <body data-cad> and <body data-cae>: the theme's default animation duration and easing */
export const defaultDuration = () =>
  parseInt(document.body.getAttribute('data-cad') || '650', 10) / 1000

export const on = <K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): Cleanup => {
  target.addEventListener(type, listener, options)
  return () => target.removeEventListener(type, listener, options)
}

export const all = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
) => Array.from(root.querySelectorAll<T>(selector))

export const lerp = (from: number, to: number, amount: number) => (1 - amount) * from + amount * to
