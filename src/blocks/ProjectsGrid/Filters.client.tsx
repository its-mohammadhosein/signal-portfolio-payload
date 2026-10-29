'use client'
import { cn } from '@/utilities/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'

import { ProjectCard, type ProjectCardData } from '@/components/ProjectCard'

type Props = {
  layout?: 'grid' | 'featured' | null
  projects: ProjectCardData[]
  showFilters?: boolean | null
}

/** Filtering happens in memory over the fetched projects; the active filter lives in ?category= */
export const ProjectsFilters: React.FC<Props> = ({ layout, projects, showFilters }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('category')

  const categories = useMemo(() => {
    const bySlug = new Map<string, string>()

    for (const project of projects) {
      for (const category of project.categories || []) {
        if (typeof category === 'object' && category.slug) bySlug.set(category.slug, category.title)
      }
    }

    return [...bySlug.entries()]
      .map(([slug, title]) => ({ slug, title }))
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [projects])

  const visible = active
    ? projects.filter((project) =>
        project.categories?.some(
          (category) => typeof category === 'object' && category.slug === active,
        ),
      )
    : projects

  const select = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (slug) params.set('category', slug)
    else params.delete('category')

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const tabClass = (isActive: boolean) =>
    cn(
      'rounded-full border px-5 py-2 text-sm transition-colors',
      isActive
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border hover:border-primary',
    )

  return (
    <>
      {showFilters && categories.length > 0 && (
        <nav aria-label="Filter projects" className="mb-10 flex flex-wrap gap-3">
          <button
            aria-pressed={!active}
            className={tabClass(!active)}
            onClick={() => select(null)}
            type="button"
          >
            All
          </button>
          {categories.map(({ slug, title }) => (
            <button
              aria-pressed={active === slug}
              className={tabClass(active === slug)}
              key={slug}
              onClick={() => select(slug)}
              type="button"
            >
              {title}
            </button>
          ))}
        </nav>
      )}

      <div
        className={cn('grid gap-4', layout === 'featured' ? 'md:grid-cols-2' : 'md:grid-cols-3')}
      >
        {visible.map((project, index) => (
          <ProjectCard
            key={project.slug}
            priority={index < 3}
            project={project}
            size={
              layout === 'featured'
                ? '(min-width: 768px) 50vw, 100vw'
                : '(min-width: 768px) 33vw, 100vw'
            }
          />
        ))}
      </div>
    </>
  )
}
