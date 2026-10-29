import React from 'react'

import type { SiteImage, WorkItem } from '../types'

import { loadChrome, type SiteChrome } from '../chrome'
import { CrystalVibesGalleryHalfColumn } from '../components/portfolio/CrystalVibesGalleryHalfColumn'
import { CrystalVibesGalleryRowHalf } from '../components/portfolio/CrystalVibesGalleryRowHalf'
import { CrystalVibesMain } from '../components/portfolio/CrystalVibesMain'
import { GalleryRowFull } from '../components/portfolio/GalleryRowFull'
import { OtherWorkItem } from '../components/portfolio/OtherWorkItem'
import { RadiantGalleryHalfColumn } from '../components/portfolio/RadiantGalleryHalfColumn'
import { RadiantGalleryRowHalf } from '../components/portfolio/RadiantGalleryRowHalf'
import { RadiantMain } from '../components/portfolio/RadiantMain'
import { PostGridFilters } from '../components/PostGridFilters'
import { SalientImage } from '../components/SalientImage'
import { SiteShell } from '../components/SiteShell'
import { layoutFor, type ProjectContent } from '../portfolio'
import { loadWorkItems, originalCategories } from '../projects'

/*
 * The two crawled case studies are laid out differently (Crystal Vibes: <p> title, <h1> tagline,
 * eager images; Radiant: <h1> title, <h2> tagline, lazy images). Other projects use Radiant's.
 */
const layouts = {
  'crystal-vibes': {
    HalfColumn: CrystalVibesGalleryHalfColumn,
    lazy: false,
    Main: CrystalVibesMain,
    RowHalf: CrystalVibesGalleryRowHalf,
  },
  radiant: {
    HalfColumn: RadiantGalleryHalfColumn,
    lazy: true,
    Main: RadiantMain,
    RowHalf: RadiantGalleryRowHalf,
  },
}

type Layout = (typeof layouts)[keyof typeof layouts]

const galleryImage = (image: SiteImage, lazy: boolean, priority = false) => (
  <SalientImage
    attributes={{ 'data-animation': 'none', 'data-delay': '0' }}
    className={lazy ? 'img-with-animation skip-lazy nectar-lazy' : 'img-with-animation skip-lazy'}
    image={image}
    lazy={lazy}
    priority={priority}
    responsive
  />
)

/** Full-width images get their own row, consecutive half-width images share one */
const galleryRows = (rows: ProjectContent['rows'], { HalfColumn, lazy, RowHalf }: Layout) => {
  const out: React.ReactNode[] = []
  let halves: SiteImage[] = []
  const flush = () => {
    if (!halves.length) return
    const id = `fws_signal_${out.length}`
    out.push(
      <RowHalf
        columns={halves.map((image, i) => (
          <HalfColumn image={galleryImage(image, true)} key={i} />
        ))}
        id={id}
        key={id}
      />,
    )
    halves = []
  }
  for (const row of rows) {
    if (row.layout === 'half') {
      halves.push(row.image)
      if (halves.length === 2) flush()
    } else {
      flush()
      const id = `fws_signal_${out.length}`
      out.push(
        <GalleryRowFull id={id} image={galleryImage(row.image, lazy, out.length === 0)} key={id} />,
      )
    }
  }
  flush()
  return out
}

export async function ProjectPage({ content, slug }: { content: ProjectContent; slug: string }) {
  const [chrome, allWork] = await Promise.all([loadChrome(), loadWorkItems()])
  return <ProjectView allWork={allWork} chrome={chrome} content={content} slug={slug} />
}

/** A case study; allWork is every project, for the filter counts above Other Work */
export function ProjectView({
  allWork,
  chrome,
  content,
  slug,
}: {
  allWork: WorkItem[]
  chrome: SiteChrome
  content: ProjectContent
  slug: string
}) {
  const layout = layouts[layoutFor(slug)]
  const { Main } = layout

  return (
    <SiteShell chrome={chrome} path={`/portfolio/${slug}`}>
      <Main
        body={content.body.join(' ')}
        expertises={content.expertises.map((text) => (
          <span key={text}>{text}</span>
        ))}
        galleryRows={galleryRows(content.rows, layout)}
        otherFilters={<PostGridFilters order={originalCategories} projects={allWork} />}
        otherItems={content.other.map((project) => (
          <OtherWorkItem
            categories={project.categories.map((c) => c.slug).join(' ')}
            href={project.href}
            id={project.id}
            image={
              <SalientImage
                className="nectar-lazy skip-lazy nectar-post-grid-item-bg__media"
                decoding={false}
                image={project.image}
                lazy
                responsive
              />
            }
            key={project.id}
            title={project.title}
          />
        ))}
        otherWorkHeading={content.otherHeading}
        services={content.services.map((text) => (
          <span key={text}>{text}</span>
        ))}
        tagline={content.tagline}
        title={content.title}
      />
    </SiteShell>
  )
}
