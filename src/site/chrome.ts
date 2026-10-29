import { socialPlatforms } from '@/Footer/config'
import { collectionPrefixMap } from '@/utilities/collectionPrefix'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Media } from '@/payload-types'

import { defaults } from './generated/home'
import { escape, fill, type SiteImage, type SiteLink } from './render'

/** Header, off-canvas menu, contact form and footer: from the header and footer globals */
export type SiteChrome = {
  contactFormId: string
  cta: SiteLink
  email: string
  logoText: string
  menu: SiteLink[]
  socials: SiteLink[]
  wordmark: string
}

export const defaultChrome: SiteChrome = {
  contactFormId: '',
  cta: { href: defaults.ctaHref, label: defaults.ctaLabel },
  email: defaults.email,
  logoText: defaults.logoText,
  menu: defaults.menu,
  socials: defaults.socials,
  wordmark: defaults.wordmark,
}

type CMSLinkData = {
  label?: string | null
  reference?: { relationTo: keyof typeof collectionPrefixMap; value: unknown } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const resolveLink = (link: unknown): SiteLink | null => {
  const data = link as CMSLinkData | null | undefined
  if (!data?.label) return null

  if (data.type === 'reference' && data.reference && typeof data.reference.value === 'object') {
    const slug = (data.reference.value as { slug?: string }).slug
    const href =
      data.reference.relationTo === 'pages' && slug === 'home'
        ? '/'
        : `${collectionPrefixMap[data.reference.relationTo]}/${slug}`
    return { href, label: data.label }
  }

  return data.url ? { href: data.url, label: data.label } : null
}

export const toImage = (media: unknown): SiteImage | null => {
  const m = media as Media | null | undefined
  if (!m || typeof m !== 'object' || !m.url) return null
  return { alt: m.alt || '', height: m.height || 0, src: m.url, width: m.width || 0 }
}

const platformLabels: Record<string, string> = Object.fromEntries(
  socialPlatforms.map((p) => [p.value, p.label]),
)

export const loadChrome = async (): Promise<SiteChrome> => {
  const chrome: SiteChrome = structuredClone(defaultChrome)
  const [header, footer] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('footer', 1)(),
  ])

  if (header.logoText) chrome.logoText = header.logoText
  const cta = resolveLink(header.cta)
  if (cta) chrome.cta = cta
  const menu = (header.navItems || [])
    .map(({ link }) => resolveLink(link))
    .filter((item): item is SiteLink => Boolean(item))
  if (menu.length) chrome.menu = menu

  if (footer.email) chrome.email = footer.email
  if (footer.wordmark) chrome.wordmark = footer.wordmark
  if (footer.socialLinks?.length) {
    chrome.socials = footer.socialLinks.map(({ platform, url }) => ({
      href: url,
      label: platformLabels[platform] || platform,
    }))
  }
  const form = footer.contact?.form
  if (footer.contact?.enabled !== false && form) {
    chrome.contactFormId = String(typeof form === 'object' ? form.id : form)
  }

  return chrome
}

const isCurrent = (href: string, path: string) =>
  path === '/' ? href === '/' || href.startsWith('/#') : href === path

/** Token values for the parts shared by every page */
export const chromeValues = (
  chrome: SiteChrome,
  templates: { menuItem: string; social: string },
  path: string,
): Record<string, string> => ({
  contactFormId: escape(chrome.contactFormId),
  ctaHref: escape(chrome.cta.href),
  ctaLabel: escape(chrome.cta.label),
  email: escape(chrome.email),
  emailHref: escape(chrome.email ? `mailto:${chrome.email}` : '#'),
  logoText: escape(chrome.logoText),
  menuItems: chrome.menu
    .map(({ href, label }) =>
      fill(templates.menuItem, {
        ariaCurrent: isCurrent(href, path) ? ' aria-current="page"' : '',
        current: isCurrent(href, path) ? ' current-menu-item' : '',
        href: escape(href),
        label: escape(label),
      }),
    )
    .join('\n'),
  socials: chrome.socials
    .map(({ href, label }) => fill(templates.social, { href: escape(href), label: escape(label) }))
    .join(''),
  wordmark: escape(chrome.wordmark),
})
