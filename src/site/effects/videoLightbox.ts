import { gsap, type Cleanup } from './shared'

const embedUrl = (href: string) => {
  try {
    const url = new URL(href)
    const id = url.hostname.includes('youtu.be') ? url.pathname.slice(1) : url.searchParams.get('v')
    if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`
    const vimeo =
      url.hostname.includes('vimeo.com') && url.pathname.split('/').filter(Boolean).pop()
    if (vimeo) return `https://player.vimeo.com/video/${vimeo}?autoplay=1`
  } catch {
    /* not a URL */
  }
  return null
}

/**
 * The "Play Video" button (.nectar_video_lightbox) opens the video in a lightbox, in place of the
 * theme's Fancybox. Only active when a video link is set in Payload.
 */
export function videoLightbox(): Cleanup {
  let dialog: HTMLDialogElement | null = null

  const close = () => {
    if (!dialog) return
    const d = dialog
    gsap.to(d, { duration: 0.3, onComplete: () => d.remove(), opacity: 0 })
    dialog = null
  }

  const onClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.nectar_video_lightbox')
    if (!link) return
    const src = embedUrl(link.href)
    if (!src) return
    event.preventDefault()

    dialog = document.createElement('dialog')
    dialog.className = 'signal-video-lightbox'
    dialog.setAttribute('aria-label', 'Video')
    Object.assign(dialog.style, {
      background: 'rgba(0,0,0,0.87)',
      border: '0',
      height: '100vh',
      inset: '0',
      margin: '0',
      maxHeight: 'none',
      maxWidth: 'none',
      padding: '0',
      width: '100vw',
    })
    dialog.innerHTML = `<button type="button" aria-label="Close" style="position:absolute;top:20px;right:30px;background:none;border:0;color:#fff;font-size:34px;cursor:pointer">&times;</button><div style="position:absolute;inset:0;margin:auto;width:min(90vw,calc(80vh*16/9));aspect-ratio:16/9;height:auto"><iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe></div>`
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || (e.target as HTMLElement).closest('button')) close()
    })
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault()
      close()
    })
    document.body.appendChild(dialog)
    dialog.showModal()
    gsap.fromTo(dialog, { opacity: 0 }, { duration: 0.3, opacity: 1 })
  }

  document.addEventListener('click', onClick)
  return () => {
    document.removeEventListener('click', onClick)
    dialog?.remove()
  }
}
