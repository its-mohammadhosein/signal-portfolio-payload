import React from 'react'

/** An image between the words of the statement */
export function InlineImage({ image }: { image: React.ReactNode }) {
  return (
    <span className="nectar-text-inline-images__marker" data-img-size="large__h_rect">
      {'\u00a0'}
      {image}
    </span>
  )
}
