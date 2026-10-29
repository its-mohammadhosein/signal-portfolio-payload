import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import type { Project, ProjectsGridBlock as ProjectsGridBlockProps } from '@/payload-types'

import { ProjectsFilters } from './Filters.client'

export const ProjectsGridBlock: React.FC<ProjectsGridBlockProps & { id?: string }> = async (
  props,
) => {
  const { heading, layout, limit, populateBy, selectedProjects, showFilters } = props

  let projects: Project[] = []

  if (populateBy === 'selection') {
    projects = (selectedProjects || []).filter(
      (project): project is Project => typeof project === 'object',
    )
  } else {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'projects',
      depth: 1,
      draft: false,
      limit: limit || 12,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
    })

    projects = result.docs
  }

  return (
    <div className="container">
      {heading && <h2 className="mb-10 text-h2">{heading}</h2>}
      {/* useSearchParams in the filters needs a Suspense boundary for static rendering */}
      <Suspense fallback={null}>
        <ProjectsFilters layout={layout} projects={projects} showFilters={showFilters} />
      </Suspense>
    </div>
  )
}
