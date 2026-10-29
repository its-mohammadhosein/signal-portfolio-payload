# Signal → Payload Migration: Technical Design

| | |
|---|---|
| **Status** | Draft, for review |
| **Source** | `../signal-portfolio`: static HTML crawl of the WordPress/Salient "Signal" demo |
| **Target** | `signal-portfolio-payload` (this repo): Payload CMS 3.92 website template on Next.js 16, Postgres |
| **Inputs** | [`migration/CONTENT.md`](migration/CONTENT.md) (copy), [`migration/ASSETS.md`](migration/ASSETS.md) (media), [`migration/DESIGN.md`](migration/DESIGN.md) (visual tokens) |

> This document covers the **technical design**: data model, block architecture, routes,
> seeding, and rollout. The visual design system (fonts, colors, type scale) is in
> [`migration/DESIGN.md`](migration/DESIGN.md) and is referenced here, not repeated.

---

## 1. Goals and non-goals

### Goals

1. Rebuild the four real pages of the legacy site in Payload so that **all of their content can be edited
   in the admin panel**:
   - Home (`/`)
   - Work archive (`/work`)
   - Two case studies (`/portfolio/crystal-vibes`, `/portfolio/radiant`)
2. Create a first-class **Projects** content type, so that adding a sixth case study takes
   no code changes.
3. Reproduce the Signal look: ink/paper/orange palette, Zalando Sans display type, pill
   buttons, and alternating section bands. Signature motion is kept in simplified form.
4. Make the migration **reproducible**: a single seed run on an empty database produces the
   full site, including media.
5. Keep the public URL shapes `/`, `/work/`, and `/portfolio/<slug>/`.

### Non-goals

- Porting WordPress/Salient/WPBakery markup or jQuery scripts.
- A WordPress → Payload importer. The source is a one-off crawl of five projects and one
  page, so we hand-author the content as seed data instead.
- Blog/Posts content. The source has none. The template's `Posts` collection stays in place, unlinked, for later use (§4.6).
- Pixel-perfect recreation of `nectar-content-trail` or Lenis smooth scroll. §7 lists the
  simplified equivalents.
- Site search. The source's WordPress search overlay is not carried over.

---

## 2. Current state

### Source (`signal-portfolio`)

This is a static crawl. Only four HTML files hold real content. Everything else is WordPress plumbing.
[`migration/CONTENT.md`](migration/CONTENT.md) already inventories the content in full, so
**the migration should not need to parse the source HTML again**. The only things still read
directly from the crawl are the media files and the self-hosted font files.

### Target (`signal-portfolio-payload`)

The repo is the unmodified Payload website template:

- Collections: `pages`, `posts`, `media`, `categories`, `users`. The plugins add `forms`,
  `form-submissions`, `redirects`, and `search`.
- Globals: `header` and `footer`. Each holds only a `navItems` array.
- Page layout blocks: `cta`, `content`, `mediaBlock`, `archive`, `formBlock`. Heroes:
  `highImpact`, `mediumImpact`, `lowImpact`.
- The seed at `src/endpoints/seed/` creates the template's demo content. It runs from the admin
  dashboard's Seed button through `/next/seed`.
- Theme: Geist fonts, a light/dark theme switcher, and shadcn-style CSS variables.

**Environment inconsistency to fix first.** `payload.config.ts` uses `@payloadcms/db-postgres`,
but `.env.example` and `docker-compose.yml` still point at MongoDB. This design assumes
**Postgres** (§8.1).

---

## 3. Architecture overview

```
                         ┌───────────────────────── Payload admin ─────────────────────────┐
                         │                                                                │
  Globals                │  header ── logo text, navItems[], cta link                     │
                         │  footer ── contact{heading, form→forms}, email, socials[],     │
                         │            wordmark                                            │
                         │                                                                │
  Collections            │  pages ──── hero + layout[blocks]   (home, work)               │
                         │  projects ─ hero image, tagline, body, meta, gallery  (NEW)    │
                         │  categories (Art & Culture, Concepts, eCommerce, Websites)     │
                         │  media, forms, form-submissions, redirects, users              │
                         └────────────────────────────────────────────────────────────────┘
                                                   │  Local API (RSC)
                                                   ▼
  Next.js routes      /                → pages[slug=home]
                      /work            → pages[slug=work]
                      /portfolio/[slug]→ projects[slug]
                      every page       → Header · <page> · ContactSection · Footer
```

