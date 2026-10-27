# Signal — Content Inventory

Source: `signal-portfolio/` — a static HTML crawl of a WordPress site built on the
Salient theme's "Signal" demo (agency/portfolio one-pager + a small work section). This
document is a literal, page-by-page content inventory for migrating that content into
`signal-portfolio-payload` (Payload CMS + Next.js). See `ASSETS.md` for the media manifest
and `DESIGN.md` for the visual/design-system extraction.

Pages crawled: Home (`index.html`), Work archive (`work/index.html`), and two portfolio
case studies (`portfolio/crystal-vibes/index.html`, `portfolio/radiant/index.html`).
`feed/index.html`, `comments/feed/index.html`, `wp-json/*`, and the `index__p=NN.html`
files are WordPress infrastructure / duplicate preview renders and are not real content —
ignored here.

> **Known source-data issue — brand name mismatch:** the header logo renders the text
> "Salient" (linking to the site root), while the footer wordmark, hero heading, contact
> form title, and `<title>` tag all say "Signal". "Salient" is theme-demo leftover (the
> theme's own name bleeding into the demo content) — treat the real brand/site name as
> **Signal** and the header logo text as a bug to fix during migration, not content to
> preserve.

> **Known source-data gap — missing case studies:** the Work archive and the "Other Work"
> widgets on both case-study pages reference five projects — **Crystal Vibes, Into the
> Heat, Radiant, Framework, Balanced** — but only two of them (**Crystal Vibes**, **Radiant**)
> were actually crawled as full detail pages. **Into the Heat, Framework, and Balanced**
> exist only as grid-card entries (title, two category tags, a date, a thumbnail) with no
> body copy available. A future migration will need to either source that copy from
> elsewhere or draft placeholder content for those three.

---

## Global

### Header / Navigation

- Logo: text "Salient" (see brand-name note above — should read "Signal"), links to the
  site root (`https://themenectar.com/salient/signal/`, i.e. `/`).
- Primary nav (in order):
  - "Index" → `/` (home)
  - "Services" → `/#services`
  - "Testimonials" → `/#testimonials`
  - "Work" → `/work/`
- CTA button (top right, always visible): "Get Started" → `#contact`
- Mobile/slide-out menu duplicates the same four nav items plus a "Close Menu" control.
- A search icon/overlay exists ("Hit enter to search or ESC to close", placeholder "Search")
  — WordPress native search, not migration-relevant content.

### Footer

Identical on every crawled page. Three parts:

1. **Say Hello**
   - Heading: "Say Hello"
   - Email: `info@themenectar.com`
2. **Get Social**
   - Heading: "Get Social"
   - Links: "LinkedIn", "Facebook", "Instagram" — all three hrefs are empty/placeholder
     (`href=""` or `href="#"`) in this crawl; the real destination URLs were not captured.
3. **Wordmark**
   - Large decorative heading: "SIGNAL" (own `<h1>`, purely visual sign-off, not a
     navigational logo here).

No copyright line, legal text, or address was found anywhere in the crawl.

### Contact section ("Signal Contact Form")

This exact block appears **identically on every single crawled page** (home, work
archive, and both case studies), always directly above the footer. That repetition
strongly suggests it isn't page-specific content — it behaves like a global
contact/footer component rather than a per-page layout block. Worth deciding during
migration whether this lives on the Footer global or as a block re-used across pages.

- Hidden/visual heading: "Signal Contact Form"
- Fields (FluentForm, form id 3):
  - "First Name" — text, placeholder "First Name"
  - "Last Name" — text, placeholder "Last Name"
  - "Email" — email, placeholder "Email Address"
  - Phone — text, placeholder "Phone Number" (rendered as generic "Text Input" in the
    stripped-text extraction, but the real placeholder is "Phone Number")
  - A checkbox group, likely "services you're interested in": **Analytics**,
    **PPC Advertising**, **SEO**, **Web Design** (4 checkboxes, `name="checkbox[]"`)
- Submit button label: **"Schedule a Call"**
- Required/validation rules weren't determinable from the static markup (FluentForm
  config isn't in the crawl) — treat as a judgment call for the new Form block.

---

## Home (`/`) — `index.html`

Sections top-to-bottom:

1. **Hero** (no anchor id)
   - Heading (two-line, large display type): "WE CREATE" / "THE HYPE"
   - Two small tag/stat labels next to the hero: "Based in New York" and
     "Established 2013"
   - Decorative image set (Salient "content trail" — images that follow the
     cursor/scroll, not static placed images): `desert.jpg`, `sky.jpg`, `office.jpg`,
     `orange-shirt.jpg`, `eye-769x1024.jpg` — see ASSETS.md.

2. **Intro statement**
   - Heading: "From strategy to spotlight, we make brands shine"
   - Button: "Start a Project" → `#contact`

3. **Services** (`id="services"`, matches the "Services" nav link)
   Six service categories, each a heading followed by 5 bullet sub-items:
   - **Content Creation** — Copywriting, Design, Production, Blogs & Articles,
     Creative Assets
   - **Web Design** — WordPress, Responsive Design, Prototyping, CMS, Lighthouse
   - **Branding** — Logo Design, Strategy, Print, Style Guides, Visual Identity
   - **Videos** — Storyboarding, Reels & Shorts, Filming, Editing, Motion Graphics
   - **Social Media** — Strategy, Paid Ads, Analytics, Content Scheduling, Management
   - **Marketing** — SEO, PPC, Conversion Optimization, A/B Testing, Analytics & Reporting

   Each category appears to be paired with one decorative image via a hover-image-trail
   effect; the six images are **hot-linked to the live site**
   (`https://themenectar.com/salient/signal/wp-content/uploads/...`) rather than present
   in this local crawl — see ASSETS.md "Not available locally" note. Exact
   category↔image pairing could not be confirmed from the markup.

4. **"Noise" statement band**
   - Animated heading built from fragments (word-by-word reveal): "In a&nbsp;world full
     of noise, we help brands&nbsp;stand out with clear ideas and&nbsp;good design that
     makes an&nbsp;impact." (verbatim, `&nbsp;` marks the animation's word-reveal
     boundaries — treat the sentence as plain prose when migrating.)
   - Accompanying decorative hover-image-trail set (local images, this time present in
     the crawl): `good-faces-xmSWVeGEnJw-unsplash-6-1-1024x789.jpg`,
     `dale-alejandro-pmLFJlorrN4-unsplash-1.jpg`, `levi-stute-ic8AIr02-7g-unsplash-1.jpg`,
     `orange-bg-minimal-1.jpg`.

