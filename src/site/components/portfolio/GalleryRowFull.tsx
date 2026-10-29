import React from 'react'

/** A full-width image row of a case study (same in both layouts) */
export function GalleryRowFull({ id, image }: { id: string; image: React.ReactNode }) {
  return (
    <div
      id={id}
      data-column-margin="default"
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
      <div className="row_col_wrap_12 col span_12 dark left">
        <div
          className="vc_col-sm-12 wpb_column column_container vc_column_container col no-extra-padding inherit_tablet inherit_phone flex_gap_desktop_10px "
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
                className="img-with-aniamtion-wrap "
                data-max-width="none"
                data-max-width-mobile="default"
                data-border-radius="10px"
                data-shadow="none"
                data-animation="none"
              >
                <div className="inner">
                  <div className="hover-wrap">
                    <div className="hover-wrap-inner"> {image} </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
