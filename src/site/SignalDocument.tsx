import React from 'react'

/** <html> and <body> of the original pages; the original scripts add classes to both while loading */
export const SignalDocument: React.FC<{
  bodyAttributes: Record<string, string>
  bodyClass: string
  children: React.ReactNode
}> = ({ bodyAttributes, bodyClass, children }) => (
  <html className="js" lang="en-US" suppressHydrationWarning>
    <body className={bodyClass} suppressHydrationWarning {...bodyAttributes}>
      {children}
    </body>
  </html>
)

/**
 * The original markup and scripts as server HTML, so the browser runs the scripts on load exactly
 * like the old site. Links in it are plain <a> tags: every page is a full load.
 */
export const SignalMarkup: React.FC<{ html: string; scripts: string }> = ({ html, scripts }) => (
  <>
    <div dangerouslySetInnerHTML={{ __html: html }} style={{ display: 'contents' }} />
    <div dangerouslySetInnerHTML={{ __html: scripts }} style={{ display: 'contents' }} />
  </>
)
