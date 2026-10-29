import { defaults } from './generated/home'

export type SiteImage = {
  alt: string
  height: number
  src: string
  srcset?: string
  width: number
}

export type SiteLink = { href: string; label: string }

export type WorkItem = {
  categories: string[]
  href: string
  id: string
  image: SiteImage
  title: string
}

/** Everything on the home page that comes from Payload. Defaults are the original site's content. */
export type HomeContent = {
  contactFormId: string
  cta: SiteLink
  email: string
  heroLines: string[]
  heroMeta: [string, string, string]
  heroTrail: SiteImage[]
  intro: { cta: SiteLink; text: string }
  logoText: string
  menu: SiteLink[]
  noise: { images: SiteImage[]; segments: string[] }
  services: { bullets: string[]; image: string; title: string }[]
  socials: SiteLink[]
  testimonials: { icon?: string; name: string; quote: string; role: string }[]
  video: { href: string; label: string; src: string }
  work: { categories: { slug: string; title: string }[]; heading: string; items: WorkItem[] }
  wordmark: string
}

const slugFromHref = (href: string) => href.split('/').filter(Boolean).pop() || ''
const workCategories = defaults.workCategories as Record<string, string[]>

export const defaultHomeContent: HomeContent = {
  contactFormId: '',
  cta: { href: defaults.ctaHref, label: defaults.ctaLabel },
  email: defaults.email,
  heroLines: defaults.heroLines,
  heroMeta: defaults.heroMeta as [string, string, string],
  heroTrail: defaults.heroTrail,
  intro: {
    cta: { href: defaults.introCtaHref, label: defaults.introCtaLabel },
    text: defaults.introText,
  },
  logoText: defaults.logoText,
  menu: defaults.menu,
  noise: defaults.noise,
  services: defaults.services,
  socials: defaults.socials,
  testimonials: defaults.testimonials,
  // The showreel section is kept, its video is not migrated
  video: { href: '', label: defaults.video.label, src: '' },
  work: {
    categories: defaults.categories,
    heading: defaults.workHeading,
    items: defaults.work.map((item, i) => ({
      ...item,
      categories: workCategories[slugFromHref(item.href)] || [],
      id: String(i + 1),
    })),
  },
  wordmark: defaults.wordmark,
}
