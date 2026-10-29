import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { socialPlatforms } from './config'

const platformLabels = Object.fromEntries(socialPlatforms.map((p) => [p.value, p.label]))

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const { email, socialLinks, wordmark } = footerData
  const socials = socialLinks || []

  return (
    <footer className="mt-auto bg-ink text-paper" data-section-theme="ink">
      <div className="container py-16 md:py-24 flex flex-col gap-16">
        <div className="grid gap-12 md:grid-cols-2">
          {email && (
            <div className="flex flex-col gap-3">
              <h2 className="text-h3">Say Hello</h2>
              <a className="hover:text-primary transition-colors" href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          )}

          {socials.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-h3">Get Social</h2>
              <ul className="flex flex-col gap-1">
                {socials.map(({ id, platform, url }) => (
                  <li key={id}>
                    <a
                      className="hover:text-primary transition-colors"
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {platformLabels[platform] || platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Decorative sign-off, not a heading: the hero already holds the page's h1 */}
        {wordmark && (
          <p aria-hidden="true" className="text-display uppercase leading-none">
            {wordmark}
          </p>
        )}
      </div>
    </footer>
  )
}
