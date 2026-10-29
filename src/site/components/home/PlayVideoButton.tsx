import React from 'react'

/** The "Play Video" button, opens the video in a lightbox */
export function PlayVideoButton({ href, label }: { href: string; label: string }) {
  return (
    <div
      className="nectar-cta  border_radius_100px alignment_tablet_default alignment_phone_default display_tablet_inherit display_phone_inherit backdrop_filter_blur_20 "
      data-color="custom"
      data-using-bg="true"
      data-style="text-reveal"
      data-display="block"
      data-alignment="center"
      data-text-color="custom"
      style={
        {
          '--nectar-text-color': '#ffffff',
          '--nectar-button-color': '#1212131C',
          '--nectar-icon-gap': '10px',
        } as React.CSSProperties
      }
    >
      <h6 style={{ color: '#ffffff' }}>
        <span
          className="link_wrap"
          style={{
            paddingTop: '0.5em',
            paddingRight: '1.5em',
            paddingBottom: '0.5em',
            paddingLeft: '1.5em',
            backgroundColor: '#1212131C',
          }}
        >
          <a className="link_text pp nectar_video_lightbox" role="button" href={href}>
            <span className="text nectar-text-reveal-button__text" data-text={label}>
              {label}
            </span>
          </a>
        </span>
      </h6>
    </div>
  )
}
