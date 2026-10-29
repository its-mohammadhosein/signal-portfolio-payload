import React from 'react'

import type { ServicesBlock as ServicesBlockProps } from '@/payload-types'

export const ServicesBlock: React.FC<ServicesBlockProps> = ({ heading, items }) => {
  return (
    <div className="container">
      {heading && <h2 className="mb-12 text-h2">{heading}</h2>}
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {(items || []).map(({ id, title, bullets }) => (
          <li className="border-t border-border pt-6" key={id}>
            <h3 className="mb-4 text-h3">{title}</h3>
            {bullets && bullets.length > 0 && (
              <ul className="flex flex-col gap-1 text-muted-foreground">
                {bullets.map((bullet) => (
                  <li key={bullet.id}>{bullet.text}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
