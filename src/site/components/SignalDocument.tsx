import React from 'react'

/** <html> and <body> of the original pages; the original scripts add classes to both while loading */
export function SignalDocument({
  bodyAttributes,
  bodyClass,
  children,
}: {
  bodyAttributes: Record<string, string>
  bodyClass: string
  children: React.ReactNode
}) {
  return (
    <html className="js" lang="en-US" suppressHydrationWarning>
      <body className={bodyClass} suppressHydrationWarning {...bodyAttributes}>
        {children}
      </body>
    </html>
  )
}
