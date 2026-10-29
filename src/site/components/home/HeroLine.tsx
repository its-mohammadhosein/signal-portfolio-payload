import React from 'react'

/** One line of the hero headline (revealed letter by letter) */
export function HeroLine({ text }: { text: string }) {
  return (
    <div
      className="nectar-split-heading  font_size_14vw font_size_max_250px font_line_height_0-85 "
      data-align="default"
      data-m-align="inherit"
      data-text-effect="letter-reveal-bottom"
      data-animation-type="line-reveal-by-space"
      data-animation-delay="0"
      data-animation-offset=""
      data-m-rm-animation=""
      data-stagger="true"
      data-custom-font-size="true"
      style={{ fontSize: '14vw', lineHeight: '15.4vw' }}
    >
      <h1>{text}</h1>
    </div>
  )
}
