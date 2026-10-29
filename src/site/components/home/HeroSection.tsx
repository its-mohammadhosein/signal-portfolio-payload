import React from 'react'

/** "WE CREATE / THE HYPE" with the three labels and the image trail that follows the cursor */
export function HeroSection({
  heroLines,
  metaLeft,
  metaCenter,
  metaRight,
  heroTrail,
}: {
  heroLines: React.ReactNode
  metaLeft: string
  metaCenter: string
  metaRight: string
  heroTrail: React.ReactNode
}) {
  return (
    <div
      id="fws_6adfaabe8bdca"
      data-column-margin="default"
      data-midnight="dark"
      data-color-change-section-bg-color="#FF5513"
      data-color-change-section-text-color="var(--nectar-font-color)"
      className="wpb_row vc_row-fluid vc_row top-level full-width-content has-row-bg-color vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px right_padding_tablet_25px left_padding_tablet_25px"
      style={
        {
          paddingTop: '0px',
          paddingBottom: '0px',
          '--row-bg-color': '#FF5513',
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
            style={{ backgroundColor: '#FF5513' }}
          />
        </div>
      </div>
      <div className="row_col_wrap_12 col span_12 dark left">
        <div
          className="vc_col-sm-12 wpb_column column_container vc_column_container col column_position_static flex_layout_desktop_column flex_justify_content_desktop_space-between flex_align_items_desktop_stretch flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_10px min_height_desktop_100svh "
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
                className="divider-wrap divider-wrap--full-height"
                style={{ height: '100%' }}
                data-alignment="default"
              >
                <div className="divider" />
              </div>
              <div
                id="fws_6adfaabe8c3e0"
                data-midnight=""
                data-column-margin="default"
                className="wpb_row vc_row-fluid vc_row inner_row"
              >
                <div className="row-bg-wrap">
                  <div className="row-bg" />
                </div>
                <div className="row_col_wrap_12_inner col span_12  left">
                  <div
                    className="vc_col-sm-12 wpb_column column_container vc_column_container col child_column force-desktop-text-align-center flex_layout_desktop_column flex_justify_content_desktop_center flex_align_items_desktop_center flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_5px flex_gap_tablet_10px "
                    data-padding-pos="all"
                    data-has-bg-color="false"
                    data-bg-color=""
                    data-bg-opacity="1"
                    data-animation=""
                    data-delay="0"
                  >
                    <div className="vc_column-inner">
                      <div className="wpb_wrapper">{heroLines}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="divider-wrap divider-wrap--full-height"
                style={{ height: '100%' }}
                data-alignment="default"
              >
                <div className="divider" />
              </div>
              <div
                id="fws_6adfaabe8c95d"
                data-midnight=""
                data-column-margin="10px"
                className="wpb_row vc_row-fluid vc_row inner_row  bottom_padding_phone_20px"
                style={{ paddingBottom: '30px' }}
              >
                <div className="row-bg-wrap">
                  <div className="row-bg" />
                </div>
                <div className="row_col_wrap_12_inner col span_12  left">
                  <div
                    className="vc_col-sm-4 vc_hidden-xs wpb_column column_container vc_column_container col child_column has-animation no-extra-padding inherit_tablet inherit_phone flex_layout_desktop_row flex_justify_content_desktop_flex-start flex_align_items_desktop_flex-end flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_10px "
                    data-t-w-inherits="small_desktop"
                    data-padding-pos="all"
                    data-has-bg-color="false"
                    data-bg-color=""
                    data-bg-opacity="1"
                    data-animation="slight-fade-in-from-bottom"
                    data-delay="300"
                  >
                    <div className="vc_column-inner">
                      <div className="wpb_wrapper">
                        <div
                          className="nectar-responsive-text font_size_tablet_12px nectar-link-underline-effect"
                          data-inherit-heading-family="h6"
                        >
                          <p>{metaLeft}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="vc_col-sm-4 wpb_column column_container vc_column_container col child_column has-animation no-extra-padding inherit_tablet inherit_phone "
                    data-t-w-inherits="small_desktop"
                    data-padding-pos="all"
                    data-has-bg-color="false"
                    data-bg-color=""
                    data-bg-opacity="1"
                    data-animation="slight-fade-in-from-bottom"
                    data-delay="350"
                  >
                    <div className="vc_column-inner">
                      <div className="wpb_wrapper">
                        <div className="nectar-responsive-text font_size_tablet_14px font_size_phone_16px nectar-link-underline-effect">
                          <p style={{ textAlign: 'center' }}>{metaCenter}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="vc_col-sm-4 vc_hidden-xs wpb_column column_container vc_column_container col child_column has-animation no-extra-padding inherit_tablet inherit_phone flex_layout_desktop_row flex_justify_content_desktop_flex-end flex_align_items_desktop_flex-end flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_10px "
                    data-t-w-inherits="small_desktop"
                    data-padding-pos="all"
                    data-has-bg-color="false"
                    data-bg-color=""
                    data-bg-opacity="1"
                    data-animation="slight-fade-in-from-bottom"
                    data-delay="400"
                  >
                    <div className="vc_column-inner">
                      <div className="wpb_wrapper">
                        <div
                          className="nectar-responsive-text font_size_tablet_12px nectar-link-underline-effect"
                          data-inherit-heading-family="h6"
                        >
                          <p>{metaRight}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-type="images"
                data-colors="[]"
                data-duration="0.9"
                data-frequency="110"
                data-lerp="0"
                data-animation-in="scale"
                data-animation-out="scale"
                data-randomize="false"
                data-randomize-rotation="true"
                style={{ '--border-radius': '10px' } as React.CSSProperties}
                className="nectar-content-trail image_width_phone_100px height_desktop_100pct position_desktop_absolute top_position_desktop_0px right_position_desktop_0px left_position_desktop_0px bottom_position_desktop_10pct z_index_10"
              >
                <div className="nectar-content-trail__list">{heroTrail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
