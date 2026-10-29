import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category as CategoryDoc, Project } from '@/payload-types'

import { toImage } from './chrome'
import { defaults as workDefaults } from './generated/work'
import { formatDate, type Category, type WorkItem } from './render'

export const originalCategories: Category[] = workDefaults.categories

const categoryTitle = (slug: string) =>
  originalCategories.find((c) => c.slug === slug)?.title || slug

/** The five projects of the original work page, used until projects exist in Payload */
export const defaultProjects: WorkItem[] = workDefaults.work.map((item, i) => {
  const slug = item.href.split('/').filter(Boolean).pop() || ''
  return {
    categories: item.categories.map((c) => ({ slug: c, title: categoryTitle(c) })),
    date: item.date,
    href: item.href,
    id: String(i + 1),
    image: item.image,
    slug,
    title: item.title,
  }
})

export const toWorkItem = (project: Project): WorkItem => ({
  categories: (project.categories || [])
    .filter((c): c is CategoryDoc => typeof c === 'object' && Boolean(c.slug))
    .map((c) => ({ slug: c.slug as string, title: c.title })),
  date: formatDate(project.publishedAt),
  href: `/portfolio/${project.slug}`,
  id: String(project.id),
  image: toImage(project.thumbnail || project.heroImage) || defaultProjects[0].image,
  slug: project.slug as string,
  title: project.title,
})

/** Published projects, newest first; null when Payload has none yet */
export const loadProjects = async (limit = 100): Promise<Project[] | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    draft: false,
    limit,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
  })
  return result.docs.length ? result.docs : null
}

export const loadWorkItems = async (limit?: number): Promise<WorkItem[]> => {
  const projects = await loadProjects(limit)
  const items = projects ? projects.map(toWorkItem) : defaultProjects
  return limit ? items.slice(0, limit) : items
}
