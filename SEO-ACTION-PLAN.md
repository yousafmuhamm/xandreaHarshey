# Xandrea Harshey — Remaining SEO & Site Action Plan
Generated: June 7, 2026 | Based on full 9-agent SEO audit

---

## ALREADY DONE (this session — do not repeat)

- Hero video `preload="none"` — LCP fix
- Form inputs `text-base` — iOS zoom fix
- Hamburger button 44px touch target
- Security headers in `next.config.mjs`
- Maps iframe sandbox attribute
- XandreaChatBot lazy-loaded
- Preconnect for images.unsplash.com
- `lang="en-CA"` on html tag
- Organization logo in JSON-LD
- `llms.txt` created at `/public/llms.txt`
- Robots.txt AI bot rules
- Sitemap stable dates

---

## CRITICAL — Do before the site goes live or gets indexed

---

### 1. Replace the placeholder phone number

**File:** `data/content.ts` — find `phone:` field
**Change:** Replace `"+1 (403) 000-0000"` with the real business phone number

Then add the phone to the Organization schema in `app/layout.tsx`:
```ts
// Inside orgJsonLd object, add:
telephone: "+1-403-XXX-XXXX",  // use real number
```

Why this matters: The fake number appears in the mobile nav menu, visible to every visitor
who opens it. It also breaks NAP (Name/Address/Phone) consistency which Google uses for
local search rankings. Any visitor who calls it loses trust instantly.

---

### 2. Create the OG image

**Action:** Create a 1200×630px branded JPEG and save it to `/public/og.jpg`

