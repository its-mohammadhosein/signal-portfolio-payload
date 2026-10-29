import React from 'react'

import type { SiteChrome } from '../chrome'

import { LegacyScripts, type LegacyScript } from './LegacyScripts'
import { MenuItem } from './MenuItem'
import { OffCanvasMenu } from './OffCanvasMenu'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SkipLink } from './SkipLink'
import { SocialLink } from './SocialLink'

const isCurrent = (href: string, path: string) =>
  path === '/' ? href === '/' || href.startsWith('/#') : href === path

/** Everything around a page's content: header, contact section, footer, menu and the original scripts */
export function SiteShell({
  chrome,
  children,
  path,
  scripts,
}: {
  chrome: SiteChrome
  children: React.ReactNode
  path: string
  scripts: LegacyScript[]
}) {
  return (
    <>
      <SkipLink />
      <div className="ocm-effect-wrap">
        <div className="ocm-effect-wrap-inner">
          <SiteHeader
            ctaHref={chrome.cta.href}
            ctaLabel={chrome.cta.label}
            logoText={chrome.logoText}
          />
          <div id="ajax-content-wrap">
            {children}
            <SiteFooter
              contactFormId={chrome.contactFormId}
              email={chrome.email}
              emailHref={chrome.email ? `mailto:${chrome.email}` : '#'}
              socials={chrome.socials.map((social) => (
                <SocialLink href={social.href || '#'} key={social.label} label={social.label} />
              ))}
              wordmark={chrome.wordmark}
            />
            <OffCanvasMenu
              menuItems={chrome.menu.map((item) => (
                <MenuItem
                  current={isCurrent(item.href, path)}
                  href={item.href}
                  key={item.href}
                  label={item.label}
                />
              ))}
            />
          </div>
        </div>
      </div>
      <LegacyScripts scripts={scripts} />
    </>
  )
}
