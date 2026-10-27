# Signal — Media Asset Manifest

Source: `signal-portfolio/signal/wp-content/uploads/sites/45/`. One row per unique
**original** file actually referenced by the four real pages (home, work archive,
Crystal Vibes, Radiant) — WordPress's auto-generated resized duplicates (`-1024x757`,
`-768x568`, `-300x222`, `-150x150`, etc.) are not listed individually unless the
original/unscaled file was never crawled, in which case the largest available size is
listed and flagged. Paths are relative to `signal-portfolio/signal/`.

| Path | Used on | Placement / context | Notes |
|---|---|---|---|
| `wp-content/uploads/sites/45/2025/09/desert.jpg` | Home | Hero "content trail" decorative image (cursor/scroll-follow effect) | |
| `wp-content/uploads/sites/45/2025/09/sky.jpg` | Home | Hero content-trail image | |
| `wp-content/uploads/sites/45/2025/09/office.jpg` | Home | Hero content-trail image | |
| `wp-content/uploads/sites/45/2025/09/orange-shirt.jpg` | Home | Hero content-trail image | |
| `wp-content/uploads/sites/45/2025/09/eye-769x1024.jpg` | Home | Hero content-trail image | Only an `-769x1024` size was crawled; no unscaled original exists in the crawl |
| `wp-content/uploads/sites/45/2025/11/good-faces-xmSWVeGEnJw-unsplash-6-1-1024x789.jpg` | Home | "Noise" statement band — content-trail image | Only `-1024x789` was crawled; no unscaled original |
| `wp-content/uploads/sites/45/2025/11/dale-alejandro-pmLFJlorrN4-unsplash-1.jpg` | Home | "Noise" statement band — content-trail image | Full size available |
| `wp-content/uploads/sites/45/2025/11/levi-stute-ic8AIr02-7g-unsplash-1.jpg` | Home | "Noise" statement band — content-trail image | Full size available |
| `wp-content/uploads/sites/45/2025/11/orange-bg-minimal-1.jpg` | Home | "Noise" statement band — content-trail image | Full size available |
| `wp-content/uploads/sites/45/2025/10/karsten-winegeart-Dh5Re5w_fv8-unsplash.jpg` | Home, Work archive, Crystal Vibes detail | Crystal Vibes grid thumbnail (home + work archive) **and** Crystal Vibes case-study hero/full-width image | Full size available |
| `wp-content/uploads/sites/45/2025/08/andrei-castanha-fuTjGnN8rNs-unsplash.jpg` | Home, Work archive | Into the Heat grid thumbnail | Full size available; no detail page was crawled for this project |
| `wp-content/uploads/sites/45/2025/06/christian-agbede-aohV_aatqQw-unsplash-1-1.jpg` | Home, Work archive, Crystal Vibes "Other Work", Radiant detail | Radiant grid thumbnail everywhere it appears | Full size available |
| `wp-content/uploads/sites/45/2025/06/christian-agbede-aohV_aatqQw-unsplash-1-1-800x800.jpg` | Radiant detail | Radiant case-study gallery image (square crop of the row above) | Crop; the uncropped original is the row above |
| `wp-content/uploads/sites/45/2025/04/yordan-stoyanov-IKy3Rqo3SBx4-unsplash-1.jpg` | Home, Work archive, Radiant "Other Work" | Framework grid thumbnail | Full size available; no detail page was crawled for Framework |
| `wp-content/uploads/sites/45/2025/02/braxton-apana-2Y4KrTv1kvU-unsplash-1.jpg` | Home, Work archive, Crystal Vibes "Other Work", Radiant "Other Work" | Balanced grid thumbnail | Full size available; no detail page was crawled for Balanced |
| `wp-content/uploads/sites/45/2025/10/karsten-winegeart-HZhoui21vuQ-unsplash-800x800.jpg` | Crystal Vibes detail | Case-study gallery image | Only the `-800x800` square crop was crawled; no unscaled original |
| `wp-content/uploads/sites/45/2025/10/eugene-golovesov-VdQigv27QgY-unsplash-1-800x800.jpg` | Crystal Vibes detail | Case-study gallery image | Only the `-800x800` square crop was crawled; no unscaled original |
| `wp-content/uploads/sites/45/2025/09/vale-lVtNDwz1ggc-unsplash.jpg` | Radiant detail | Case-study hero/full-width image | Full size available |
| `wp-content/uploads/sites/45/2025/09/vale-PDmBDyN8llo-unsplash-800x800.jpg` | Radiant detail | Case-study gallery image | Only the `-800x800` square crop was crawled; no unscaled original |
| `wp-content/uploads/sites/45/2025/06/vale-aDznCxY3Er8-unsplash-1.jpg` | Radiant detail | Case-study gallery image | Full size available |
| `wp-content/uploads/sites/45/2025/11/agency.mp4` | Home | Full-width "showreel" band between Featured Work and Testimonials — looping, autoplaying, muted background video (~1800×700 source) | Local file, present in the crawl |

### External video (not a local asset)

- `https://www.youtube.com/watch?v=5Fv4WQ-e-0E` — target of the "Play Video" overlay
  button on the home showreel band. A real external YouTube link, not something to
  download/migrate as media — just preserve as an embed/link.

### Not available locally (hot-linked to the live site, not in this crawl)

The six Services-section decorative images are referenced via `data-nectar-img-src`
pointing at `https://themenectar.com/salient/signal/wp-content/uploads/...` — the live
theme-demo site, not a path inside this crawl. They were **not downloaded** and are not
present anywhere under `signal-portfolio/signal/wp-content/uploads/`. A future migration
will need to either fetch these from the live URL (if still reachable) or source
replacements:

- `wp-content/uploads/sites/45/2025/11/content_creation.jpg`
- `wp-content/uploads/sites/45/2025/09/ipad-mockup-studio.jpg`
- `wp-content/uploads/sites/45/2025/10/abstract-o.jpg`
- `wp-content/uploads/sites/45/2025/10/laptop-top.jpg`
- `wp-content/uploads/sites/45/2025/10/flower-field.jpg`
- `wp-content/uploads/sites/45/2025/10/lamp.jpg`

Exact pairing of these six images to the six service categories (Content Creation, Web
Design, Branding, Videos, Social Media, Marketing) could not be confirmed from the
markup — treat as unordered.

### Icon fonts / third-party assets (behavior, not content)

These are referenced throughout the crawl and explain interactive/visual behavior the
markup implies, but they are not content to migrate:

- `wp-content/themes/salient/css/fonts/icomoon*` — Salient's custom icon font (icon
  glyphs used for nav, socials, arrows, etc.)
- `wp-content/themes/salient/css/fonts/nectar-brands*` — a second icon font, specifically
  brand/social-network glyphs (LinkedIn/Facebook/Instagram icons in the footer likely
  come from here)
- Flickity (`third-party/flickity*`) — carousel/slider library (likely powers the
  testimonial slider)
- jQuery Fancybox (`third-party/jquery.fancybox*`) — lightbox library (likely powers the
  "Play Video" → YouTube overlay)
- `nectar-content-trail*` / `nectar-fit-text*` — Salient's custom cursor-follow image
  trail and auto-fit heading-text scripts, responsible for the hero and "noise" statement
  band's hover/scroll animation
- `third-party/waypoints*`, `third-party/anime.min*`, `nectar-smooth-scroll*` — scroll-
  triggered animation and smooth-scroll plumbing throughout the page
- FluentForm (`plugins/fluentform/*`) — powers the "Signal Contact Form"
