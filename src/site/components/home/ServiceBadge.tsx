import React from 'react'

/** One pill under a service card title */
export function ServiceBadge({ text }: { text: string }) {
  return (
    <div
      className="nectar-badge nectar-inherit-body nectar-display-block padding-amount-small badge-style-default border-radius-20px font_size_min_10px font_size_max_20px font_size_desktop_0vw font_line_height_1px"
      data-bg-color-custom="rgba(0,0,0,0.09)"
    >
      <div className="nectar-badge__inner">{text}</div>
    </div>
  )
}
