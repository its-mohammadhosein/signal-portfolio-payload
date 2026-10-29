/*
 * Puts the original Signal content into Payload, so every page renders from the CMS:
 *
 *   pnpm payload run scripts/signal/seed.ts
 *
 * Content and images come from the extracted pages (src/site/data, public/signal/wp).
 * Re-runnable: documents are matched by slug, title or file name and updated, nothing else is
 * deleted. Refuses to run in production unless ALLOW_SEED=true.
 */
import config from '@payload-config'
import path from 'path'
import { getPayload, type Payload } from 'payload'

import { content as home } from '@/site/data/home'
import { content as crystalVibes } from '@/site/data/portfolio-crystal-vibes'
import { content as radiant } from '@/site/data/portfolio-radiant'
import { content as work } from '@/site/data/work'

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
  throw new Error('Refusing to seed in production. Set ALLOW_SEED=true to override.')
}

const context = { disableRevalidate: true }
const publicDir = path.resolve(process.cwd(), 'public')

type Img = { alt: string; src: string }

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const slugOf = (href: string) => href.split('/').filter(Boolean).pop() || ''

/** Upload an image from public/signal/wp once; later runs reuse it */
const mediaCache = new Map<string, number>()
const media = async (payload: Payload, img: Img, alt?: string): Promise<number> => {
  const filename = path.basename(img.src)
  const cached = mediaCache.get(filename)
  if (cached) return cached

  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    where: { filename: { equals: filename } },
  })
  const id =
    existing.docs[0]?.id ??
    (
      await payload.create({
        collection: 'media',
        context,
        data: { alt: alt || img.alt || '' },
        filePath: path.join(publicDir, img.src),
      })
    ).id
  mediaCache.set(filename, id)
  return id
}

const upsert = async <T extends 'categories' | 'forms' | 'pages' | 'projects'>(
  payload: Payload,
  collection: T,
  where: Record<string, { equals: string }>,
  data: Record<string, unknown>,
) => {
  const existing = await payload.find({ collection, depth: 0, limit: 1, pagination: false, where })
  const doc = existing.docs[0]
  const args = { collection, context, data: data as never, depth: 0 }
  return doc ? payload.update({ ...args, id: doc.id }) : payload.create(args)
}

const seed = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Seeding the Signal content…')

  // -- categories, in the original filter order
  const categoryIds: Record<string, number> = {}
  for (const { slug, title } of work.categories) {
    const doc = await upsert(payload, 'categories', { slug: { equals: slug } }, { slug, title })
    categoryIds[slug] = doc.id as number
  }

  // -- contact form (field names match public/signal/site.js)
  const form = await upsert(
    payload,
    'forms',
    { title: { equals: 'Signal Contact Form' } },
    {
      confirmationMessage: richText('Thank you, we will be in touch soon.'),
      confirmationType: 'message',
      fields: [
        { blockType: 'text', label: 'First Name', name: 'firstName', required: true, width: 50 },
        { blockType: 'text', label: 'Last Name', name: 'lastName', required: true, width: 50 },
        { blockType: 'email', label: 'Email Address', name: 'email', required: true, width: 50 },
        { blockType: 'text', label: 'Phone Number', name: 'phone', width: 50 },
        { blockType: 'checkbox', label: 'Analytics', name: 'interestAnalytics', width: 25 },
        { blockType: 'checkbox', label: 'PPC Advertising', name: 'interestPpc', width: 25 },
        { blockType: 'checkbox', label: 'SEO', name: 'interestSeo', width: 25 },
        { blockType: 'checkbox', label: 'Web Design', name: 'interestWebDesign', width: 25 },
      ],
      submitButtonLabel: 'Schedule a Call',
      title: 'Signal Contact Form',
    },
  )

  // -- projects: card data from the work page, case-study content from the two crawled pages
  const caseStudies = { 'crystal-vibes': crystalVibes, radiant: radiant } as const
  const projectIds: Record<string, number> = {}
  for (const item of work.work) {
    const slug = slugOf(item.href)
    const study = caseStudies[slug as keyof typeof caseStudies]
    const thumbnail = await media(payload, item.image, item.title)
    const rows = study ? study.gallery : []
    const heroImage = rows[0] ? await media(payload, rows[0].image, item.title) : thumbnail
    const gallery = []
    for (const row of rows.slice(1)) {
      gallery.push({ image: await media(payload, row.image, item.title), layout: row.layout })
    }

    const doc = await upsert(
      payload,
      'projects',
      { slug: { equals: slug } },
      {
        _status: 'published',
        body: study ? richText(study.body) : undefined,
        categories: item.categories.map((c) => categoryIds[c]),
        gallery,
        heroImage,
        publishedAt: new Date(`${item.date} UTC`).toISOString(),
        services: study ? study.services : [],
        slug,
        tagline: study?.tagline || '',
        thumbnail,
        title: item.title,
      },
    )
    projectIds[slug] = doc.id as number
  }

  // "Other Work" picks, once every project exists
  for (const [slug, study] of Object.entries(caseStudies)) {
    await payload.update({
      collection: 'projects',
      context,
      data: { relatedProjects: study.other.map((o) => projectIds[slugOf(o.href)]).filter(Boolean) },
      id: projectIds[slug],
    })
  }

  // -- home page
  const D = home
  const services = []
  for (const service of D.services) {
    services.push({
      bullets: service.bullets.map((text) => ({ text })),
      image: await media(payload, { alt: service.title, src: service.image }),
      title: service.title,
    })
  }
  const trailImages = []
  for (const img of D.heroTrail) trailImages.push(await media(payload, img))
  const noiseImages = []
  for (const img of D.noise.images) noiseImages.push(await media(payload, img))

  await upsert(
    payload,
    'pages',
    { slug: { equals: 'home' } },
    {
      _status: 'published',
      hero: {
        headline: D.heroLines.join('\n'),
        metaLabels: D.heroMeta.map((text) => ({ text })),
        trailImages,
        type: 'signal',
      },
      layout: [
        {
          blockType: 'services',
          heading: D.introText,
          items: services,
          links: [{ link: { label: D.introCtaLabel, type: 'custom', url: D.introCtaHref } }],
        },
        {
          align: 'center',
          blockType: 'statement',
          revealOnScroll: true,
          text: D.noise.segments.join(' [image] '),
          trailImages: noiseImages,
        },
        {
          blockType: 'projectsGrid',
          heading: D.workHeading,
          limit: 6,
          populateBy: 'all',
          showFilters: true,
        },
        // The showreel section is kept without its video
        { blockType: 'videoBand', height: '70', playLabel: D.video.label },
        {
          blockType: 'testimonials',
          items: D.testimonials.map(({ name, quote, role }) => ({ name, quote, role })),
        },
      ],
      slug: 'home',
      title: 'Home',
    },
  )

  // -- globals
  await payload.updateGlobal({
    context,
    data: {
      cta: { appearance: 'pill', label: D.ctaLabel, type: 'custom', url: D.ctaHref },
      logoText: D.logoText,
      navItems: D.menu.map(({ href, label }) => ({
        link: { label, type: 'custom' as const, url: href },
      })),
    },
    slug: 'header',
  })
  await payload.updateGlobal({
    context,
    data: {
      contact: { enabled: true, form: form.id as number },
      email: D.email,
      wordmark: D.wordmark,
    },
    slug: 'footer',
  })

  payload.logger.info(
    `Seeded ${Object.keys(projectIds).length} projects, ${Object.keys(categoryIds).length} categories, ${mediaCache.size} images, the home page, the contact form and the globals.`,
  )
}

await seed()
process.exit(0)
