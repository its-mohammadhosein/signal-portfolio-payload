import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Project } from '@/payload-types'

import { Media } from '@/components/Media'

export type ProjectCardData = Pick<
  Project,
  'slug' | 'title' | 'heroImage' | 'thumbnail' | 'categories'
>

/** Full-bleed image card with the title overlaid. Shared by the project grids and "Other Work". */
export const ProjectCard: React.FC<{
  className?: string
  priority?: boolean
  project: ProjectCardData
  size?: string
}> = ({ className, priority, project, size = '(min-width: 768px) 33vw, 100vw' }) => {
  const { slug, title, heroImage, thumbnail, categories } = project

  const image = thumbnail || heroImage
  const categoryTitles = (categories || [])
    .map((category) => (typeof category === 'object' ? category.title : null))
    .filter(Boolean)

  return (
    <Link
      className={cn(
        'group relative block aspect-[4/5] overflow-hidden bg-ink text-paper',
        className,
      )}
      href={`/portfolio/${slug}`}
    >
      {image && typeof image === 'object' && (
        <Media
          fill
          imgClassName="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          priority={priority}
          resource={image}
          size={size}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        {categoryTitles.length > 0 && (
          <p className="mb-2 text-sm uppercase tracking-wide opacity-80">
            {categoryTitles.join(', ')}
          </p>
        )}
        <h3 className="text-h3">{title}</h3>
      </div>
    </Link>
  )
}
