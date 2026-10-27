# Signal — Design System Extraction

Source: Salient theme's compiled "dynamic styles" CSS for this site —
`signal-portfolio/signal/wp-content/uploads/sites/45/salient/salient-dynamic-styles-multi-id-45__ver=84137.css`
(the per-site design-token output of Salient's visual theme options) plus the self-hosted
`@font-face` declarations in
`signal-portfolio/signal/wp-content/uploads/sites/45/salient/edd2c6be5a4e1c63a7d0e496b13c4bab/fonts__ver=7.1.3.css`.

This is a token/pattern extraction for recreating the **look and feel**, not a literal
CSS port. See `CONTENT.md` for copy and `ASSETS.md` for media. Values below are quoted
verbatim from the compiled CSS; where multiple conflicting rules exist (common in Salient's
cascade of global/page-level/mobile overrides), the most specific or most frequently
repeated value is listed first.

## Typography

Two font families, both self-hosted (not Google Fonts CDN):

- **Zalando Sans** — primary sans-serif, used for headings and UI. Loaded weights: 300,
  400, 500, 600, 700, plus italic 400. Used with `letter-spacing: -0.03em` on headings
  (tight, editorial tracking) and `font-weight: 400` on `h1`/`h2` (headings are **not**
  bold — the scale does the work, not weight).
- **Source Serif Pro** — serif, used narrowly for long-form body copy
  (`.single-post .post-area .post-content`, i.e. blog-post body text at `20px`). Not used
  for this site's actual home/work/portfolio pages (no blog posts exist in the crawl), but
  keep available for a future Posts/blog content type.

Type scale (desktop → mobile, from the cascade of breakpoint overrides):

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| `h1` | 110px / line-height 120px | 94–99px / ~102–108px | 50px / 54px |
| `h2` | `font-size: 3rem` (48px), `line-height: 1.1`, `letter-spacing: -0.03em` | — | `3.375rem` context size varies by section |
| `h3` | `2.38rem`–`2.89rem` depending on context | | `1.445rem` |
| `h4` | `2.55rem`, `line-height: 2.21` | | |
| body / `p` | `1rem` (16px), `line-height: 1.5` | | |

Practical read: **massive, light-weight display headlines** (hero "WE CREATE / THE HYPE"
is effectively ~110px) paired with a restrained 16px body — a big editorial-agency
contrast, not a gradual scale.

## Color palette

| Token | Hex | Role |
|---|---|---|
| Ink | `#121213` | Primary text, dark section backgrounds, default link/icon color |
| Paper | `#f1efed` | Default page/header background — warm off-white, not pure white |
| Paper alt | `#ededed` | Secondary light surface |
| Accent | `#ff6022` | Primary accent — CTA buttons, links on hover, active states, h3 highlight color |
| Accent hover | `#ff9321` | Lighter orange, used for hover/active variants of the accent |
| Neutral dark | `#2d2d2d` / `#444` | Secondary text / muted UI on dark surfaces |
| Pure white / black | `#fff` / `#000` | Used sparingly for true contrast (video band, overlays) |

Read: a **warm, near-monochrome ink-and-paper palette with a single hot-orange accent**.
There is no secondary brand color or multi-color system — every call to action, hover
state, and highlight uses the one accent orange. Treat `#ff6022` as the single `--accent`
CSS variable / Tailwind theme color to define; everything else is grayscale/off-white.

## Layout & spacing

- Container horizontal padding: `60px` desktop, `25px` mobile (`!important` override) —
  i.e. generous side gutters, no hard max-width grid visible in the tokens (Salient relies
  on `--wp--style--global--content-size: 1700px` / `--wp--style--global--wide-size: 2000px`
  as very wide content bounds — this is a wide, full-bleed-leaning layout, not a tight
  720px blog column).
- Body copy inside narrow text blocks is sometimes constrained with `padding: 0 15–22%`
  on `p` in specific contexts (e.g. centered intro statements) — i.e. short, centered,
  wide-margin paragraphs for "statement" sections rather than full-width body text.
- Section backgrounds alternate paper (`#f1efed`/`#EAE9E8`) and ink (`#121213`) bands —
  confirmed by the home page's video/showreel band sitting on `#EAE9E8` and `h6`/`h4`
  being styled white (`#fff`/`#f1efed`) for use on dark backgrounds.

## Components & patterns

- **Buttons**: pill-shaped (`border-radius: 200px`), accent-color bordered or filled
  variant (`.nectar-button[data-color="default-accent-color"]`), with a custom "text
  reveal" hover animation (`nectar-text-reveal-button` — the label text slides/reveals on
  hover rather than a simple color fade). Recreate as a pill `<Button>` variant with a
  hover text-reveal or slide transition, accent-colored.
- **Nav**: simple inline links, no dropdown mega-menu actually used on this site despite
  the theme supporting one; a bordered-pill "Get Started" CTA button sits apart from the
  plain text links, always visible, scrolling to `#contact`.
- **Hero**: oversized two-line display headline + two small meta/stat labels ("Based in
  New York", "Established 2013") + a "content trail" of photos that follow
  cursor/scroll movement (Salient's `nectar-content-trail` script) rather than a static
  hero image — this is a signature interaction, not decoration; a static migration should
  at minimum keep the photo set and can simplify the interaction to a collage/marquee if
  a cursor-follow effect isn't worth rebuilding.
- **Statement band**: a large centered sentence revealed word-by-word on scroll
  (`nectar-fit-text` / waypoints), same content-trail photo treatment alongside it.
- **Services grid**: 6 categories × heading + 5 bullet sub-items, each paired with a
  hover-revealed image (image pairing not recoverable from the crawl — treat as
  decorative, can re-pair with any on-brand imagery).
- **Portfolio cards**: full-bleed background-image cards with a title overlay, filterable
  by category tag (filter bar: All / Art & Culture / Concepts / eCommerce / Websites).
- **Testimonials**: text-only quote cards (name + role, no avatar), likely in a Flickity
  carousel (`flickity*` is loaded) rather than a static 3-up grid — card content is short
  (2–3 sentences) which supports a slider UX.
- **Showreel band**: full-width, ~70vh, looping/muted/autoplaying local background video
  with a separate "Play Video" button that lightboxes (Fancybox) an external YouTube
  video — i.e. two distinct videos serving two purposes (ambient loop vs. real watchable
  content).
- **Contact section**: appears identically on every page directly above the footer —
  design it as a persistent block/global, not a page-specific section (see `CONTENT.md`
  note).

## Motion / interaction libraries present (signal for how much "feel" to rebuild)

- `anime.min.js` — micro-animations (likely text reveal, button hover)
- `waypoints` — scroll-triggered reveal triggers
- `nectar-smooth-scroll` / `lenis` (referenced in CSS build list) — smooth/inertial page
  scroll
- `flickity` — testimonial/other carousels
- `jquery.fancybox` — video/image lightbox
- `nectar-content-trail`, `nectar-fit-text` — the two signature hero/statement effects
  described above
- `superfish` — dropdown menu support (present but likely unused — no dropdown nav items
  found in content)
- `touchswipe` — touch gesture support for carousels/portfolio nav on mobile

None of this needs to be ported 1:1 into Next.js/Payload, but it explains *why* the page
feels the way it does: cursor-reactive imagery, word-by-word text reveals, and smooth
inertial scroll are doing a lot of the "premium agency" feel on top of a fairly simple
visual palette. A reasonable migration target is CSS/Framer Motion/GSAP equivalents for
the content-trail and text-reveal moments, and a standard carousel for testimonials — the
color/type/spacing system above can be ported as static design tokens regardless.
