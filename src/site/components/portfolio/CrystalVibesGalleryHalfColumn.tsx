import React from 'react'

/** One half-width image of a row in the crystal-vibes layout */
export function CrystalVibesGalleryHalfColumn({ image }: { image: React.ReactNode }) {
  return (
    <div
      className="vc_col-sm-6 wpb_column column_container vc_column_container col no-extra-padding inherit_tablet inherit_phone "
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
            className="img-with-aniamtion-wrap  custom-size"
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
  )
}
