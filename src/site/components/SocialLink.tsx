import React from 'react'

/** One "Get Social" link */
export function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <div
      className="nectar-cta  alignment_tablet_default alignment_phone_default display_tablet_inherit display_phone_inherit font_size_desktop_2vw font_size_min_20px "
      data-color="default"
      data-using-bg="false"
      data-style="text-reveal"
      data-display="block"
      data-alignment="left"
      data-text-color="std"
      style={
        {
          '--nectar-button-color': 'var(--nectar-default)',
          '--nectar-icon-gap': '10px',
        } as React.CSSProperties
      }
    >
      <h3>
        <span className="link_wrap">
          <a className="link_text" role="button" href={href}>
            <span className="text nectar-text-reveal-button__text" data-text={label}>
              {label}
            </span>
          </a>
        </span>
      </h3>
    </div>
  )
}