---

## 4. Data model

### 4.1 New collection: `projects`

A case study is a different shape from a blog post. It has a tagline, structured meta
(expertises and services), and an image gallery. It also needs its own URL prefix. Reusing
`posts` plus a "Work" category would bend `posts` into that shape and tangle the blog with
the portfolio. So `projects` gets its own collection. It follows the conventions of `posts`:
drafts, live preview, SEO tab, slug field, and revalidation hooks.

`src/collections/Projects/index.ts`, slug `projects`:

| Field | Type | Notes |
|---|---|---|
| `title` | text, required | "Crystal Vibes" |
| `tagline` | text | "In the Flow of Motion & Form". Shown as the large subtitle |
| `heroImage` | upload → `media`, required | Full-width hero on the detail page, and also the **grid thumbnail** (the source uses the same file for both) |
| `thumbnail` | upload → `media` | Optional override for grid cards. Falls back to `heroImage` |
| `body` | richText (lexical) | Single paragraph in the source. Rich text keeps future case studies flexible |
| `categories` | relationship → `categories`, hasMany | Shown as **"Expertises"** on the detail page. Drives the grid filter tabs |
| `services` | text, `hasMany: true` | "Brand Identity", "Style Guide", "Conversion Funnel". Free-form, display only, never filtered on, so it doesn't need its own collection |
| `gallery` | array of `{ image: upload→media, layout: select('full','half') }` | Ordered gallery below the body. `half` renders the 800×800 crops two-up |
| `relatedProjects` | relationship → `projects`, hasMany, max 3 | "Other Work". When empty, fall back to the 3 most recent other published projects |
| `publishedAt` | date, sidebar | Source dates (e.g. 2025-10-31). Sorts the grid newest-first, which matches the source order |
| `meta` | SEO plugin tab | Same pattern as `pages` |
| `slug` | `slugField()` | `crystal-vibes`, `into-the-heat`, … |

Access is the same as `pages`: `read: authenticatedOrPublished`, and every write requires
`authenticated`. Versions use drafts with autosave and `maxPerDoc: 50`.

Register `projects` with:
- `seoPlugin` `generateURL`, which must produce `/portfolio/<slug>` for projects.
- `redirectsPlugin.collections`.
- `generatePreviewPath`, which maps `projects` to `/portfolio`.
- `next-sitemap` / a `projects-sitemap.xml` route, mirroring `posts-sitemap.xml`.

### 4.2 `categories` (reused)

Seed the four categories from the filter bar: **Art & Culture**, **Concepts**,
**eCommerce**, **Websites**. Delete the template's demo categories. The tab order in the source is
alphabetical, so sort the tabs by `title` rather than adding an `order` field.

### 4.3 `header` global (extended)

| Field | Change |
|---|---|
| `logoText` | **new**, text, default "Signal". This fixes the source bug where the logo reads "Salient" |
| `navItems` | unchanged. Seeded with Index `/`, Services `/#services`, Testimonials `/#testimonials`, Work `/work` |
| `cta` | **new**, `link()` field with appearances enabled. Seeded as "Get Started" → `#contact` |

### 4.4 `footer` global (restructured)

The template footer is a simple link list. The Signal footer has three fixed parts, and every page
shows the same contact section above it. Both belong in one global:

| Field | Type | Seed value |
|---|---|---|
| `contact.enabled` | checkbox | true |
| `contact.heading` | text | "Let's talk" or similar. The source heading is visually hidden ("Signal Contact Form"), so this is an editorial choice |
| `contact.form` | relationship → `forms` | The "Signal Contact Form" (§4.5) |
| `email` | email | **Placeholder.** The source uses `info@themenectar.com`, which is the theme vendor's address (§10) |
| `socialLinks` | array of `{ platform: select(linkedin, facebook, instagram, x, …), url: text }` | Empty. The source hrefs are blank (§10) |
| `wordmark` | text | "SIGNAL" |

Drop the existing `navItems` from `footer` because the source footer has no link list. Also
remove the template's theme selector from `Footer/Component.tsx` (see §6.3).

**Why the contact form goes on the Footer global and not in page blocks:** it appears
identically on every page, including project detail pages, which have no block layout. A
global gives one source of truth and one place to edit it. The home page's `#contact`
anchors resolve to the section's `id="contact"`.

