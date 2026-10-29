import React from 'react'

/** One project of the work page grid */
export function WorkGridItem({
  id,
  categories,
  image,
  href,
  title,
  categoryLinks,
  date,
}: {
  id: string
  categories: string
  image: React.ReactNode
  href: string
  title: string
  categoryLinks: React.ReactNode
  date: string
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
        <div
          className="bg-overlay"
          style={{ backgroundColor: '#141414' }}
          data-opacity="0.2"
          data-hover-opacity="0.2"
        />
        <div className="content">
          <a className="nectar-post-grid-link" href={href}>
            <span className="screen-reader-text">{title}</span>
          </a>
          <div className="item-main">
            <h1 className="post-heading">
              <span>{title}</span>
            </h1>
            <span className="nectar-post-grid-item__meta-wrap">
              <span className="meta-category">{categoryLinks}</span>
              <span className="meta-date">{date}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
