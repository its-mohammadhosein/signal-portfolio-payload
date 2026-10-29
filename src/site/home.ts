import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Page } from '@/payload-types'

import { resolveLink, toImage } from './chrome'
import { content as defaults } from './data/home'
import type { SiteImage, SiteLink } from './types'

/** The home page's own content (the header and footer come from the globals) */
export type HomeContent = {
  heroLines: string[]
  heroMeta: [string, string, string]
  heroTrail: SiteImage[]
  intro: { cta: SiteLink; text: string }
  noise: { images: SiteImage[]; segments: string[] }
  services: { bullets: string[]; image: string; title: string }[]
  testimonials: { icon?: string; name: string; quote: string; role: string }[]
  video: { href: string; label: string; src: string }
  workHeading: string
}

export const defaultHomeContent: HomeContent = {
  heroLines: defaults.heroLines,
  heroMeta: defaults.heroMeta as [string, string, string],
  heroTrail: defaults.heroTrail,
  intro: {
    cta: { href: defaults.introCtaHref, label: defaults.introCtaLabel },
    text: defaults.introText,
  },
  noise: defaults.noise,
  services: defaults.services,
  testimonials: defaults.testimonials,
  // The showreel section is kept, its video is not migrated
  video: { href: '', label: defaults.video.label, src: '' },
  workHeading: defaults.workHeading,
}

const images = (list: unknown) =>
  ((list as unknown[]) || []).map(toImage).filter((img): img is SiteImage => Boolean(img))

type Block = NonNullable<Page['layout']>[number]
const firstBlock = <K extends Block['blockType']>(layout: Block[], type: K) =>
  layout.find((block) => block.blockType === type) as Extract<Block, { blockType: K }> | undefined

/** The `home` page in Payload; anything not set keeps the original site's content */
export const loadHomeContent = async (): Promise<HomeContent> => {
  const content: HomeContent = structuredClone(defaultHomeContent)
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'pages',
    depth: 2,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: 'home' } },
  })
  const page = docs[0]
  if (!page) return content

  const { hero } = page
  if (hero?.type === 'signal') {
    const lines = (hero.headline || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (lines.length) content.heroLines = lines
    const meta = (hero.metaLabels || []).map(({ text }) => text)
    if (meta.length) content.heroMeta = [meta[0] || '', meta[1] || '', meta[2] || '']
    const trail = images(hero.trailImages)
    if (trail.length) content.heroTrail = trail
  }

  const layout = page.layout || []

  const services = firstBlock(layout, 'services')
  if (services) {
    if (services.heading) content.intro.text = services.heading
    const link = resolveLink(services.links?.[0]?.link)
    if (link) content.intro.cta = link
    if (services.items?.length) {
      content.services = services.items.map((item, i) => ({
        bullets: (item.bullets || []).map(({ text }) => text),
        image: toImage(item.image)?.src || defaultHomeContent.services[i % 6].image,
        title: item.title,
      }))
    }
  }

  const statement = firstBlock(layout, 'statement')
  if (statement?.text) {
    const inline = images(statement.trailImages)
    content.noise = {
      images: inline.length ? inline : defaultHomeContent.noise.images,
      segments: statement.text.split('[image]').map((part) => part.trim()),
    }
  }

  const grid = firstBlock(layout, 'projectsGrid')
  if (grid?.heading) content.workHeading = grid.heading

  const testimonials = firstBlock(layout, 'testimonials')
  if (testimonials?.items?.length) {
    const icons = defaultHomeContent.testimonials
    content.testimonials = testimonials.items.map((item, i) => ({
      icon: icons[i % icons.length]?.icon,
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
      src: toImage(video.backgroundVideo)?.src || '',
    }
  }

  return content
}
