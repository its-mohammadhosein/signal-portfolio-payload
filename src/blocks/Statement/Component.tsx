import { cn } from '@/utilities/ui'
import React from 'react'

import type { StatementBlock as StatementBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const StatementBlock: React.FC<StatementBlockProps> = ({ align, links, text }) => {
  const isCentered = align !== 'left'

  return (
    <div className="container">
      <div
        className={cn(
          'flex flex-col gap-10',
          isCentered ? 'items-center text-center' : 'items-start',
        )}
      >
        <h2 className="max-w-5xl text-h2 md:text-[3.375rem] md:leading-[1.1]">{text}</h2>
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {links.map(({ link }, i) => (
              <CMSLink key={i} size="lg" {...link} appearance={link.appearance || 'pill'} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
