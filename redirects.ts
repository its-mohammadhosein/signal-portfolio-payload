import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // The source has no /portfolio index, the project grid lives at /work
  const portfolioRedirect = {
    destination: '/work',
    permanent: true,
    source: '/portfolio',
  }

  return [internetExplorerRedirect, portfolioRedirect]
}
