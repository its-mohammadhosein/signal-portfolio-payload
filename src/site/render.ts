/** Helpers for filling the {{tokens}} of the generated Signal markup (see scripts/signal/extract.py) */

export type SiteImage = {
  alt: string
  height: number
  src: string
  srcset?: string
  width: number
}

export type SiteLink = { href: string; label: string }

export type Category = { slug: string; title: string }

export type WorkItem = {
  categories: Category[]
  date: string
  href: string
  id: string
  image: SiteImage
  slug: string
  title: string
}

export const escape = (value: string | number | undefined | null) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

/** Values go in as-is: escape text, pass pre-rendered HTML for lists. Unknown tokens become empty. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '')

export const imageValues = (img: SiteImage): Record<string, string> => ({
  alt: escape(img.alt),
  height: escape(img.height),
  src: escape(img.src),
  srcset: escape(img.srcset || `${img.src} ${img.width}w`),
  width: escape(img.width),
})

/** The template for position i: the original's items differ by position (eager, lazy, fetchpriority) */
export const atPosition = (templates: readonly string[], i: number) =>
  templates[Math.min(i, templates.length - 1)]

/** Items of a Salient post grid (Featured Work, the work page, Other Work) */
export const gridItems = (
  itemTemplates: readonly string[],
  categoryTemplate: string | undefined,
  items: WorkItem[],
) =>
  items
    .map((item, i) =>
      fill(atPosition(itemTemplates, i), {
        ...imageValues(item.image),
        categories: escape(item.categories.map((c) => c.slug).join(' ')),
        categoryLinks: categoryTemplate
          ? item.categories
              .map((c) => fill(categoryTemplate, { label: escape(c.title), slug: escape(c.slug) }))
              .join('')
          : '',
        date: escape(item.date),
        href: escape(item.href),
        id: escape(item.id),
        title: escape(item.title),
      }),
    )
    .join('')

/** "All" plus one tab per category that has projects, with Salient's counts (over every project) */
export const gridFilters = (
  templates: { filter: string; filterAll: string },
  items: WorkItem[],
  order: Category[],
) => {
  const count = (slug: string) =>
    items.filter((item) => item.categories.some((c) => c.slug === slug)).length
  const used = new Map<string, string>()
  items.forEach((item) => item.categories.forEach((c) => used.set(c.slug, c.title)))
  // Original order first, then any categories added in Payload, alphabetically
  const known = order.filter((c) => used.has(c.slug))
  const extra = [...used.entries()]
    .filter(([slug]) => !order.some((c) => c.slug === slug))
    .map(([slug, title]) => ({ slug, title }))
    .sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }))

  return [
    fill(templates.filterAll, { count: String(items.length), label: 'All' }),
    ...[...known, ...extra].map(({ slug, title }) =>
      fill(templates.filter, {
        count: String(count(slug)),
        label: escape(title),
        slug: escape(slug),
      }),
    ),
  ].join('')
}

export const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
        year: 'numeric',
      })
    : ''
