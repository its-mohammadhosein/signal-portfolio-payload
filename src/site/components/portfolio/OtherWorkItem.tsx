import React from 'react'

/** One project in the Other Work list */
export function OtherWorkItem({
  id,
  categories,
  image,
  href,
  title,
}: {
  id: string
  categories: string
  image: React.ReactNode
  href: string
  title: string
}) {
  return (
    <div
      className="nectar-post-grid-item"
      data-post-id={id}
      data-signal-categories={categories}
      data-has-img="true"
    >
      <div className="inner">
        <div className="nectar-post-grid-item-bg-wrap">
          <div className="nectar-post-grid-item-bg-wrap-inner">
            <div className="nectar-post-grid-item-bg">{image}</div>
          </div>
        </div>
        <div className="content">
          <a className="nectar-post-grid-link" href={href}>
            <span className="screen-reader-text">{title}</span>
          </a>
          <div className="item-main">
            <div className="post-heading-wrap">
              <h3 className="post-heading">
                <span>{title}</span>
              </h3>
            </div>
            <svg
              className="nectar-post-grid-item__arrow"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="60 58 140 140"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M198,64V168a6,6,0,0,1-12,0V78.48L68.24,196.24a6,6,0,0,1-8.48-8.48L177.52,70H88a6,6,0,0,1,0-12H192A6,6,0,0,1,198,64Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
