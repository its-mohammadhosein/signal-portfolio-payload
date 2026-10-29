import React from 'react'

/** The menu that slides in from the right */
export function OffCanvasMenu({ menuItems }: { menuItems: React.ReactNode }) {
  return (
    <>
      <div id="slide-out-widget-area-bg" className="slide-out-from-right dark" />
      <div
        id="slide-out-widget-area"
        role="dialog"
        aria-modal="true"
        aria-label="Off Canvas Menu"
        className="slide-out-from-right"
        data-dropdown-func="default"
        data-back-txt="Back"
      >
        <div className="inner-wrap">
          <div className="inner" data-prepend-menu-mobile="true">
            {' '}
            <a className="slide_out_area_close" href="#">
              <span className="screen-reader-text">Close Menu</span>{' '}
              <span className="close-wrap">
                {' '}
                <span className="close-line close-line1" role="presentation" />{' '}
                <span className="close-line close-line2" role="presentation" />{' '}
              </span>{' '}
            </a>{' '}
            <div className="off-canvas-menu-container mobile-only" role="navigation">
              <ul className="menu" />
              <ul className="menu secondary-header-items" />
            </div>
            <div className="off-canvas-menu-container" role="navigation">
              <ul className="menu">{menuItems}</ul>
            </div>
          </div>
          <div className="bottom-meta-wrap" />
        </div>
      </div>
    </>
  )
}
