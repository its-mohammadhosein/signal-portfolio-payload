import React from 'react'

/** The skip-to-content link at the top of every page */
export function SkipLink() {
  return (
    <nav aria-label="Skip links" className="nectar-skip-to-content-wrap" data-nosnippet="">
      <a href="#ajax-content-wrap" className="nectar-skip-to-content">
        Skip to main content
      </a>
    </nav>
  )
}
