import React from 'react'

/** The statement whose words fade in on scroll, with images between the words */
export function NoiseSection({ noiseContent }: { noiseContent: React.ReactNode }) {
  return (
    <div
      id="fws_6adfaabe94fc9"
      data-column-margin="default"
      data-midnight="dark"
      data-top-percent="10%"
      data-bottom-percent="10%"
      className="wpb_row vc_row-fluid vc_row full-width-content vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_15pct left_padding_15pct right_padding_phone_25px left_padding_phone_25px"
      style={{ paddingTop: 'calc(100vw * 0.10)', paddingBottom: 'calc(100vw * 0.10)' }}
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
      <div className="row_col_wrap_12 col span_12 dark left">
        <div
          className="vc_col-sm-12 wpb_column column_container vc_column_container col no-extra-padding force-desktop-text-align-center inherit_tablet inherit_phone flex_gap_desktop_10px "
          data-padding-pos="all"
          data-has-bg-color="false"
          data-bg-color=""
          data-bg-opacity="1"
          data-animation=""
          data-delay="0"
        >
          <div className="vc_column-inner">
            <div className="wpb_wrapper">
              <div
                className="nectar-text-inline-images nectar-link-underline-effect font_size_desktop_6vw font_size_phone_10vw nectar-text-inline-images--animation_scroll_fade nectar-text-inline-images--roundness--10px font_line_height_1-1"
                data-inherit-heading-family="h1"
              >
                <div className="nectar-text-inline-images__inner">
                  <h2 style={{ textAlign: 'center' }}>{noiseContent}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