5. **Featured Work** (portfolio grid)
   - Heading: "Featured Work"
   - Filter tabs: "All", "Art & Culture", "Concepts", "eCommerce", "Websites"
   - Five project cards, each linking to `/portfolio/<slug>/` with a background image.
     Title/image pairing is cross-validated against the Work archive page and the
     "Other Work" widgets on both case-study pages (all three independently agree):
     | Title | Image |
     |---|---|
     | Crystal Vibes | `karsten-winegeart-Dh5Re5w_fv8-unsplash.jpg` |
     | Into the Heat | `andrei-castanha-fuTjGnN8rNs-unsplash.jpg` |
     | Radiant | `christian-agbede-aohV_aatqQw-unsplash-1-1.jpg` |
     | Framework | `yordan-stoyanov-IKy3Rqo3SBx4-unsplash-1.jpg` |
     | Balanced | `braxton-apana-2Y4KrTv1kvU-unsplash-1.jpg` |

6. **Showreel / video band**
   - Full-width section (background color `#EAE9E8`), ~70vh tall, containing a looping,
     autoplaying, muted background video: `wp-content/uploads/sites/45/2025/11/agency.mp4`.
   - Overlay button: "Play Video" — links out to an external YouTube video
     (`https://www.youtube.com/watch?v=5Fv4WQ-e-0E`), presumably opened in a lightbox.
     This is a second, separate video from the local background loop.

7. **Testimonials** (`id="testimonials"`, matches the "Testimonials" nav link)
   Three text-only quote cards (no avatar images found anywhere in the markup):
   > "The strategy sessions felt like creative therapy — and the final campaign? It
   > stopped people in their tracks. Our audience finally sees us the way we always
   > hoped they would."
   — **Zak Reid**, Founder

   > "It's rare to find a partner that's equally strategic and artistic. They understood
   > our goals, challenged our assumptions, and turned big ideas into visuals that demand
   > attention."
   — **Eve Crawford**, Product Designer

   > "Working with this team was a turning point for our brand. They didn't just deliver
   > a new identity — they uncovered what made us different and gave it a voice."
   — **Aura Brooks**, Graphic Designer

8. **Contact** (`id="contact"`, matches both the nav link and both CTA buttons) — see the
   global "Contact section" write-up above.

9. **Footer** — see Global/Footer above.

---

