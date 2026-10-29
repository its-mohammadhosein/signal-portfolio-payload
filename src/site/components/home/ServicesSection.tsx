import React from 'react'

/** The intro sentence with its link, and the auto-scrolling ticker of service cards */
export function ServicesSection({
  introText,
  introCtaHref,
  introCtaLabel,
  serviceCards,
}: {
  introText: string
  introCtaHref: string
  introCtaLabel: string
  serviceCards: React.ReactNode
}) {
  return (
    <div
      id="services"
      data-column-margin="default"
      data-midnight="dark"
      data-top-percent="12%"
      data-bottom-percent="6%"
      data-color-change-section-bg-color="#EAE9E8"
      data-color-change-section-text-color="var(--nectar-font-color)"
      className="wpb_row vc_row-fluid vc_row full-width-content has-row-bg-color vc_row-o-equal-height vc_row-flex vc_row-o-content-top  nectar-overflow-hidden top_padding_tablet_24pct bottom_padding_tablet_15pct"
      style={
        {
          paddingTop: 'calc(100vw * 0.12)',
          paddingBottom: 'calc(100vw * 0.06)',
          '--row-bg-color': '#EAE9E8',
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
            style={{ backgroundColor: '#EAE9E8' }}
          />
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
                id="fws_6adfaabe8f1b1"
                data-midnight=""
                data-column-margin="default"
                className="wpb_row vc_row-fluid vc_row inner_row vc_row-o-equal-height vc_row-flex vc_row-o-content-bottom right_padding_60px left_padding_60px bottom_padding_tablet_6pct right_padding_tablet_40pct right_padding_phone_25px left_padding_tablet_25px left_padding_phone_25px"
                style={{ paddingBottom: '3%' }}
              >
                <div className="row-bg-wrap">
                  <div className="row-bg" />
                </div>
                <div className="row_col_wrap_12_inner col span_12  left">
                  <div
                    className="vc_col-sm-6 wpb_column column_container vc_column_container col child_column right_padding_desktop_8pct right_padding_phone_0px "
                    data-padding-pos="all"
                    data-has-bg-color="false"
                    data-bg-color=""
                    data-bg-opacity="1"
                    data-animation=""
                    data-delay="0"
                  >
                    <div className="vc_column-inner">
                      <div className="wpb_wrapper">
                        <div className="nectar-responsive-text nectar-link-underline-effect">
                          <h2>{introText}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="vc_col-sm-6 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone flex_gap_desktop_10px "
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
                          className="nectar-cta  alignment_tablet_default alignment_phone_left display_tablet_inherit display_phone_inherit "
                          data-color="default"
                          data-using-bg="false"
                          data-display="block"
                          data-style="underline"
                          data-alignment="right"
                          data-text-color="std"
                          style={
                            {
                              '--nectar-button-color': 'var(--nectar-default)',
                              '--nectar-icon-gap': '10px',
                            } as React.CSSProperties
                          }
                        >
                          <p>
                            {' '}
                            <span className="link_wrap">
                              <a className="link_text" role="button" href={introCtaHref}>
                                {introCtaLabel}
                              </a>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="nectar-flickity not-initialized nectar-carousel tb-spacing-0 ticker-rotate "
                role="region"
                aria-roledescription="carousel"
                aria-label="Carousel"
                data-ticker-speed="slow"
                data-ticker-direction="default"
                data-centered-cells="true"
                data-pause-on-hover="true"
                data-touch-icon-color="default"
                data-control-color="default"
                data-overflow="visible"
                data-r-bottom-total=""
                data-drag-scale=""
                data-wrap="wrap"
                data-spacing="10px"
                data-controls="none"
                data-pagination-alignment="default"
                data-adaptive-height=""
                data-border-radius="10px"
                data-column-border=""
                data-column-padding="20px"
                data-format="default"
                data-autoplay="true"
                data-autoplay-dur="5000"
                data-control-style="material_pagination"
                data-desktop-columns="4"
                data-small-desktop-columns="3"
                data-tablet-columns="2"
                data-phone-columns="1"
                data-column-color=""
                style={{ '--subtract-from-col-width': '80px' } as React.CSSProperties}
              >
                <div className="flickity-viewport">
                  <div className="flickity-slider">{serviceCards}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
