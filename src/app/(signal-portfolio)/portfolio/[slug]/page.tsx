import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { loadProjectContent, portfolioPage, portfolioSlugs } from '@/site/portfolio'
import { SignalMarkup } from '@/site/SignalDocument'

type Args = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await portfolioSlugs()).map((slug) => ({ slug }))
}

export default async function ProjectPage({ params }: Args) {
  const { slug } = await params
  const page = await portfolioPage(decodeURIComponent(slug))
  if (!page) notFound()
  return <SignalMarkup {...page} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const content = await loadProjectContent(decodeURIComponent(slug))
  return { title: content ? `${content.title} – Signal` : 'Signal' }
}
