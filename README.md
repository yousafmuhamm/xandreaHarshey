# Xandrea Harshey Services Inc. — Corporate Website

A production-quality, multi-page corporate website for **Xandrea Harshey Services Inc.**, a
diversified Canadian business group. The design and motion replicate the quiet-luxury, editorial
feel of [carolwoodre.com](https://carolwoodre.com) (smooth inertia scroll, masked text reveals,
clip-path image wipes, hover-zoom grids, big-number stat counters, custom cursor, page
transitions) — with all content taken from the project blueprint.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + GSAP/ScrollTrigger + Lenis +
Framer Motion**, and engineered for SEO (server-rendered content, per-page metadata, JSON-LD
structured data, sitemap/robots, semantic HTML, `next/image`).

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

> **Fonts:** `next/font/google` (Fraunces + Inter) fetches fonts at build time, so the **first**
> `build`/`dev` needs internet access. They're cached afterward.

---

## Project structure

```
app/                      # App Router routes (server components + per-page metadata)
  layout.tsx              # fonts, global SEO metadata, Organization JSON-LD, providers, header/footer
  template.tsx            # page-transition shell (re-mounts on navigation)
  page.tsx                # Home (long animated single page)
  about/ companies/ leadership/ services/ projects/ safety/ careers/ contact/
  sitemap.ts  robots.ts  not-found.tsx
components/
  providers/SmoothScrollProvider.tsx   # Lenis + GSAP ScrollTrigger sync (+ scroll-lock context)
  motion/                # RevealText, Reveal, AnimatedImage, Counter, Marquee, CustomCursor,
                         #   ScrollIndicator, PageTransition
  layout/                # Header, MobileMenu, Footer, Logo, NewsletterForm
  sections/              # Hero, SplitFeature, StatBand, CompanyGrid, ServiceMatrix, Leadership,
                         #   ProjectsPreview/Gallery, BeforeAfterSlider, PremiumFeatures,
                         #   RecognitionStrip, ContactCTA, PageHero, CompanyDetail
  forms/                 # ContactForm, CareersForm
  ui/                    # Button, SectionHeading
  seo/JsonLd.tsx         # JSON-LD injector + breadcrumb helper
lib/
  animation.ts           # central durations / eases / staggers — tune the "feel" here
  gsap.ts                # single GSAP + ScrollTrigger registration
  useReducedMotion.ts    # prefers-reduced-motion hook + non-hook check
  useIsomorphicLayoutEffect.ts
data/
  content.ts             # SINGLE SOURCE OF TRUTH — all copy from the blueprint
```

---

## Content

All copy lives in **`data/content.ts`**. Company names, taglines, service lists, and the three
leadership bios are **verbatim** from the blueprint. Short connective microcopy (e.g. the
fleshed-out Company History, sample project figures) is marked with `// connective` and may be
edited freely.

---

## Media plan

Photography is representative where project-owned media is not available yet. Replace stock with branded assets as they are approved.

| Asset | Where | How to swap |
| --- | --- | --- |
| Hero background video | `data/content.ts` → `hero.video` | Drop an MP4 in `public/video/` and point `hero.video` to `/video/your-file.mp4`. A poster image always shows as fallback (and if the video fails to load). |
| Hero poster | `data/content.ts` → `hero.poster` | Any image URL (or `/...` local path). |
| Section / company / project / leadership images | `data/content.ts` | Replace the Unsplash URLs (built via the `ux()` helper) with approved brand photography. Local images go in `public/` and are referenced as `/your-image.jpg`. |
| Leadership headshots | `data/content.ts` → `leaders[].image` | Replace representative portraits with real executive photography. |
| OG / social image | `app/layout.tsx` → `openGraph.images` | Add a 1200×630 image at `public/og.jpg`. |
| Logo | `components/layout/Logo.tsx` | Currently a text wordmark — swap for an SVG when branding is final. |

Remote image hosts are allowlisted in `next.config.mjs` (`images.remotePatterns`). Add your CDN
there if you host images elsewhere.

---

## SEO

- **Per-page metadata** via the Next.js Metadata API (title template, descriptions, canonical
  URLs, Open Graph, Twitter cards).
- **Structured data (JSON-LD):** `Organization` (global), plus per-page `BreadcrumbList`,
  `ItemList` (companies), `Person` (leadership), `Service` (services), and `CreativeWork`
  (projects).
- **`sitemap.xml`** and **`robots.txt`** generated from the route list.
- **Server-rendered, crawlable content:** animation wrappers are client components but are
  server-side rendered, so all text is present in the initial HTML. Animations enhance after
  hydration and fully degrade under `prefers-reduced-motion`.
- **Performance:** `next/image` (AVIF/WebP), lazy media, `next/font` self-hosting.

> Update `site.url` in `data/content.ts` to the production domain — it drives `metadataBase`,
> canonicals, JSON-LD URLs, the sitemap, and robots.

---

## Animation map (which Carolwood motion each part reproduces)

| Section / component | Motion |
| --- | --- |
| Site-wide | Lenis smooth inertia scroll synced to GSAP ScrollTrigger |
| `Hero` | Full-screen video bg, line-by-line masked headline reveal, staggered subhead/CTAs, video scale-parallax, fading scroll indicator |
| `StatBand` | Big-number count-up on scroll-in |
| `SplitFeature` / `CompanyDetail` | Parallax image, clip-path curtain wipe + inner-scale, eyebrow/heading/body reveal (partner-block layout) |
| `AnimatedImage` | Clip-path curtain wipe + 1.18→1.0 inner scale + optional parallax |
| `RevealText` / `Reveal` | Masked line reveal (headings) / fade-rise + stagger (blocks) |
| `CompanyGrid` / `ProjectsPreview` / `ProjectsGallery` | Hover image zoom + overlay slide-up; gallery filter via Framer layout transitions |
| `ServiceMatrix` | Interactive index — hover crossfade preview (desktop) / accordion (mobile) |
| `Leadership` | Card hover treatment + animated bio modal (scale/opacity + backdrop blur) |
| `BeforeAfterSlider` | Draggable before/after comparison |
| `RecognitionStrip` | Infinite auto-scrolling marquee |
| `Header` | Transparent-over-hero → solid/shrink on scroll, logo tone swap, animated nav underlines |
| `MobileMenu` | Full-screen overlay with staggered link reveal |
| `PageTransition` | Curtain wipe + content fade on every route change |
| `CustomCursor` | Cursor-follow dot that scales/labels over interactive media |
| Footer / forms | Footer reveal; newsletter + contact + careers forms with animated success states |

---

## Stubbed for later (intentionally not built)

These "Premium Features" are rendered as **marketing cards** (title + description + “Coming Soon”)
but have **no backend**. Public forms submit to server routes and require email-provider
environment variables in production.

- **Executive Client Portal** (login / secure area)
- **Investor Portal** (login / secure area)
- **AI Business Assistant** / **Live Chat**
- **Live Quote Request System** (backend)
- **Project Tracking Dashboard** (backend)
- **Multi-Language Support** — English only for now; copy is centralized in `data/content.ts` so
  i18n can be layered on later.
- **Digital Resource Center** (document library)

To enable delivery, configure `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CAREERS_TO_EMAIL`,
`NEWSLETTER_TO_EMAIL`, and `CONTACT_FROM_EMAIL`.

---

## Accessibility

Semantic landmarks and headings, keyboard-navigable nav/menus/modals (Escape to close),
`aria-*` on interactive widgets, descriptive `alt` text, and full `prefers-reduced-motion`
support (GSAP/Lenis disabled, content shown statically, custom cursor hidden).
