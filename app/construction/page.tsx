import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { companies, projects, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Calgary Cleaning Service | Xandrea Cleaning service",
  description:
    "Xandrea Cleaning service — Calgary's professional residential and commercial cleaning company. Deep cleaning, move-in/move-out, post-construction, and recurring cleaning across Alberta. Fully insured.",
  alternates: { canonical: "/construction" },
  openGraph: {
    title: "Calgary Cleaning Service | Xandrea Cleaning service",
    description: "Professional residential and commercial cleaning in Calgary, Alberta. Reliable, insured, exceptional standards.",
    url: `${site.url}/construction`,
  },
};

const gpinoy = companies.find((c) => c.slug === "xandrea-cleaning-service")!;
const constructionProjects = projects.filter((p) =>
  ["Commercial Projects", "Residential Projects"].includes(p.category)
);

const constructionJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: gpinoy.name,
  description: gpinoy.blurb,
  url: `${site.url}/construction`,
  parentOrganization: { "@type": "Organization", name: site.name },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  areaServed: [
    { "@type": "City", name: "Calgary" },
    { "@type": "State", name: "Alberta" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services",
    itemListElement: gpinoy.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  },
};

export default function ConstructionPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb(
          [
            { name: "Home", path: "/" },
            { name: "Companies", path: "/companies" },
            { name: "Xandrea Cleaning service", path: "/construction" },
          ],
          site.url
        )}
      />
      <JsonLd data={constructionJsonLd} />

      <PageHero
        eyebrow="Xandrea Cleaning service — Calgary, Alberta"
        titleLines={["Calgary's Professional", "Cleaning Partner."]}
        intro="Reliable residential and commercial cleaning serving Calgary and Alberta — from recurring maintenance and deep cleans to move-in/move-out and post-construction cleanup. Fully insured."
        image="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Trust badges — above the fold for commercial intent visitors */}
      <section className="bg-navy py-10">
        <div className="container-site">
          <Reveal className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { label: "WCB Coverage", icon: "✓" },
              { label: "Fully Insured", icon: "✓" },
              { label: "Safety Certified", icon: "✓" },
              { label: "Quality Assured", icon: "✓" },
              { label: "On-Time Delivery", icon: "✓" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-cream">
                <span className="font-sans text-gold text-lg">{b.icon}</span>
                <span className="font-sans text-sm uppercase tracking-eyebrow">{b.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading
              eyebrow="What We Clean"
              lines={["Professional cleaning", "across every need."]}
            />
          </div>
          <Reveal
            className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4"
            stagger
          >
            {gpinoy.services.map((s, i) => (
              <div key={s} className="bg-cream p-8">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-xl text-ink">{s}</h3>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-paper py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading eyebrow="Completed Projects" lines={["Work that speaks", "for itself."]} />
          </div>
          <Reveal className="grid gap-6 md:grid-cols-2" stagger>
            {constructionProjects.map((p) => (
              <div
                key={p.title}
                className="group relative overflow-hidden rounded-sm border border-ink/10 bg-cream"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-navy-deep/30" />
                  <div className="absolute left-4 top-4 rounded-sm bg-gold px-3 py-1.5 font-sans text-xs uppercase tracking-eyebrow text-navy-deep">
                    {p.value}
                  </div>
                </div>
                <div className="p-6">
                  <span className="eyebrow text-gold">{p.category}</span>
                  <h3 className="mt-2 font-serif text-2xl text-ink">{p.title}</h3>
                  <p className="mt-2 font-sans text-sm text-ink/60">{p.timeline} · {p.scope}</p>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink/70">{p.outcome}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us */}
      {gpinoy.extra && (
        <section className="bg-navy py-section text-cream">
          <div className="container-site">
            <div className="mb-14 max-w-2xl">
              <SectionHeading eyebrow="Why Xandrea Cleaning" lines={[gpinoy.extra.heading]} />
            </div>
            <Reveal
              className="grid gap-px overflow-hidden rounded-sm border border-cream/15 bg-cream/15 sm:grid-cols-2 lg:grid-cols-3"
              stagger
            >
              {gpinoy.extra.items.map((item, i) => (
                <div key={item} className="bg-navy p-8">
                  <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-serif text-xl text-cream">{item}</h3>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Request a Quote CTA */}
      <section className="bg-cream py-section">
        <div className="container-site max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow mb-6 block text-gold">Start Your Project</span>
            <h2 className="font-serif text-display-md leading-snug text-ink">
              Request a Cleaning Quote
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink/70">
              Tell us about your space — residential, commercial, or post-construction. Our team will
              review your requirements and follow up within one business day.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact?type=cleaning" className="btn-gold">
                <span>Request a Quote</span>
              </Link>
              <Link href="/companies#xandrea-cleaning-service" className="btn-ink">
                <span>Full Company Profile</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
