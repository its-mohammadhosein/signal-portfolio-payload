import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Project } from '@/payload-types'

import { chromeValues, loadChrome, toImage, type SiteChrome } from './chrome'
import * as crystalVibes from './generated/portfolio-crystal-vibes'
import * as radiant from './generated/portfolio-radiant'
import {
  defaultProjects,
  loadProjects,
  loadWorkItems,
  originalCategories,
  toWorkItem,
} from './projects'
import {
  escape,
  fill,
  gridFilters,
  gridItems,
  imageValues,
  type SiteImage,
  type WorkItem,
} from './render'

/*
 * The two case studies in the crawl are laid out differently (Crystal Vibes puts the title in a <p>
 * and the tagline in the <h1>, Radiant uses <h1> and <h2>), so each keeps its own markup. Projects
 * the crawl never had a page for use Radiant's.
 */
const pages = { 'crystal-vibes': crystalVibes, radiant } as const
type PageModule = (typeof pages)[keyof typeof pages]

const moduleFor = (slug: string): PageModule => pages[slug as keyof typeof pages] || radiant

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
  const crawled = pages[slug as keyof typeof pages]
  if (crawled) {
    const D = crawled.defaults
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

/** Full-width images get their own row, consecutive half-width images share one */
const renderRows = (T: PageModule['templates'], rows: ProjectContent['rows']) => {
  const out: string[] = []
  let halves: SiteImage[] = []
  const flush = () => {
    if (!halves.length) return
    const columns = halves.map((img) => fill(T.halfColumn, imageValues(img))).join('')
    out.push(fill(T.rowHalf, { columns, id: `fws_signal_${out.length}` }))
    halves = []
  }
  for (const row of rows) {
    if (row.layout === 'half') {
      halves.push(row.image)
      if (halves.length === 2) flush()
    } else {
      flush()
      const template = out.length === 0 ? T.rowFullFirst : T.rowFull
      out.push(fill(template, { ...imageValues(row.image), id: `fws_signal_${out.length}` }))
    }
  }
  flush()
  return out.join('')
}

/** `allWork` is every project: the filter counts above Other Work cover all of them, as in the original */
export const renderProject = (
  slug: string,
  content: ProjectContent,
  chrome: SiteChrome,
  allWork: WorkItem[],
) => {
  const { markup, scripts, templates: T } = moduleFor(slug)
  const list = (items: string[]) =>
    items.map((text) => fill(T.metaItem, { text: escape(text) })).join('')

  const html = fill(markup, {
    ...chromeValues(chrome, T, `/portfolio/${slug}`),
    body: content.body.map(escape).join('</p><p>'),
    expertises: list(content.expertises),
    galleryRows: renderRows(T, content.rows),
    otherFilters: gridFilters(T, allWork, originalCategories),
    otherItems: gridItems(T.otherItem, undefined, content.other),
    otherWorkHeading: escape(content.otherHeading),
    services: list(content.services),
    tagline: escape(content.tagline),
    title: escape(content.title),
  })

  return { html, scripts }
}

export const portfolioPage = async (slug: string) => {
  const content = await loadProjectContent(slug)
  if (!content) return null
  const [chrome, allWork] = await Promise.all([loadChrome(), loadWorkItems()])
  return renderProject(slug, content, chrome, allWork)
}

/** Slugs to prebuild: every published project, or the original five before seeding */
export const portfolioSlugs = async () => {
  const projects = await loadProjects()
  return (
    projects ? projects.map((p) => p.slug as string) : defaultProjects.map((p) => p.slug)
  ).filter(Boolean)
}
