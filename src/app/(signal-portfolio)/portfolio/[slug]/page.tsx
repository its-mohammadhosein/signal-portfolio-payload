import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { ProjectPage } from '@/site/pages/ProjectPage'
import { loadProjectContent, portfolioSlugs } from '@/site/portfolio'

type Args = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await portfolioSlugs()).map((slug) => ({ slug }))
}

export default async function Page({ params }: Args) {
  const slug = decodeURIComponent((await params).slug)
  const content = await loadProjectContent(slug)
  if (!content) notFound()
  return <ProjectPage content={content} slug={slug} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const content = await loadProjectContent(decodeURIComponent((await params).slug))
  return { title: content ? `${content.title} – Signal` : 'Signal' }
}