### 4.5 Contact form (form-builder plugin)

Seed one `forms` document called "Signal Contact Form":

| Field (blockType) | name | label / placeholder | width | required |
|---|---|---|---|---|
| `text` | `firstName` | First Name | 50 | yes |
| `text` | `lastName` | Last Name | 50 | yes |
| `email` | `email` | Email Address | 50 | yes |
| `text` | `phone` | Phone Number | 50 | no |
| `checkbox` | `interestAnalytics` | Analytics | 25 | no |
| `checkbox` | `interestPpc` | PPC Advertising | 25 | no |
| `checkbox` | `interestSeo` | SEO | 25 | no |
| `checkbox` | `interestWebDesign` | Web Design | 25 | no |

- Submit label: **"Schedule a Call"**. Confirmation type is `message`, with short thank-you rich text.
- The source's validation rules are unknown, so the "required" column above is our decision.
- **Checkbox group decision.** The four options become four `checkbox` fields. This needs no
  code and submissions stay readable. The frontend renders them under a shared "I'm
  interested in" label. If editors later want a real grouped field, add a custom
  `checkboxGroup` block through `formBuilderPlugin({ fields: { checkboxGroup: … } })` with a
  matching renderer in `src/blocks/Form/fields.tsx`. That is out of scope for v1.
- Email notifications are not configured, because no email adapter exists. Submissions
  land in `form-submissions` only (§10).

### 4.6 Unchanged / retired

- `posts` stays registered so a blog can be added later (Source Serif Pro is reserved for it, per
  the visual DESIGN.md). The seed creates no posts, and nothing links to `/posts`. The `search`
  plugin stays scoped to posts.
- `users` is unchanged.
- The template demo seed files (`post-1..3.ts`, `image-*.ts`, `home.ts`, `contact-page.ts`, etc.) are
  deleted and replaced by the Signal seed (§8).
- `homeStatic` fallback in `[slug]/page.tsx`: replace it with a minimal Signal placeholder
  or remove it.

---

## 5. Page composition: blocks

### 5.1 Block inventory

The home page maps onto the blocks below. "Reuse" means the existing template block with
only restyling. "New" means a new block under `src/blocks/<Name>/` with `config.ts` and
`Component.tsx`, registered in `pages.layout` and in `RenderBlocks.tsx`.

