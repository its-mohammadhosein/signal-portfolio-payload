import React from 'react'

import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ heading, items }) => {
  return (
    <div className="container">
      {heading && <h2 className="mb-12 text-h2">{heading}</h2>}
      <ul className="grid gap-6 md:grid-cols-3">
        {(items || []).map(({ id, quote, name, role }) => (
          <li className="flex" key={id}>
            <figure className="flex w-full flex-col justify-between gap-8 rounded-2xl bg-card p-8">
              <blockquote className="text-lg">{quote}</blockquote>
              <figcaption>
                <span className="block font-medium">{name}</span>
                {role && <span className="text-muted-foreground">{role}</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}
