import React from 'react'

/** A row of two half-width images in the crystal-vibes layout */
export function CrystalVibesGalleryRowHalf({
  id,
  columns,
}: {
  id: string
  columns: React.ReactNode
}) {
  return (
    <div
      id={id}
      data-column-margin="20px"
      data-midnight="dark"
      className="wpb_row vc_row-fluid vc_row full-width-section"
      style={{ paddingTop: '0px', paddingBottom: '0px' }}
    >
      <div
        className="row-bg-wrap"
        data-bg-animation="none"
        data-bg-animation-delay=""
        data-bg-overlay="false"
      >
        <div className="inner-wrap row-bg-layer">
          <div className="row-bg viewport-desktop" />
        </div>
      </div>
      <div className="row_col_wrap_12 col span_12 dark left">{columns}</div>
    </div>
  )
}