| # | Source section | Block | Status | Key fields |
|---|---|---|---|---|
| 1 | Hero "WE CREATE / THE HYPE" | `hero.type = 'signal'` | **new hero type** | `headline` (textarea, one line per row), `metaLabels[]` ({text}), `trailImages[]` (upload). Reuses the existing `hero` group, which keeps the hero tab UX |
| 2 | Intro statement + "Start a Project" | `statement` | **new** | `text` (textarea), `links` (linkGroup, max 1), `align`, `theme` |
| 3 | Services (6 × heading + 5 bullets) | `services` | **new** | `heading?`, `items[]` {`title`, `bullets[]` {text}, `image?`} |
| 4 | "Noise" statement band | `statement` (same as #2) | **new** | Adds `revealOnScroll` (checkbox) and `trailImages[]` |
| 5 | Featured Work grid + filters | `projectsGrid` | **new** | `heading`, `showFilters` (checkbox), `populateBy` (all/selection), `selectedProjects[]`, `limit`, `layout` (featured/grid) |
| 6 | Showreel video band | `videoBand` | **new** | `backgroundVideo?` (upload→media, mp4), `poster?`, `playLabel`, `externalVideoUrl?` (YouTube), `height` (select: 50/70/100vh). **v1 decision:** the section is kept but the video is not migrated, so both video fields are optional and the band renders (and hides "Play Video") when they are empty |
| 7 | Testimonials | `testimonials` | **new** | `heading?`, `items[]` {`quote` textarea, `name`, `role`} |
| 8 | Contact | n/a | **footer global** | See §4.4 |

The Work page (`/work`) is a `pages` document whose layout holds one `projectsGrid` block in
`grid` layout with filters on, plus a `lowImpact` hero ("Work"). Making it a page rather than
a hard-coded route lets editors add intro copy later.

The template blocks `content`, `mediaBlock`, `cta`, `archive`, and `formBlock` stay available
but are restyled to the Signal tokens. `archive` keeps serving posts only.

### 5.2 Shared block conventions

These conventions apply to every new block. Add them as a reusable field factory,
`src/fields/blockSettings.ts`:

- **`anchorId`** (text, optional). Rendered as the section's `id`. This is required for the source's
  in-page nav (`#services`, `#testimonials`). `RenderBlocks` wraps each block in a
  `<section id={anchorId}>`.
- **`theme`** (select: `paper` | `paperAlt` | `ink`). This drives the alternating background bands
  described in the visual DESIGN.md. It sets `data-section-theme` on the wrapper, and CSS
  variables cascade from there.
- `RenderBlocks` currently applies a fixed `my-16` to each block. Replace it with
  per-theme vertical padding (`py-24 md:py-32`) so that colored bands sit edge-to-edge.
- The source's showreel band uses `#EAE9E8` (`CONTENT.md`), while `paperAlt` is `#ededed`
  (`migration/DESIGN.md`). They are nearly identical, so `paperAlt` is used for both.

### 5.3 Project detail page (not block-based)

`/portfolio/[slug]` renders from the fixed `projects` schema, not from blocks. Every case study has
the same structure, and a fixed schema keeps editing simple:

1. Title (h1) and tagline (h2-scale display)
2. `heroImage` at full width
3. Two-column row: `body` on the left, meta list on the right (Expertises = categories, Services)
4. `gallery`: `full` items span the width, consecutive `half` items pair up two-up
5. "Other Work": heading, a "View All" link → `/work`, and 3 cards using the same
   `ProjectCard` component as the grid
6. Global contact section and footer, which come from the layout

There are no prev/next arrows, matching the source.

---

## 6. Frontend architecture

### 6.1 Routes

| Route | File | Source of data |
|---|---|---|
| `/` | `app/(frontend)/page.tsx` (existing, delegates to `[slug]`) | `pages` slug `home` |
| `/[slug]` | existing | `pages`. `/work` lives here |
| `/portfolio/[slug]` | **new** `app/(frontend)/portfolio/[slug]/page.tsx` (+ `page.client.tsx`) | `projects`. `generateStaticParams` covers all published projects |
| `/portfolio` | **new**, permanent redirect → `/work` | Nothing; the source has no `/portfolio/` index |
| `/projects-sitemap.xml` | **new** | `projects` |
| `/posts/**`, `/search` | existing, left as is | not linked |

**Trailing slashes.** Legacy URLs end in `/` (`/work/`). Next.js redirects `/work/` → `/work`
by default (308), so old links keep working with no extra config. Do not set
`trailingSlash: true`.

### 6.2 Component structure (new files)

```
src/
  collections/Projects/
    index.ts
    hooks/revalidateProject.ts
  blocks/
    Statement/{config.ts,Component.tsx}
    Services/{config.ts,Component.tsx,Component.client.tsx}   # hover image reveal
    ProjectsGrid/{config.ts,Component.tsx,Filters.client.tsx}
    VideoBand/{config.ts,Component.tsx,VideoLightbox.client.tsx}
    Testimonials/{config.ts,Component.tsx,Carousel.client.tsx}
  heros/SignalHero/{index.tsx,ContentTrail.client.tsx}
  components/
    ProjectCard/index.tsx           # shared by ProjectsGrid + Other Work
    ContactSection/index.tsx        # reads footer.contact, renders FormBlock
    Reveal/index.client.tsx         # scroll-triggered word/line reveal
  fields/blockSettings.ts           # anchorId + theme
  app/(frontend)/portfolio/[slug]/{page.tsx,page.client.tsx}
  app/(frontend)/(sitemaps)/projects-sitemap.xml/route.ts
```

Data fetching is done in Server Components through the Local API, the same way the template does it. The
`'use client'` boundary is pushed down to the interactive leaves only: filters, carousel,
lightbox, content trail, and reveal.

**Grid filtering** happens client-side over the already-fetched project list. There are 5 projects
and they will stay in the low dozens, so filtering in memory is fine. Filter state is mirrored to a
`?category=` search param so filtered views can be linked and the back button works.

### 6.3 Theming and tokens

The tokens come from [`migration/DESIGN.md`](migration/DESIGN.md). Implementation:

- **Single light theme.** The source has no dark mode, only dark *sections*. Remove
  `ThemeSelector` and the `InitTheme`/`HeaderTheme` dark logic, or pin `data-theme="light"`.
  Dark sections are handled by the block `theme` field (§5.2).
- In `globals.css`, remap the existing shadcn variables (`--background`, `--foreground`,
  `--primary`, `--border`, …) to the Signal tokens rather than adding a parallel set.
  Existing `ui/*` components then pick them up automatically:
  - `--background: #f1efed` (paper), `--foreground: #121213` (ink),
    `--primary: #ff6022` (accent), plus a new `--accent-hover: #ff9321` variable.
  - `[data-section-theme='ink']` swaps background and foreground.
- **Fonts.** Swap Geist for **Zalando Sans** (300–700, plus italic 400) as `--font-sans`. Load it with
  `next/font/google` if the family is available there. Otherwise use `next/font/local` with the
  `.woff2` files from the crawl's `salient/edd2c6…/` directory, copied into `src/fonts/`.
  Source Serif Pro is loaded the same way, but only on post pages.
- **Type scale.** Add `@theme` tokens for display sizes, with fluid `clamp()` values in place of the
  source's three hard breakpoints. For example, `--text-display: clamp(3.125rem, 8vw, 6.875rem)`
  covers 50px → 110px. Headings are weight 400 with tracking `-0.03em`.
- **Buttons.** Add a `pill` variant to `components/ui/button.tsx` (cva): `rounded-full`,
  accent border or fill, and a text-slide hover. The `link()` field's `appearance` options
  gain `pill` and `pillOutline`.
- **Container.** Side padding is 60px on desktop and 25px on mobile. Max width is wider than the template's
  (~1700px). Update the `.container` utility.
- Update `tailwind.config.mjs` typography so `prose` headings use the display tokens.

### 6.4 SEO and metadata

- `generateTitle` → `"<title> | Signal"`. The site default is "Signal".
- Replace `twitter.creator: '@payloadcms'`, `mergeOpenGraph` defaults, the favicon, and the
  OG image with Signal equivalents. The favicon and OG image are new assets (§10).
- The project `meta.image` defaults to `heroImage` when empty.

---

## 7. Motion and interaction

Each signature effect is rebuilt as follows. Add **one** animation dependency, `motion`
(Framer Motion), plus **`embla-carousel-react`** for the carousel. All motion must honor
`prefers-reduced-motion` and fall back to static content.

| Source effect | Library in source | v1 implementation |
|---|---|---|
| Hero content trail (photos follow the cursor) | `nectar-content-trail` | `ContentTrail.client.tsx` keeps a pool of `trailImages` rendered as `<Image>`. On `pointermove`, throttled by distance travelled, the next image is placed at the cursor and fades/scales out. Touch and reduced-motion get a static staggered collage |
| Word-by-word statement reveal | `nectar-fit-text` + waypoints + anime | `Reveal` splits the text into words. `motion` `whileInView` staggers opacity/translate |
| Services hover image | hover image trail | On hover/focus of a service title, show its `image` in a floating panel that follows the cursor. Images are paired explicitly in the CMS |
| Testimonials slider | Flickity | Embla carousel with prev/next and drag. It degrades to stacked cards without JS |
| "Play Video" lightbox | Fancybox | Native `<dialog>` with a `youtube-nocookie.com` iframe that mounts only when opened |
| Background video loop | `<video>` | `<video autoPlay muted loop playsInline preload="metadata" poster>`. It pauses when `prefers-reduced-motion` is set |
| Smooth/inertial scroll | Lenis | **Dropped** in v1. CSS `scroll-behavior: smooth` is used for anchor links only |
| Pill button text reveal | `nectar-text-reveal-button` | Pure CSS: the label is duplicated and translated on hover |

---

## 8. Content migration (seeding)

### 8.1 Environment

- Database: **Postgres**. `docker-compose.yml` now has a `postgres:17` service on host port
  **5434** (5432 and 5433 are taken on the dev machine); the `mongo` and `payload` services are
  commented out and the app runs on the host with `pnpm dev`. `.env` uses
  `DATABASE_URL=postgresql://signal:signal@127.0.0.1:5434/signal_portfolio`. Still to do: update
  `.env.example` to the Postgres URL.
- In development, use Payload's schema push. Before the first deploy, generate a baseline migration with
  `pnpm payload migrate:create initial` and run `migrate` in CI/deploy.
- Media storage: local `public/media` (template default). Moving to S3/Vercel Blob
  through a storage adapter is a deployment concern and outside this design (§10).

### 8.2 Seed design

Replace the body of `src/endpoints/seed/` with a Signal seed. The existing entry points stay as they are:
the admin Seed button and `POST /next/seed`.

```
src/endpoints/seed/
  index.ts              # orchestrator (wipe → media → categories → form → projects → pages → globals)
  media/                # the 20 images copied from the crawl (agency.mp4 is NOT copied, see §8.3)
  data/
    media.ts            # filename → { alt, folder }
    categories.ts
    contact-form.ts
    projects.ts         # 5 projects (CONTENT.md §Work + case studies)
    home.ts             # home page hero + layout blocks
    work.ts
    globals.ts          # header + footer
```

Principles:

1. **Self-contained repo.** Copy the media into `src/endpoints/seed/media/` so that the seed does not
   depend on the sibling crawl directory existing. The list of files is exactly the rows in
   [`migration/ASSETS.md`](migration/ASSETS.md). Original filenames are kept, minus WordPress
   size suffixes where a cleaner name is useful.
2. **Verbatim copy.** Every string in `data/*.ts` comes from `CONTENT.md`. Strip `&nbsp;`
   animation markers from the "noise" sentence. Apply the brand fix ("Salient" → "Signal").
3. **Order of creation** follows the dependencies: media → categories → form → projects (with
   `relatedProjects` set in a second pass, after all projects exist) → pages → globals.
4. **Idempotent by wipe.** Like the template seed, it clears the target collections and globals first.
   It must **never** run against production after editors have made changes. Guard it with
   `NODE_ENV !== 'production' || process.env.ALLOW_SEED === 'true'`.
5. Use `context: { disableRevalidate: true }` on writes, as the template does.
6. Upload media through `payload.create({ collection: 'media', filePath, data: { alt } })`.
   Payload then generates the `imageSizes`, which replace WordPress's resized duplicates.
   Alt text is written during seeding because the crawl has none worth keeping.

### 8.3 Content gaps: seed behavior

| Gap | v1 seed behavior |
|---|---|
| Into the Heat, Framework, Balanced have no detail copy | Seeded as **published** projects with the real title, categories, date, and hero/thumbnail image. Each gets a placeholder `tagline` and `body` marked `[Placeholder copy]` and no gallery. Grid links never 404. Editors replace the copy before launch |
| 6 Services images are hot-linked and not in the crawl | A one-off script, `scripts/fetch-service-images.ts`, fetches them from the live URL and commits them to `seed/media/`. The seed itself never touches the network. If a fetch fails, reuse on-brand images already in the set. Pair one image per service explicitly |
| Gallery images exist only as 800×800 crops | Use the crops with `layout: 'half'`. Do not upscale |
| `eye-769x1024.jpg`, `good-faces-…-1024x789.jpg` are only scaled versions | Use them as is; trail images render small |
| Social URLs empty | Seed `socialLinks: []`. The footer hides the "Get Social" column when the list is empty |
| Email is the theme vendor's | Seed `hello@example.com` and flag it in the launch checklist. Email and footer content are configured later in the admin |
| `agency.mp4` background loop and the YouTube "Play Video" link | **Not migrated.** The `videoBand` section is still seeded (band, height, play label) with no video. Editors can add a video in the admin later |

---

## 9. Implementation plan

Each phase ends in a working, reviewable state.

| Phase | Scope | Done when |
|---|---|---|
| **0. Foundations** | Postgres env/compose fix; remove the dark theme switcher; Signal tokens, fonts, container, and pill button in `globals.css`/`ui`; `blockSettings` field; `RenderBlocks` section wrapper | The template site renders in Signal colors and type; `pnpm build` and `pnpm lint` pass |
| **1. Data model** | `projects` collection plus hooks, sitemap, and preview; header/footer global changes; categories cleanup; `pnpm generate:types`, `generate:importmap` | Admin can create a project; types compile |
| **2. Routes and static UI** | `/portfolio/[slug]`; `ProjectCard`; `ContactSection` in the layout; Header (logo text, CTA) and Footer (email, socials, wordmark) components | A hand-made project renders end-to-end, with the contact form on every page |
| **3. Blocks** | `signal` hero, `statement`, `services`, `projectsGrid` (with filters), `videoBand`, `testimonials`, each with its static (no-motion) rendering | Home and Work can be built in the admin, with all copy visible and anchors working |
| **4. Seed** | Signal seed per §8, media copied in, service images fetched | One seed run on an empty DB reproduces all four source pages |
| **5. Motion** | Content trail, reveal, services hover, carousel, lightbox, reduced-motion fallbacks | Interactions work on desktop; mobile and reduced-motion get the static fallbacks |
| **6. QA and launch prep** | Tests (§9.1); side-by-side visual review against the source; Lighthouse; launch checklist (§10) | All checks green; open questions resolved |

### 9.1 Testing

- **Integration (`tests/int`, Vitest):** run the seed against a test DB, then assert the counts
  (5 projects, 4 categories, 2 pages, 1 form) and the key relationships, such as Crystal Vibes →
  [Art & Culture, Concepts] and the footer form set.
- **E2E (`tests/e2e`, Playwright):** replace the template's frontend spec:
  - Home renders "WE CREATE", the six service titles, three testimonials, and the contact form.
  - Nav anchors scroll to `#services`, `#testimonials`, `#contact`.
  - `/work` shows 5 cards in date order. The "eCommerce" filter shows only Balanced.
  - `/portfolio/radiant` shows the tagline, meta, hero plus 3 gallery images (4 images in total, per `CONTENT.md`), and 3 Other Work cards.
  - `/work/` and `/portfolio/radiant/` redirect to their slash-less forms.
  - Contact form submission creates a `form-submissions` document.
  - Admin smoke test (existing `admin.e2e.spec.ts`) still passes.
- **Accessibility:** run axe on the 3 page types. Check that the hero headline is a real `h1`, that the
  footer "SIGNAL" wordmark is **not** an `h1` (the source has two `h1`s, so it is demoted to
  `<p aria-hidden>` or a styled `div`), and that the carousel and lightbox are keyboard operable.

---

## 10. Open questions and launch checklist

These items need an owner decision. The seed ships with the placeholder noted in each row.

| # | Question | Placeholder in v1 |
|---|---|---|
| 1 | Real contact email address | `hello@example.com` |
| 2 | Real LinkedIn / Facebook / Instagram URLs | Hidden |
| 3 | Copy for Into the Heat, Framework, Balanced (and galleries) | `[Placeholder copy]` |
| 4 | Is the "Based in New York / Established 2013" meta factual for the real business? | Kept verbatim |
| 5 | Should contact submissions email someone? This needs an email adapter (e.g. Resend/SMTP) and form `emails` config | DB only |
| 6 | Production media storage (local disk vs. S3/Blob) and hosting target | Local `public/media` |
| 7 | Licensing: the imagery is Unsplash content from a ThemeNectar demo. Confirm the rights to use it, or replace it before going public (`agency.mp4` is no longer migrated) | Used as-is for staging only |
| 10 | Showreel video: add a video (and optional YouTube link) to the kept `videoBand` section, or remove the section | Section kept, no video |
| 8 | Favicon / OG image / logo mark beyond the text wordmark | Text wordmark; template favicon removed |
| 9 | Keep `/posts` and `/search` routes reachable, or remove them until a blog exists? | Reachable, unlinked |

---

## 11. Decision log

| Decision | Chosen | Alternatives considered | Why |
|---|---|---|---|
| Case-study storage | New `projects` collection | `posts` + "Work" category | Different schema (gallery, services, tagline) and its own URL space |
| Expertise taxonomy | Reuse `categories` | New `expertises` collection | Same shape. The existing collection already has a slug and nested-docs |
| Project services | `text` hasMany | Collection or select | Display only, never filtered, set varies per project |
| Contact section placement | `footer` global | `formBlock` on each page | Identical on every page, including non-block project pages |
| Services checkbox group | 4 `checkbox` fields | Custom form-builder field | No code; can be upgraded later without changing the data model much |
| Work archive | `pages` doc + `projectsGrid` block | Hard-coded route | Editors can add copy; same block reused on the home page |
| Content migration | Hand-authored TS seed | HTML scraper/importer | Content is small and already inventoried; a scraper would be throwaway work |
| Theming | Single light theme + per-section `theme` | Keep template light/dark switcher | The source design has dark bands, not a dark mode |
| Motion | `motion` + `embla-carousel-react` | GSAP, port Salient scripts | Small, React-native, reduced-motion friendly |
| Database | Postgres (as configured) | MongoDB (as in `.env.example`) | `payload.config.ts` already commits to Postgres |