## Work (`/work/`) — `work/index.html`

- No standalone intro heading/copy beyond the filter tabs (same filter set as the home
  Featured Work section: "All", "Art & Culture", "Concepts", "eCommerce", "Websites").
- Full project grid, five cards, in this order, each with title, two category tags, a
  publish date, a thumbnail image, and a link to `/portfolio/<slug>/`:

  | # | Title | Categories | Date | Thumbnail | Link |
  |---|---|---|---|---|---|
  | 1 | Crystal Vibes | Art & Culture, Concepts | October 31, 2025 | `karsten-winegeart-Dh5Re5w_fv8-unsplash.jpg` | `/portfolio/crystal-vibes/` |
  | 2 | Into the Heat | Concepts, Websites | August 23, 2025 | `andrei-castanha-fuTjGnN8rNs-unsplash.jpg` | `/portfolio/into-the-heat/` |
  | 3 | Radiant | Art & Culture, Concepts | June 18, 2025 | `christian-agbede-aohV_aatqQw-unsplash-1-1.jpg` | `/portfolio/radiant/` |
  | 4 | Framework | Art & Culture, Concepts | April 24, 2025 | `yordan-stoyanov-IKy3Rqo3SBx4-unsplash-1.jpg` | `/portfolio/framework/` |
  | 5 | Balanced | eCommerce, Websites | February 9, 2025 | `braxton-apana-2Y4KrTv1kvU-unsplash-1.jpg` | `/portfolio/balanced/` |

- Below the grid: the same global Contact section + Footer as every other page.

---

## Portfolio detail: Crystal Vibes — `portfolio/crystal-vibes/index.html`

- Title: **Crystal Vibes**
- Tagline/subtitle (large heading under the title): "In the Flow of Motion & Form"
- Body copy (single paragraph):
  > "Momentum captures the energy of movement and the elegance of control — a balance
  > between instinct and intention. It's a study in presence, attitude, and the quiet
  > confidence that comes from owning every step forward."
- Project meta (small attribute list, no client/year/external-URL fields present):
  - **Expertises**: Art & Culture, Concepts
  - **Services**: Brand Identity, Style Guide
- Images, in order (see ASSETS.md for full paths):
  1. Hero/full-width image — `karsten-winegeart-Dh5Re5w_fv8-unsplash.jpg` (same file used
     as this project's grid thumbnail, shown here at full size)
  2. Gallery image — `karsten-winegeart-HZhoui21vuQ-unsplash-800x800.jpg` (square; only a
     cropped 800×800 version exists in this crawl, no uncropped original)
  3. Gallery image — `eugene-golovesov-VdQigv27QgY-unsplash-1-800x800.jpg` (square; same
     caveat — only an 800×800 crop was crawled)
- "Other Work" widget: heading "Other Work", a "View All" link → `/work/`, the same
  filter tabs as elsewhere, and three other project cards — **Radiant**, **Balanced**,
  **Framework** — each with its thumbnail (matching the table in the Work section above).
- No prev/next single-project navigation arrows were found in the markup.

---

## Portfolio detail: Radiant — `portfolio/radiant/index.html`

- Title: **Radiant**
- Tagline/subtitle: "Life in Full Color"
- Body copy (single paragraph):
  > "Radiant captures the warmth of everyday moments — sunlight on skin, laughter between
  > friends, and the pulse of city life. It's a lifestyle brand built on authenticity and
  > connection, celebrating the effortless brightness that comes from living boldly and
  > being fully present wherever the day leads."
- Project meta:
  - **Expertises**: Art & Culture, Concepts
  - **Services**: Brand Identity, Conversion Funnel, Style Guide
- Images, in order:
  1. Hero/full-width image — `vale-lVtNDwz1ggc-unsplash.jpg` (full size)
  2. Gallery image — `vale-PDmBDyN8llo-unsplash-800x800.jpg` (square; only an 800×800 crop
     was crawled)
  3. Gallery image — `christian-agbede-aohV_aatqQw-unsplash-1-1-800x800.jpg` (square crop;
     the uncropped original, `christian-agbede-aohV_aatqQw-unsplash-1-1.jpg`, is also
     present in the crawl — it's this project's own grid thumbnail)
  4. Gallery image — `vale-aDznCxY3Er8-unsplash-1.jpg` (full size)
- "Other Work" widget: same pattern as Crystal Vibes, showing **Framework**,
  **Crystal Vibes**, **Balanced**.
- No prev/next navigation arrows found.
