import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Project } from '@/payload-types'

import { toImage } from './chrome'
import { content as crystalVibes } from './data/portfolio-crystal-vibes'
import { content as radiant } from './data/portfolio-radiant'
import { defaultProjects, loadProjects, toWorkItem } from './projects'
import type { SiteImage, WorkItem } from './types'

/*
 * The two case studies in the crawl are laid out differently (Crystal Vibes puts the title in a <p>
 * and the tagline in the <h1>, Radiant uses <h1> and <h2>), so each keeps its own markup. Projects
 * the crawl never had a page for use Radiant's.
 */
const crawled = { 'crystal-vibes': crystalVibes, radiant } as const

/** Which original layout a project uses */
export const layoutFor = (slug: string): keyof typeof crawled =>
  slug in crawled ? (slug as keyof typeof crawled) : 'radiant'

export type ProjectContent = {
  body: string[]
  expertises: string[]
  other: WorkItem[]
  otherHeading: string
  rows: { image: SiteImage; layout: 'full' | 'half' }[]
  services: string[]
  tagline: string
  title: string
}

const bySlug = (slug: string) => defaultProjects.find((p) => p.slug === slug)

/** The crawled content for this slug, or what the original work page knew about the project */
export const defaultProjectContent = (slug: string): ProjectContent | null => {
  const D = crawled[slug as keyof typeof crawled]
  if (D) {
    return {
      body: [D.body],
      expertises: D.expertises,
      other: D.other.map((item) => {
        const project = bySlug(item.href.split('/').filter(Boolean).pop() || '')
        return { ...(project as WorkItem), image: item.image }
      }),
      otherHeading: D.otherWorkHeading,
      rows: D.gallery.map((g) => ({ image: g.image, layout: g.layout as 'full' | 'half' })),
      services: D.services,
      tagline: D.tagline,
      title: D.title,
    }
  }
  const project = bySlug(slug)
  if (!project) return null
  return {
    body: [],
    expertises: project.categories.map((c) => c.title),
    other: defaultProjects.filter((p) => p.slug !== slug).slice(0, 3),
    otherHeading: 'Other Work',
    rows: [{ image: project.image, layout: 'full' }],
    services: [],
    tagline: '',
    title: project.title,
  }
}

/** Plain paragraphs of a Lexical rich text value (the original body is one paragraph of text) */
const paragraphs = (richText: Project['body']): string[] => {
  const nodes = (richText?.root?.children || []) as { children?: { text?: string }[] }[]
  return nodes
    .map((node) => (node.children || []).map((child) => child.text || '').join(''))
    .filter((text) => text.trim())
}

const fromPayload = async (
  project: Project,
  fallback: ProjectContent | null,
): Promise<ProjectContent> => {
  const hero = toImage(project.heroImage)
  const gallery = (project.gallery || []).flatMap(({ image, layout }) => {
    const img = toImage(image)
    return img ? [{ image: img, layout: (layout || 'full') as 'full' | 'half' }] : []
  })
  const related = (project.relatedProjects || []).filter((p): p is Project => typeof p === 'object')
  let other = related.map(toWorkItem)
  if (!other.length) {
    const recent = (await loadProjects(4)) || []
    other = recent
      .filter((p) => p.id !== project.id)
      .slice(0, 3)
      .map(toWorkItem)
  }
  const body = paragraphs(project.body)
  const expertises = toWorkItem(project).categories.map((c) => c.title)

  return {
    body: body.length ? body : fallback?.body || [],
    expertises: expertises.length ? expertises : fallback?.expertises || [],
    other: other.length ? other : fallback?.other || [],
    otherHeading: fallback?.otherHeading || 'Other Work',
    rows: hero ? [{ image: hero, layout: 'full' }, ...gallery] : fallback?.rows || [],
    services: project.services?.length ? project.services : fallback?.services || [],
    tagline: project.tagline || fallback?.tagline || '',
    title: project.title,
  }
}

export const loadProjectContent = async (slug: string): Promise<ProjectContent | null> => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 2,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  const fallback = defaultProjectContent(slug)
  return docs[0] ? fromPayload(docs[0], fallback) : fallback
}

/** Slugs to prebuild: every published project, or the original five before seeding */
export const portfolioSlugs = async () => {
  const projects = await loadProjects()
  return (
    projects ? projects.map((p) => p.slug as string) : defaultProjects.map((p) => p.slug)
  ).filter(Boolean)
}
