import React from 'react'

/**
 * One line of the hero headline, revealed letter by letter (src/site/effects/reveals.ts).
 * Rendered already split the way the theme splits it: a span per word, a span.inner per letter,
 * each letter starting 1.3em down inside its word.
 */
export function HeroLine({ text }: { text: string }) {
  const words = text.trim().split(' ')

  return (
    <div
      className="nectar-split-heading  font_size_14vw font_size_max_250px font_line_height_0-85  markup-generated"
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
      <h1 aria-label={words.join(' ')}>
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span aria-hidden="true">
              {Array.from(word).map((letter, j) => (
                <span className="inner" key={j} style={{ transform: 'translateY(1.3em)' }}>
                  {letter}
                </span>
              ))}
            </span>{' '}
          </React.Fragment>
        ))}
      </h1>
    </div>
  )
}
