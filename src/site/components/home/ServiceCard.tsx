import React from 'react'

/** One card of the services ticker */
export function ServiceCard({
  imageUrl,
  colorLayer,
  title,
  rowId,
  badges,
}: {
  imageUrl: string
  colorLayer: React.ReactNode
  title: string
  rowId: string
  badges: React.ReactNode
}) {
  return (
    <div className="cell  nectar-background-gradient-blur flex_layout_desktop_column flex_justify_content_desktop_space-between flex_align_items_desktop_flex-start flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_10px ">
      <div className="inner-wrap-outer">
        <div className="inner-wrap" data-nectar-lazy-bg="" data-nectar-img-src={imageUrl}>
          {colorLayer}
          <div
            className="nectar-responsive-text nectar-link-underline-effect"
            style={{ color: '#ffffff' }}
          >
            <h3>{title}</h3>
          </div>
          <div className="divider-wrap height_phone_250px " data-alignment="default">
            <div style={{ height: '350px' }} className="divider" />
          </div>
          <div
            id={rowId}
            data-midnight=""
            data-column-margin="default"
            className="wpb_row vc_row-fluid vc_row inner_row"
          >
            <div className="row-bg-wrap">
              <div className="row-bg" />
            </div>
            <div className="row_col_wrap_12_inner col span_12  left">
              <div
                className="vc_col-sm-12 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone flex_layout_desktop_row flex_justify_content_desktop_flex-start flex_align_items_desktop_flex-start flex_wrap_desktop_wrap flex_reverse_desktop_false flex_gap_desktop_8px "
                data-padding-pos="all"
                data-has-bg-color="false"
                data-bg-color=""
                data-bg-opacity="1"
                data-animation=""
                data-delay="0"
              >
                <div className="vc_column-inner">
                  <div className="wpb_wrapper">{badges}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
