import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category, Media, Page, Project } from '@/payload-types'

import { socialPlatforms } from '@/Footer/config'
import { collectionPrefixMap } from '@/utilities/collectionPrefix'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { defaultHomeContent, type HomeContent, type SiteImage, type SiteLink } from './content'

type CMSLinkData = {
  label?: string | null
  reference?: { relationTo: keyof typeof collectionPrefixMap; value: unknown } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

const resolveLink = (link: CMSLinkData | null | undefined): SiteLink | null => {
  if (!link?.label) return null

  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const slug = (link.reference.value as { slug?: string }).slug
    const prefix = collectionPrefixMap[link.reference.relationTo]
    const href =
      link.reference.relationTo === 'pages' && slug === 'home' ? '/' : `${prefix}/${slug}`
    return { href, label: link.label }
  }

  return link.url ? { href: link.url, label: link.label } : null
}

const toImage = (media: Media | number | null | undefined): SiteImage | null => {
  if (!media || typeof media !== 'object' || !media.url) return null
  return {
    alt: media.alt || '',
    height: media.height || 0,
    src: media.url,
    width: media.width || 0,
  }
}

const images = (list: (Media | number)[] | null | undefined) =>
  (list || []).map(toImage).filter((img): img is SiteImage => Boolean(img))

const platformLabels: Record<string, string> = Object.fromEntries(
  socialPlatforms.map((p) => [p.value, p.label]),
)

type Block = NonNullable<Page['layout']>[number]
const firstBlock = <T extends Block['blockType']>(layout: Block[], type: T) =>
  layout.find((block) => block.blockType === type) as Extract<Block, { blockType: T }> | undefined

/**
 * Home page content from Payload: header and footer globals, the `home` page and the projects.
 * Anything not set falls back to the original site's content, so the page is complete before seeding.
 */
export const loadHomeContent = async (): Promise<HomeContent> => {
  const content: HomeContent = structuredClone(defaultHomeContent)
  const payload = await getPayload({ config: configPromise })

  const [header, footer, pages, projects] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('footer', 1)(),
    payload.find({
      collection: 'pages',
      depth: 2,
      draft: false,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: { slug: { equals: 'home' } },
    }),
    payload.find({
      collection: 'projects',
      depth: 1,
      draft: false,
      limit: 6,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
    }),
  ])

  // -- header
  if (header.logoText) content.logoText = header.logoText
  const cta = resolveLink(header.cta as CMSLinkData)
  if (cta) content.cta = cta
  const menu = (header.navItems || []).map(({ link }) => resolveLink(link as CMSLinkData))
  if (menu.length) content.menu = menu.filter((item): item is SiteLink => Boolean(item))

  // -- footer
  if (footer.email) content.email = footer.email
  if (footer.wordmark) content.wordmark = footer.wordmark
  if (footer.socialLinks?.length) {
    content.socials = footer.socialLinks.map(({ platform, url }) => ({
      href: url,
      label: platformLabels[platform] || platform,
    }))
  }
  const form = footer.contact?.form
  if (footer.contact?.enabled !== false && form) {
    content.contactFormId = String(typeof form === 'object' ? form.id : form)
  }

  // -- home page
  const page = pages.docs[0]
  if (page) {
    const { hero } = page
    if (hero?.type === 'signal') {
      const lines = (hero.headline || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
      if (lines.length) content.heroLines = lines
      const meta = (hero.metaLabels || []).map(({ text }) => text)
      if (meta.length) content.heroMeta = [meta[0] || '', meta[1] || '', meta[2] || '']
      const trail = images(hero.trailImages as (Media | number)[])
      if (trail.length) content.heroTrail = trail
    }

    const layout = page.layout || []

    const services = firstBlock(layout, 'services')
    if (services) {
      if (services.heading) content.intro.text = services.heading
      const link = resolveLink(services.links?.[0]?.link as CMSLinkData)
      if (link) content.intro.cta = link
      if (services.items?.length) {
        content.services = services.items.map((item, i) => ({
          bullets: (item.bullets || []).map(({ text }) => text),
          image: toImage(item.image as Media)?.src || defaultHomeContent.services[i % 6].image,
          title: item.title,
        }))
      }
    }

    const statement = firstBlock(layout, 'statement')
    if (statement?.text) {
      const inline = images(statement.trailImages as (Media | number)[])
      content.noise = {
        images: inline.length ? inline : defaultHomeContent.noise.images,
        segments: statement.text.split('[image]').map((part) => part.trim()),
      }
    }

    const grid = firstBlock(layout, 'projectsGrid')
    if (grid?.heading) content.work.heading = grid.heading

    const testimonials = firstBlock(layout, 'testimonials')
    if (testimonials?.items?.length) {
      content.testimonials = testimonials.items.map((item, i) => ({
        icon: defaultHomeContent.testimonials[i % defaultHomeContent.testimonials.length]?.icon,
        name: item.name,
        quote: item.quote,
        role: item.role || '',
      }))
    }

    const video = firstBlock(layout, 'videoBand')
    if (video) {
      content.video = {
        href: video.externalVideoUrl || '',
        label: video.playLabel || defaultHomeContent.video.label,
        src: toImage(video.backgroundVideo as Media)?.src || '',
      }
    }
  }

  // -- projects
  if (projects.docs.length) {
    const used = new Map<string, string>()
    content.work.items = projects.docs.map((project: Project) => {
      const categories = (project.categories || []).filter(
        (c): c is Category => typeof c === 'object' && Boolean(c.slug),
      )
      categories.forEach((c) => used.set(c.slug as string, c.title))
      return {
        categories: categories.map((c) => c.slug as string),
        href: `/portfolio/${project.slug}`,
        id: String(project.id),
        image:
          toImage((project.thumbnail || project.heroImage) as Media) ||
          defaultHomeContent.work.items[0].image,
        title: project.title,
      }
    })
    content.work.categories = [...used.entries()]
      .map(([slug, title]) => ({ slug, title }))
      .sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }))
  }

  return content
}
