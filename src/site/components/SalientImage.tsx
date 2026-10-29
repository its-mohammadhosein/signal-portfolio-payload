import React from 'react'

import type { SiteImage } from '../types'

/** Salient's lazy-load placeholder: an empty SVG with the image's aspect ratio */
const placeholder = (width: number, height: number) =>
  `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20${width}%20${height}'%2F%3E`

/**
 * An <img> the way the Salient theme writes it. Lazy images carry the real source in
 * data-nectar-img-src(set) and are swapped in by the theme's lazy loader; eager ones use src.
 */
export function SalientImage({
  attributes,
  className,
  decoding = true,
  image,
  lazy = false,
  priority = false,
  responsive = false,
}: {
  /** Extra attributes the original carries, e.g. data-delay */
  attributes?: Record<string, string>
  className: string
  /** Most originals carry decoding="async" */
  decoding?: boolean
  image: SiteImage
  lazy?: boolean
  /** fetchpriority="high", only on the first image of a page */
  priority?: boolean
  /** srcset and sizes */
  responsive?: boolean
}) {
  const srcset = image.srcset || `${image.src} ${image.width}w`
  const sizes = responsive ? `(max-width: ${image.width}px) 100vw, ${image.width}px` : undefined

  if (lazy) {
    return (
      <img
        alt={image.alt}
        className={className}
        data-nectar-img-src={image.src}
        data-nectar-img-srcset={responsive ? srcset : undefined}
        decoding={decoding ? 'async' : undefined}
        fetchPriority={priority ? 'high' : undefined}
        height={image.height}
        sizes={sizes}
        src={placeholder(image.width, image.height)}
        width={image.width}
        {...attributes}
      />
    )
  }

  return (
    <img
      alt={image.alt}
      className={className}
      decoding={decoding ? 'async' : undefined}
      fetchPriority={priority ? 'high' : undefined}
      height={image.height}
      sizes={sizes}
      src={image.src}
      srcSet={responsive ? srcset : undefined}
      width={image.width}
      {...attributes}
    />
  )
}
