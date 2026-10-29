import React from 'react'

/** One testimonial slide */
export function Testimonial({
  icon,
  quote,
  name,
  role,
}: {
  icon: string
  quote: string
  name: string
  role: string
}) {
  return (
    <blockquote>
      <div data-shadow="" className="image-icon has-bg" data-nectar-img-src={icon}>
        “
      </div>
      <p>
        <span className="open-quote">“</span>
        {quote}
        <span className="close-quote">”</span> <span role="none" className="bottom-arrow" />
      </p>
      <span className="testimonial-name">{name}</span>
      <span className="title">{role}</span>
    </blockquote>
  )
}
