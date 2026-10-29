import type { Metadata } from 'next'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ProjectCard } from '@/components/ProjectCard'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Project } from '@/payload-types'

import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

type GalleryItem = NonNullable<Project['gallery']>[number]

/** Consecutive half-width images pair up two-up, everything else gets its own row */
const groupGallery = (items: GalleryItem[]): GalleryItem[][] => {
  const rows: GalleryItem[][] = []

  for (const item of items) {
    const last = rows[rows.length - 1]

    if (item.layout === 'half' && last && last[0].layout === 'half' && last.length < 2) {
      last.push(item)
    } else {
      rows.push([item])
    }
  }

  return rows
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/portfolio/' + decodedSlug
  const project = await queryProjectBySlug({ slug: decodedSlug })

  if (!project) return <PayloadRedirects url={url} />

  const { title, tagline, heroImage, body, categories, services, gallery } = project
  const expertises = (categories || []).flatMap((category) =>
    typeof category === 'object' ? [category.title] : [],
  )
  const otherWork = await queryOtherWork(project)

  return (
    <article className="pt-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <header className="container pb-12 md:pb-16">
        <h1 className="text-display">{title}</h1>
        {tagline && <p className="mt-4 text-h2">{tagline}</p>}
      </header>

      {heroImage && typeof heroImage === 'object' && (
        <Media imgClassName="h-auto w-full" priority resource={heroImage} size="100vw" />
      )}

      <section className="container grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <div className="md:col-span-2">{body && <RichText data={body} enableGutter={false} />}</div>

        <dl className="flex flex-col gap-8">
          {expertises.length > 0 && (
            <div>
              <dt className="mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                Expertises
              </dt>
              <dd>{expertises.join(', ')}</dd>
            </div>
          )}
          {services && services.length > 0 && (
            <div>
              <dt className="mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                Services
              </dt>
              <dd>{services.join(', ')}</dd>
            </div>
          )}
        </dl>
      </section>

      {gallery && gallery.length > 0 && (
        <section className="container flex flex-col gap-4 pb-16 md:pb-24">
          {groupGallery(gallery).map((row, rowIndex) => (
            <div
              className={row[0].layout === 'half' ? 'grid gap-4 md:grid-cols-2' : undefined}
              key={rowIndex}
            >
              {row.map(({ id, image }) =>
                image && typeof image === 'object' ? (
                  <Media
                    imgClassName="h-auto w-full"
                    key={id || image.id}
                    resource={image}
                    size={row[0].layout === 'half' ? '(min-width: 768px) 50vw, 100vw' : '100vw'}
                  />
                ) : null,
              )}
            </div>
          ))}
        </section>
      )}

      {otherWork.length > 0 && (
        <section className="container pb-24 md:pb-32">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="text-h2">Other Work</h2>
            <Link className="underline-offset-4 hover:underline" href="/work">
              View All
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {otherWork.map((other) => (
              <ProjectCard key={other.id} project={other} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug({ slug: decodedSlug })

  return generateMeta({ doc: project })
}

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

/** The editor's picks, or the 3 most recent other published projects when none are set */
const queryOtherWork = async (project: Project): Promise<Project[]> => {
  const picked = (project.relatedProjects || []).filter(
    (related): related is Project => typeof related === 'object',
  )

  if (picked.length > 0) return picked

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    draft: false,
    limit: 3,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: {
      id: {
        not_equals: project.id,
      },
    },
  })

  return result.docs
}
