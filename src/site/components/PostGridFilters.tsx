import React from 'react'

import type { Category, WorkItem } from '../types'

/**
 * The category tabs above a Salient post grid: "All" plus one per category that has projects,
 * with the counts the theme puts in data-total-count. Counts cover every project, as in the
 * original. Clicking is handled by public/signal/site.js.
 */
export function PostGridFilters({ order, projects }: { order: Category[]; projects: WorkItem[] }) {
  const count = (slug: string) =>
    projects.filter((project) => project.categories.some((c) => c.slug === slug)).length

  const used = new Map<string, string>()
  projects.forEach((project) => project.categories.forEach((c) => used.set(c.slug, c.title)))
  // The original order first, then categories added in Payload, alphabetically
  const known = order.filter((c) => used.has(c.slug))
  const extra = [...used.entries()]
    .filter(([slug]) => !order.some((c) => c.slug === slug))
    .map(([slug, title]) => ({ slug, title }))
    .sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }))

  return (
    <>
      <a className="active all-filter" data-filter="-1" data-total-count={projects.length} href="#">
        All
      </a>
      {[...known, ...extra].map(({ slug, title }) => (
        <a data-filter={slug} data-total-count={count(slug)} href="#" key={slug}>
          {title}
        </a>
      ))}
    </>
  )
}
