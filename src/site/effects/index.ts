import { anchors } from './anchors'
import { colorChange } from './colorChange'
import { contactForms } from './contactForm'
import { contentTrail } from './contentTrail'
import { device } from './device'
import { fitText } from './fitText'
import { header } from './header'
import { inlineImagesEffect } from './inlineImages'
import { lazyLoad } from './lazyLoad'
import { offCanvas } from './offCanvas'
import { postGrid } from './postGrid'
import { reveals } from './reveals'
import { ScrollTrigger, type Cleanup } from './shared'
import { testimonials } from './testimonials'
import { ticker } from './ticker'
import { videoLightbox } from './videoLightbox'

/**
 * Every interactive behaviour of the Signal pages, ported from the Salient theme's scripts.
 * Each effect finds its elements in the rendered page and returns a cleanup.
 */
export function startEffects(): Cleanup {
  const cleanups = [
    device,
    lazyLoad,
    colorChange,
    header,
    offCanvas,
    anchors,
    reveals,
    contentTrail,
    ticker,
    inlineImagesEffect,
    postGrid,
    testimonials,
    fitText,
    contactForms,
    videoLightbox,
  ].map((effect) => effect())

  // positions change once images and fonts are in
  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh)

  return () => {
    window.removeEventListener('load', refresh)
    cleanups.reverse().forEach((cleanup) => cleanup())
  }
}
