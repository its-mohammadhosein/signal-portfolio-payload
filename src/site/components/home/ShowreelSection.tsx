import React from 'react'

/** The showreel band: background video and "Play Video" button when set */
export function ShowreelSection({
  videoBg,
  videoCta,
}: {
  videoBg: React.ReactNode
  videoCta: React.ReactNode
}) {
  return (
    <section
      id="fws_6adfaabe9f49d"
      data-column-margin="default"
      data-midnight="dark"
      data-color-change-section-bg-color="#EAE9E8"
      data-color-change-section-text-color="var(--nectar-font-color)"
      className="nectar_section wpb_row vc_row full-width-content vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px right_padding_tablet_25px left_padding_tablet_25px"
      style={{ paddingTop: '0px', paddingBottom: '0px' }}
    >
      <div
        className="row-bg-wrap"
        data-bg-animation="none"
        data-bg-animation-delay=""
        data-bg-overlay="false"
      >
        <div className="inner-wrap row-bg-layer">
          <div
            className="row-bg viewport-desktop using-bg-color"
            style={{ backgroundColor: '#EAE9E8' }}
          />
        </div>
      </div>
      <div className="row_col_wrap_12 span_12 dark ">
        <div
          id="fws_6adfaabe9f630"
          data-br="10px"
          data-br-applies="bg"
          data-column-margin="default"
          data-midnight="dark"
          className="wpb_row vc_row-fluid vc_row full-width-content has-row-bg-color vc_row-o-equal-height vc_row-flex vc_row-o-content-top  height_desktop_70vh height_phone_50vh"
          style={
            {
              paddingTop: '0px',
              paddingBottom: '0px',
              '--row-bg-color': '#FFFFFF',
            } as React.CSSProperties
          }
        >
          <div
            className="row-bg-wrap"
            data-bg-animation="none"
            data-bg-animation-delay=""
            data-bg-overlay="false"
          >
            <div className="inner-wrap row-bg-layer">
              <div
                className="row-bg viewport-desktop using-bg-color"
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </div>
          </div>
          <div className="video-color-overlay row-bg-layer" data-color="" />
          {videoBg}
          <div className="row_col_wrap_12 col span_12 dark left">
            <div
              className="vc_col-sm-12 wpb_column column_container vc_column_container col nectar-sticky-column-css--middle nectar-sticky-column-css left_padding_desktop_20px top_padding_desktop_20px right_padding_desktop_20px bottom_padding_desktop_20px flex_layout_desktop_row flex_justify_content_desktop_flex-start flex_align_items_desktop_flex-start flex_wrap_desktop_wrap flex_reverse_desktop_false flex_gap_desktop_10px "
              data-padding-pos="all"
              data-has-bg-color="false"
              data-bg-color=""
              data-bg-opacity="1"
              data-animation=""
              data-delay="0"
            >
              <div className="n-sticky nectar-sticky-column-wrap--mobile">
                <div className="vc_column-inner">
                  <div className="wpb_wrapper">{videoCta}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
