import React from 'react'

/** The testimonial slider */
export function TestimonialsSection({ testimonials }: { testimonials: React.ReactNode }) {
  return (
    <div
      id="testimonials"
      data-column-margin="default"
      data-midnight="dark"
      data-top-percent="7%"
      data-bottom-percent="10%"
      className="wpb_row vc_row-fluid vc_row full-width-content vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px top_padding_phone_5rem bottom_padding_phone_5rem right_padding_tablet_25px left_padding_tablet_25px"
      style={{ paddingTop: 'calc(100vw * 0.07)', paddingBottom: 'calc(100vw * 0.10)' }}
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
          className="vc_col-sm-12 wpb_column column_container vc_column_container col centered-text no-extra-padding inherit_tablet inherit_phone "
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
                className="testimonial_slider span_12 col font_size_desktop_2vw font_line_height_1-4 disable-height-animation"
                role="region"
                aria-roledescription="carousel"
                aria-label="Testimonials"
                data-color=""
                data-rating-color="accent-color"
                data-controls="default"
                data-add-border=""
                data-autorotate=""
                data-style="minimal"
              >
                <div className="slides">{testimonials}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
