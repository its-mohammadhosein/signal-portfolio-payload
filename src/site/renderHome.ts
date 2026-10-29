import type { HomeContent, SiteImage } from './content'

import { markup, scripts, templates as T } from './generated/home'

const escape = (value: string | number | undefined | null) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

/** Values are inserted as-is, so callers escape text and pass pre-rendered HTML for lists */
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '')

const image = (template: string, img: SiteImage) =>
  fill(template, {
    alt: escape(img.alt),
    height: escape(img.height),
    src: escape(img.src),
    srcset: escape(img.srcset || `${img.src} ${img.width}w`),
    width: escape(img.width),
  })

const isCurrent = (href: string, path: string) =>
  path === '/' ? href === '/' || href.startsWith('/#') : href === path

/** The original home page markup with the content filled in, plus the original scripts */
export const renderHome = (content: HomeContent, path = '/') => {
  const work = content.work.items
  const countIn = (slug: string) => work.filter((item) => item.categories.includes(slug)).length

  // Text between the inline images, in the original spacing: "In a <img> world full of ..."
  const noise = content.noise.segments
    .map((segment, i) => {
      const img = content.noise.images[i]
      return (
        escape(segment) +
        (img && i < content.noise.segments.length - 1 ? ' ' + image(T.inlineImage, img) + ' ' : '')
      )
    })
    .join('')

  const html = fill(markup, {
    contactFormId: escape(content.contactFormId),
    ctaHref: escape(content.cta.href),
    ctaLabel: escape(content.cta.label),
    email: escape(content.email),
    emailHref: escape(content.email ? `mailto:${content.email}` : '#'),
    heroLines: content.heroLines.map((text) => fill(T.heroLine, { text: escape(text) })).join(''),
    heroMeta1: escape(content.heroMeta[0]),
    heroMeta2: escape(content.heroMeta[1]),
    heroMeta3: escape(content.heroMeta[2]),
    heroTrail: content.heroTrail.map((img) => image(T.trailImage, img)).join(''),
    introCtaHref: escape(content.intro.cta.href),
    introCtaLabel: escape(content.intro.cta.label),
    introText: escape(content.intro.text),
    logoText: escape(content.logoText),
    menuItems: content.menu
      .map(({ href, label }) =>
        fill(T.menuItem, {
          ariaCurrent: isCurrent(href, path) ? ' aria-current="page"' : '',
          current: isCurrent(href, path) ? ' current-menu-item' : '',
          href: escape(href),
          label: escape(label),
        }),
      )
      .join('\n'),
    noiseContent: noise,
    // Each card keeps the original card's markup at the same position (colour layers differ per card)
    serviceCards: content.services
      .map((service, i) =>
        fill(T.serviceCards[i % T.serviceCards.length], {
          badges: service.bullets.map((text) => fill(T.badge, { text: escape(text) })).join(''),
          image: escape(service.image),
          title: escape(service.title),
        }),
      )
      .join(''),
    socials: content.socials
      .map(({ href, label }) => fill(T.social, { href: escape(href), label: escape(label) }))
      .join(''),
    testimonials: content.testimonials
      .map((item) =>
        fill(T.testimonial, {
          icon: escape(item.icon),
          name: escape(item.name),
          quote: escape(item.quote),
          role: escape(item.role),
        }),
      )
      .join(''),
    videoBg: content.video.src ? fill(T.videoBg, { src: escape(content.video.src) }) : '',
    videoCta: content.video.href
      ? fill(T.videoCta, { href: escape(content.video.href), label: escape(content.video.label) })
      : '',
    wordmark: escape(content.wordmark),
    workFilters: [
      fill(T.filterAll, { count: String(work.length), label: 'All' }),
      ...content.work.categories
        .filter(({ slug }) => countIn(slug) > 0)
        .map(({ slug, title }) =>
          fill(T.filter, {
            count: String(countIn(slug)),
            label: escape(title),
            slug: escape(slug),
          }),
        ),
    ].join(''),
    workHeading: escape(content.work.heading),
    workItems: work
      .map((item) =>
        image(
          fill(T.workItem, {
            categories: escape(item.categories.join(' ')),
            href: escape(item.href),
            id: escape(item.id),
            title: escape(item.title),
            // image tokens are filled below
            alt: '{{alt}}',
            height: '{{height}}',
            src: '{{src}}',
            srcset: '{{srcset}}',
            width: '{{width}}',
          }),
          item.image,
        ),
      )
      .join(''),
  })

  return { html, scripts }
}
