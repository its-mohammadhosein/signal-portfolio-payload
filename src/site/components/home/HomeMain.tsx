import React from 'react'

/** The home page content area; the sections are its children */
export function HomeMain({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wrap">
      <div className="container main-content" role="main">
        <div className="row">{children}</div>
      </div>
    </div>
  )
}
