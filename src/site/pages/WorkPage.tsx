import React from 'react'

import { loadChrome, type SiteChrome } from '../chrome'
import { PostGridFilters } from '../components/PostGridFilters'
import { SalientImage } from '../components/SalientImage'
import { SiteShell } from '../components/SiteShell'
import { WorkGridItem } from '../components/work/WorkGridItem'
import { WorkMain } from '../components/work/WorkMain'
import { loadWorkItems, originalCategories } from '../projects'
import type { WorkItem } from '../types'

/** The original loads the first two cards eagerly (data-lazy-skip="2"), the first with high priority */
const EAGER = 2

export async function WorkPage() {
  const [chrome, work] = await Promise.all([loadChrome(), loadWorkItems()])
  return <WorkView chrome={chrome} work={work} />
}

/** The work page for the given projects (newest first) */
export function WorkView({ chrome, work }: { chrome: SiteChrome; work: WorkItem[] }) {
  return (
    <SiteShell chrome={chrome} path="/work">
      <WorkMain
        workFilters={<PostGridFilters order={originalCategories} projects={work} />}
        workItems={work.map((project, i) => (
          <WorkGridItem
            categories={project.categories.map((c) => c.slug).join(' ')}
            categoryLinks={project.categories.map((c) => (
              <a className={`${c.slug} style-see-through-button`} href="/work" key={c.slug}>
                {c.title}
              </a>
            ))}
            date={project.date}
            href={project.href}
            id={project.id}
            image={
              <SalientImage
                className={
                  i < EAGER
                    ? 'nectar-post-grid-item-bg__media'
                    : 'nectar-lazy skip-lazy nectar-post-grid-item-bg__media'
                }
                image={project.image}
                lazy={i >= EAGER}
                priority={i === 0}
                responsive
              />
            }
            key={project.id}
            title={project.title}
          />
        ))}
      />
    </SiteShell>
  )
}
