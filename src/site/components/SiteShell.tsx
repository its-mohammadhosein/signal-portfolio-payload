import React from 'react'

import type { SiteChrome } from '../chrome'

import { MenuItem } from './MenuItem'
import { OffCanvasMenu } from './OffCanvasMenu'
import { SignalEffects } from './SignalEffects'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SkipLink } from './SkipLink'
import { SocialLink } from './SocialLink'

const isCurrent = (href: string, path: string) =>
  path === '/' ? href === '/' || href.startsWith('/#') : href === path

/**
 * Everything around a page's content: header, contact section, footer and the off-canvas menu,
 * in the structure the theme's material menu sets up (menu, backdrop and close button after
 * .ocm-effect-wrap), plus the page's animations and interactions.
 */
export function SiteShell({
  chrome,
  children,
  path,
}: {
  chrome: SiteChrome
  children: React.ReactNode
  path: string
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
          </div>
        </div>
      </div>
      <div aria-label="Close" className="slide_out_area_close__wrap" role="complementary">
        <a className="slide_out_area_close" href="#">
          <span className="screen-reader-text">Close Menu</span>{' '}
          <span className="close-wrap">
            {' '}
            <span className="close-line close-line1" role="presentation" />{' '}
            <span className="close-line close-line2" role="presentation" />{' '}
          </span>
        </a>
      </div>
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
      <SignalEffects />
    </>
  )
}
