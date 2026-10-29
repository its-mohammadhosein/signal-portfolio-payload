import React from 'react'

/** The transparent header: logo, "Get Started" button and the menu toggle */
export function SiteHeader({
  logoText,
  ctaHref,
  ctaLabel,
}: {
  logoText: string
  ctaHref: string
  ctaLabel: string
}) {
  return (
    <div
      id="header-outer"
      data-has-menu="true"
      data-has-buttons="yes"
      data-header-button_style="default"
      data-using-pr-menu="false"
      data-mobile-fixed="1"
      data-ptnm="1"
      data-lhe="button_bg"
      data-user-set-bg="#f1efed"
      data-format="default"
      data-permanent-transparent="1"
      data-megamenu-rt="0"
      data-remove-fixed="0"
      data-header-resize="0"
      data-cart="false"
      data-transparency-option="1"
      data-box-shadow="none"
      data-shrink-num="6"
      data-using-secondary="0"
      data-using-logo="0"
      data-logo-height="20"
      data-m-logo-height="24"
      data-padding="30"
      data-full-width="true"
      data-condense="false"
      data-transparent-header="true"
      data-transparent-shadow-helper="false"
      data-remove-border="true"
      className="transparent dark-slide"
    >
      <div id="search-outer" className="nectar" data-nosnippet="">
        <div id="search">
          <div className="container">
            <div id="search-box">
              <div className="inner-wrap">
                <div className="col span_12">
                  <form role="search" action="/" method="GET">
                    {' '}
                    <input
                      type="text"
                      name="s"
                      defaultValue=""
                      aria-label="Search"
                      placeholder="Search"
                    />{' '}
                    <span>Hit enter to search or ESC to close</span>{' '}
                    <button aria-label="Search" className="search-box__button" type="submit">
                      Search
                    </button>{' '}
                  </form>
                </div>
              </div>
            </div>
            <div id="close">
              <a href="#" role="button">
                <span className="screen-reader-text">Close Search</span>{' '}
                <span className="close-wrap">
                  {' '}
                  <span className="close-line close-line1" role="presentation" />{' '}
                  <span className="close-line close-line2" role="presentation" />{' '}
                </span>{' '}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="header-outer__gradient-blur-wrapper">
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
      </div>
      <header id="top" role="banner" aria-label="Main Menu">
        <div className="container">
          <div className="row">
            <div className="col span_3">
              {' '}
              <a
                id="logo"
                href="/"
                data-supplied-ml-starting-dark="false"
                data-supplied-ml-starting="false"
                data-supplied-ml="false"
                className="no-image"
              >
                {logoText}
              </a>{' '}
            </div>
            <div className="col span_9 col_last">
              <div className="nectar-mobile-only mobile-header">
                <div className="inner">
                  <ul id="menu-signal-cta" className="sf-menu">
                    <li
                      id="menu-item-226"
                      className="menu-item menu-item-type-custom menu-item-object-custom menu-item-btn-style-button-border_accent-color menu-item-icon-alignment-right menu-item-226"
                    >
                      <a href={ctaHref}>
                        <span className="menu-title-text">{ctaLabel}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="slide-out-widget-area-toggle mobile-icon slide-out-from-right"
                data-custom-color="false"
                data-icon-animation="simple-transform"
              >
                <div>
                  {' '}
                  <a
                    href="#slide-out-widget-area"
                    role="button"
                    aria-label="Navigation Menu"
                    aria-expanded="false"
                    className="closed"
                  >
                    {' '}
                    <span className="screen-reader-text">Menu</span>
                    <span aria-hidden="true">
                      {' '}
                      <i className="lines-button x2" data-variant="even_lines">
                        {' '}
                        <i className="lines" />{' '}
                      </i>{' '}
                      {/* hover-effect copy the theme adds to the icon */}
                      <i className="lines-button x2 hover-effect" data-variant="even_lines">
                        {' '}
                        <i className="lines" />{' '}
                      </i>
                    </span>{' '}
                  </a>
                </div>
              </div>
              <nav aria-label="Main Menu">
                <ul className="sf-menu">
                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-btn-style-button-border_accent-color menu-item-hover-text-reveal menu-item-icon-alignment-right nectar-regular-menu-item menu-item-226">
                    <a href={ctaHref}>
                      <span className="menu-title-text">
                        <span className="nectar-text-reveal-button">
                          <span className="nectar-text-reveal-button__text" data-text={ctaLabel}>
                            {ctaLabel}
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
                <ul className="buttons sf-menu" data-user-set-ocm="1">
                  <li
                    className="slide-out-widget-area-toggle"
                    data-icon-animation="simple-transform"
                    data-custom-color="false"
                  >
                    <div>
                      {' '}
                      <a
                        href="#slide-out-widget-area"
                        aria-label="Navigation Menu"
                        aria-expanded="false"
                        role="button"
                        className="closed"
                      >
                        {' '}
                        <span className="screen-reader-text">Menu</span>
                        <span aria-hidden="true">
                          {' '}
                          <i className="lines-button x2" data-variant="even_lines">
                            {' '}
                            <i className="lines" />{' '}
                          </i>{' '}
                          {/* hover-effect copy the theme adds to the icon */}
                          <i className="lines-button x2 hover-effect" data-variant="even_lines">
                            {' '}
                            <i className="lines" />{' '}
                          </i>
                        </span>{' '}
                      </a>{' '}
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
