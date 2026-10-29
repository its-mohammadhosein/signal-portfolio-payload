import React from 'react'

/**
 * The menu that slides in from the right. Like the theme's material menu, it sits after
 * .ocm-effect-wrap, and its close button lives in its own wrapper (see SiteShell).
 */
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
