import React from 'react'

import { loadHomeContent } from '@/site/loadHomeContent'
import { renderHome } from '@/site/renderHome'

/*
 * The home page is the original Signal markup (src/site/generated/home.ts) with Payload content
 * filled in. The original Salient scripts are part of the server HTML, so the browser runs them on
 * load exactly as on the old site. Links are plain <a> tags, so every page is a full load.
 */
export default async function HomePage() {
  const { html, scripts } = renderHome(await loadHomeContent(), '/')

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} style={{ display: 'contents' }} />
      <div dangerouslySetInnerHTML={{ __html: scripts }} style={{ display: 'contents' }} />
    </>
  )
}
