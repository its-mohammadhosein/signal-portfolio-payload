import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const SignalHero: React.FC<Page['hero']> = ({
  headline,
  links,
  metaLabels,
  trailImages,
}) => {
  const lines = (headline || '').split('\n').filter(Boolean)
  const images = (trailImages || []).filter((image) => typeof image === 'object')

  return (
    <div className="container pt-8 pb-16 md:pb-24">
      <h1 className="text-display uppercase">
        {lines.map((line, i) => (
          <span className="block" key={i}>
            {line}
          </span>
        ))}
      </h1>

      {metaLabels && metaLabels.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-3">
          {metaLabels.map(({ id, text }) => (
            <li className="rounded-full border border-border px-4 py-1 text-sm" key={id}>
              {text}
            </li>
          ))}
        </ul>
      )}

      {links && links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {links.map(({ link }, i) => (
            <CMSLink key={i} size="lg" {...link} />
          ))}
        </div>
      )}

      {images.length > 0 && (
        <ul className="mt-16 flex gap-4 overflow-hidden">
          {images.map((image, i) => (
            <li
              className={i % 2 === 0 ? 'w-40 shrink-0 md:w-56' : 'mt-10 w-40 shrink-0 md:w-56'}
              key={image.id}
            >
              <Media
                imgClassName="aspect-[3/4] w-full object-cover"
                resource={image}
                size="224px"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