Design guidelines:
- Navy (#0a1628) background
- Gold (#c9a84c) accent
- Company name in large serif type
- Tagline below
- Logo in corner

Why this matters: Right now every share of the site on LinkedIn, WhatsApp, iMessage,
Twitter/X shows a broken image. The `/og.jpg` path is declared in layout.tsx but the
file does not exist.

---

### 3. Remove the careers form "styled demonstration" label

**File:** Find the careers form component — search for "styled demonstration" text
**Change:** Remove that disclaimer text entirely. Either wire up a real form submission
or replace the text with a normal privacy notice.

Why this matters: Real job applicants can see the text "This form is a styled
demonstration." This is an E-E-A-T (trust) failure and potentially a legal issue.

---

### 4. Replace stock headshots on the Leadership page

**File:** `data/content.ts` — the `leadership` array has `image:` fields pointing to
Unsplash photos of random people

**Change:** Replace all three with real photos of the actual executives:
- Alejandro Pagcaliwagan
- Ajit Hardasani
- Harlem Pagcaliwagan

Save the photos to `/public/team/` and update the image paths in content.ts.

Why this matters: Using Unsplash strangers on named executive bio pages is an E-E-A-T
failure. Google can cross-reference headshots against LinkedIn and other sources — a
mismatch weakens entity authority. It also looks fake to any sophisticated visitor.

---

### 5. Replace all social links with real profile URLs

**File:** `data/content.ts` — find the `social` array
**Current values:** `https://www.linkedin.com`, `https://www.instagram.com`, etc.
**Change:** Replace with the actual company profile URLs, e.g.:
```
https://www.linkedin.com/company/xandrea-harshey-services/
https://www.instagram.com/xandreaharshey/
https://www.facebook.com/xandreaharshey/
```

If any profile does not exist yet, create it first, then add the URL here.

Why this matters: Links to generic platform homepages provide zero entity signal to
Google or AI crawlers. A real LinkedIn company page URL is one of the strongest brand
entity signals available.

Also — once you have real URLs, add them to the Organization schema `sameAs` array
in `app/layout.tsx`:
```ts
sameAs: [
  "https://www.linkedin.com/company/xandrea-harshey-services/",
  "https://www.instagram.com/xandreaharshey/",
  "https://www.facebook.com/xandreaharshey/",
],
```

---

## HIGH — Fix within 1 week

---

### 6. Add Calgary to the /services page title and intro

**File:** `app/services/page.tsx`
**Change the metadata title from:**
```
"Services & Capabilities — Eight Capability Areas"
```
**To:**
```
"Construction & Facility Services Calgary | Xandrea Harshey Services Inc."
```

Also add Calgary to the PageHero intro line — something like:
"Serving Calgary and Alberta with eight integrated capability areas..."

Why this matters: The services page cannot rank for any "Calgary [service]" query
because the city name doesn't appear in the title, H1, or body text.

---

### 7. Add Calgary to the /safety page title and intro

**File:** `app/safety/page.tsx`
**Change the metadata title** to include "Calgary":
```
"Safety & Quality Standards | Calgary Construction | Xandrea Harshey"
```

Add Calgary to the PageHero intro as well.

Why this matters: Same as above — "WCB insured construction company Calgary" is a
high-value query this page could rank for but currently can't due to missing geo signal.

---

### 8. Make /services capability tiles link somewhere

**File:** `components/sections/ServiceMatrix.tsx`

Each of the 8 capability tiles currently goes nowhere. Add a link from each tile to
the relevant company section and a pre-populated contact CTA:

- Construction & Development → `/companies#g-pinoy-construction-development`
- Facility Management → `/companies#xandrea-facility-services`
- International Trade → `/companies#primeport-commodity`
- etc.

Also add a "Get a Quote" button at the bottom of each accordion item (mobile) that links
to `/contact?type=[category]`.

Why this matters: Users who browse services have no path to conversion. The page
currently shows capabilities and then stops — no next step.

---

### 9. Add a crawlable intro paragraph to the homepage

**File:** `app/page.tsx`

Add a visible text section between the CompanyGrid and the TrustRow. About 100–150 words.
Should include: "Calgary", the company type, and the service categories.

Example placement — add a new simple section:
```tsx
<section className="bg-cream py-16">
  <div className="container-site max-w-3xl">
    <p className="font-sans text-lg leading-relaxed text-ink/75">
      Xandrea Harshey Services Inc. is a Calgary-based diversified enterprise
      operating across construction, facility management, international trade,
      and hospitality. Through our four operating companies — G-Pinoy
      Construction & Development, Xandrea Facility Services, Primeport Commodity,
      and our Construction & Property Services division — we deliver integrated
      solutions for commercial, residential, and industrial clients across Alberta
      and Canada.
    </p>
  </div>
</section>
```

Why this matters: Google's HTML-only crawl of the homepage currently sees: a tagline,
3 stat numbers, 4 company names. There is no indexable body text explaining what the
company does or where.

---

### 10. Create a standalone /construction page for G-Pinoy

**Action:** Create a new file `app/construction/page.tsx`

This page needs:
- H1 that includes "Calgary" and "Construction" — e.g. "G-Pinoy Construction & Development — Calgary, Alberta"
- Service list (pull from the G-Pinoy data in content.ts)
- 3–4 completed project examples with dollar values (pull from projects data)
- WCB / insurance badge above the fold
- A "Request a Construction Quote" form or CTA linking to `/contact?type=construction`
- Schema: `HomeAndConstructionBusiness` type with Calgary `areaServed`

Add it to the sitemap in `app/sitemap.ts`.

Why this matters: "Calgary construction company" and "G-Pinoy Construction Calgary"
have zero pages to rank for. This is the biggest revenue gap on the entire site.

---

### 11. Create a standalone /facility-services page for Xandrea Facility Services

**Action:** Create a new file `app/facility-services/page.tsx`

This page needs:
- H1 that includes "Calgary" and "Facility Services"
- Contract types (multi-year, monthly, commercial, multi-family)
- Coverage area (Calgary, Alberta)
- The "99%+ SLA" claim formatted as a client-facing KPI
- A "Request a Facility Services Quote" CTA linking to `/contact?type=facility`
- Schema: `LocalBusiness` with `areaServed: Calgary`

Add it to the sitemap.

Why this matters: "Calgary facility maintenance" and "facility services Calgary" have
zero targeted pages. Commercial property managers searching this are a high-value audience.

---

### 12. Create a Wikidata entity for the company

**Action:** Go to https://www.wikidata.org and create a new item

Fields to fill in:
- Instance of: business (Q4830453)
- Country: Canada (Q16)
- Founded: 2018
- Headquarters: Calgary (Q36312)
- Industry: construction (Q179389), facility management
- Official website: xandreaharshey.com
- Key executives: Alejandro Pagcaliwagan (CEO), Ajit Hardasani (COO)

Once created, add the Wikidata URL to the Organization schema `sameAs` in `app/layout.tsx`.

Why this matters: ChatGPT, Gemini, Claude, and Perplexity all weight Wikipedia/Wikidata
heavily when deciding if a company is a known, citable entity. Without it, the company
is effectively unknown to AI search.

---

### 13. Add LocalBusiness schema to the contact page

**File:** `app/contact/page.tsx`

Add a new JSON-LD block:
```ts
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Xandrea Harshey Services Inc.",
  url: site.url,
  telephone: "+1-403-XXX-XXXX",  // real number
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "YOUR STREET ADDRESS",
    addressLocality: "Calgary",
    addressRegion: "AB",
    postalCode: "YOUR POSTAL CODE",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.0447,   // Calgary lat
    longitude: -114.0719, // Calgary lng
  },
  areaServed: { "@type": "City", name: "Calgary" },
  openingHours: "Mo-Fr 09:00-17:00",
};
```

Why this matters: Without LocalBusiness schema with a real address and phone, the site
has near-zero eligibility for local map pack results for "Calgary construction company"
or "facility services Calgary."

---

## MEDIUM — Address within 1 month

---

### 14. Remove "use client" from CompanyGrid

**File:** `components/sections/CompanyGrid.tsx`
**Change:** Remove the `"use client"` directive from line 1

The component has no event handlers — all hover effects are pure CSS (`group-hover:scale`).
The Reveal animation wrapper inside it is the only thing that needs client-side JS.
Extract the Reveal wrapper to a thin client component and keep the grid itself as a
Server Component.

Why this matters: The homepage is fully client-rendered right now. Google's first HTML
pass sees almost nothing. Making CompanyGrid a server component puts the 4 company names,
descriptions, and links into the initial HTML.

---

### 15. Add priority prop to WelcomeImage

**File:** `components/sections/WelcomeImage.tsx` — find the `<Image>` tag (around line 56)
**Change:** Add `priority` prop:
```tsx
<Image src={welcome.image} alt={welcome.imageAlt} fill priority sizes="100vw" className="object-cover" />
```

Why this matters: This is the second large image on the homepage (LCP candidate for
users who scroll). Without `priority`, the browser discovers and loads it too late.

---

### 16. Lazy-load MobileMenu to defer Framer Motion

**File:** `components/layout/Header.tsx`
**Change:**
```tsx
// Replace:
import MobileMenu from "./MobileMenu";

// With:
import dynamic from "next/dynamic";
const MobileMenu = dynamic(() => import("./MobileMenu"), { ssr: false });
```

Why this matters: Framer Motion (~40KB gzipped) loads on every page even though the
mobile menu is only opened when the user taps the hamburger. Lazy-loading it defers
that cost until the menu is first opened.

---

### 17. Throttle the header scroll listener

**File:** `components/layout/Header.tsx`

The `update` function inside `useEffect` calls `getBoundingClientRect()` on every scroll
event, which can fire 120 times per second on high-refresh screens.

Wrap it with requestAnimationFrame:
```ts
let rafId: number;
const onScroll = () => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(update);
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", update);
return () => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", update);
  cancelAnimationFrame(rafId);
};
```

Why this matters: Reduces INP (Interaction to Next Paint) by ~30–60ms on high-refresh
screens. The header currently runs getBoundingClientRect at full scroll rate.

---

### 18. Add footer nav link touch padding

**File:** `components/layout/Footer.tsx`

Find the nav link `<Link>` elements inside the footer columns.
Add `py-2 block` to each link className so they meet the 44px tap target on mobile.

---

### 19. Add button height to .btn-luxe

**File:** `app/globals.css`

Find `.btn-luxe` class.
Change `py-4` to `py-[1.05rem]` or add `min-h-[44px]` to the class.

Current height: ~43.5px (0.5px below the 44px WCAG threshold).

---

### 20. Create a Privacy Policy page

**Action:** Create `app/privacy/page.tsx`

Content must cover (PIPEDA requirements):
- What data is collected (name, email, phone from contact form; email from newsletter)
- How it is used
- Whether it is shared with third parties
- How users can request deletion
- Contact for privacy inquiries

Add a link to this page in the footer and next to the newsletter signup form.

Why this matters: PIPEDA (Canada's federal privacy law) requires a privacy policy
whenever you collect personal data. The contact form and newsletter form both collect
data with no privacy policy linked.

---

### 21. Fix recognition strip — link each item or remove unverified ones

**File:** `data/content.ts` — find the `recognition` array

For each item (Calgary Chamber of Commerce, Canadian Construction Association, BBB
Accredited, WCB Alberta, etc.):
- If the membership/accreditation is real: add a `href` field pointing to the actual
  listing/profile page
- If it is aspirational (not yet achieved): remove it

An unlinked "BBB Accredited" text claim is not verifiable and can be flagged as
misleading. A linked badge pointing to the real BBB listing is a strong trust signal.

---

### 22. Fix leadershipFeatures array content

**File:** `data/content.ts` — find `leadershipFeatures` array

Replace dev-spec entries like "Professional executive photography" and
"Executive biographies" with real leadership principles, e.g.:
- "Accountability-First Culture"
- "Long-Term Capital Stewardship"
- "Operational Discipline"
- "Community Investment"

These render publicly on the `/leadership` page under "How We Lead."

---

### 23. Add sameAs LinkedIn to Person schemas

**File:** `app/leadership/page.tsx`

In each Person schema object, add:
```ts
sameAs: "https://www.linkedin.com/in/[real-profile-slug]/",
```

Do this for all three executives once their real LinkedIn profiles exist.

---

### 24. Add FAQ section to /about for Google AI Overviews

**File:** `app/about/page.tsx`

Add a new section with H2 headings phrased as questions:
- "What is Xandrea Harshey Services Inc.?"
- "What does Xandrea Harshey Services Inc. do?"
- "Where is Xandrea Harshey Services Inc. headquartered?"
- "Who founded Xandrea Harshey Services Inc.?"
- "Is Xandrea Harshey Services Inc. Canadian-owned?"

Each answer: 50–120 words, self-contained.

Then add FAQPage JSON-LD schema matching these Q&As.

Why this matters: Google AI Overviews preferentially cites pages with question-format
headings. This is the fastest on-page path to getting cited in AI search results.

---

### 25. Add visible "Last Updated" dates to About and Leadership pages

**Files:** `app/about/page.tsx`, `app/leadership/page.tsx`

Add a small visible date line near the top of the content area, e.g.:
```tsx
<p className="font-sans text-xs text-ink/40">Last updated: June 2026</p>
```

Why this matters: Google AI Overviews frequently shows the date of cited content.
Undated pages are deprioritized vs dated ones for AI citation.

---

## LOW — Backlog

---

### 26. Claim and verify Google Business Profile

Go to https://business.google.com and claim/create a listing for:
- Xandrea Harshey Services Inc. (the holding group)
- G-Pinoy Construction & Development Inc. (as a separate listing)
- Xandrea Facility Services (as a separate listing)

Requires the real phone number (item #1 above) before this is possible.

---

### 27. Create /companies/[slug] individual pages (future sprint)

Consider adding:
- `/companies/g-pinoy-construction`
- `/companies/xandrea-facility-services`
- `/companies/primeport-commodity`
- `/companies/construction-property-services`

This allows each subsidiary to rank for its own branded search terms independently
and receive its own schema, canonical, and title tag.

---

### 28. Create a YouTube channel and intro video

A single 2–3 minute "who we are" video on a branded YouTube channel has the highest
measured correlation with AI citation (~0.737). Add the channel URL to the Organization
`sameAs` array once created.

---

### 29. Add IndexNow for Bing/Yandex

Generate an IndexNow key, place `[key].txt` in `/public/`, and add a deploy hook
that POSTs changed URLs to `https://api.indexnow.org/indexnow`. Low priority since
Google does not participate, but useful for Bing organic visibility.

---

### 30. Add /companies to internal links from /about and /leadership body text

Currently both pages end with a generic ContactCTA and have no in-body links to other
sections of the site. Add 1–2 contextual links within the body copy pointing to
`/companies`, `/services`, or `/projects`.

---

## SUMMARY CHECKLIST

### Before launch (blockers)
- [ ] Real phone number in data/content.ts
- [ ] /public/og.jpg created (1200×630)
- [ ] Careers form disclaimer removed
- [ ] Real executive headshots on /leadership
- [ ] Real social profile URLs in data/content.ts

### First week
- [ ] "Calgary" added to /services and /safety titles + intros
- [ ] ServiceMatrix tiles link to company sections + contact CTAs
- [ ] Homepage crawlable intro paragraph added
- [ ] /construction page created
- [ ] /facility-services page created
- [ ] Wikidata entity created
- [ ] LocalBusiness schema added to /contact

### First month
- [ ] CompanyGrid "use client" removed
- [ ] WelcomeImage priority prop added
- [ ] MobileMenu lazy-loaded
- [ ] Header scroll listener throttled with rAF
- [ ] Footer nav link touch padding added
- [ ] Privacy Policy page created
- [ ] Recognition strip links added or unverified items removed
- [ ] leadershipFeatures array content replaced
- [ ] Person sameAs LinkedIn URLs added
- [ ] FAQ section added to /about
- [ ] "Last Updated" dates added to About and Leadership pages

### Backlog
- [ ] Google Business Profile claimed for all 3 entities
- [ ] /companies/[slug] individual pages
- [ ] YouTube channel + intro video
- [ ] IndexNow implementation
- [ ] Internal body links from /about and /leadership
