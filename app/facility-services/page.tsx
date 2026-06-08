import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { companies, projects, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Facility Management & Cleaning Services Calgary | Xandrea Facility Services",
  description:
    "Xandrea Facility Services — commercial cleaning, janitorial, facility maintenance, and building operations in Calgary, Alberta. 99%+ SLA. Serving commercial, multi-family, and industrial properties.",
  alternates: { canonical: "/facility-services" },
  openGraph: {
    title: "Facility Management Calgary | Xandrea Facility Services",
    description: "Commercial cleaning, facility maintenance, and building operations in Calgary. 99%+ SLA.",
    url: `${site.url}/facility-services`,
  },
};

const facility = companies.find((c) => c.slug === "xandrea-facility-services")!;
const facilityProjects = projects.filter((p) => p.category === "Facility Services Contracts");

const facilityJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: facility.name,
  description: facility.blurb,
  url: `${site.url}/facility-services`,
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
    name: "Facility Services",
    itemListElement: facility.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  },
};

export default function FacilityServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb(
          [
            { name: "Home", path: "/" },
            { name: "Companies", path: "/companies" },
            { name: "Facility Services", path: "/facility-services" },
          ],
          site.url
        )}
      />
      <JsonLd data={facilityJsonLd} />

      <PageHero
        eyebrow="Xandrea Facility Services — Calgary, Alberta"
        titleLines={["Facility Management", "Calgary Trusts."]}
        intro="Commercial cleaning, janitorial services, facility maintenance, and building operations for Calgary's offices, multi-family properties, and commercial spaces. Reliable. Certified. 99%+ SLA."
        image="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Trust badges */}
      <section className="bg-navy py-10">
        <div className="container-site">
          <Reveal className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { label: "99%+ SLA", icon: "✓" },
              { label: "WCB Coverage", icon: "✓" },
              { label: "Fully Insured", icon: "✓" },
              { label: "Safety Certified", icon: "✓" },
              { label: "Calgary-Based", icon: "✓" },
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
              eyebrow="Our Services"
              lines={["Everything your property", "needs to operate at its best."]}
            />
          </div>
          <Reveal
            className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3"
            stagger
          >
            {facility.services.map((s, i) => (
              <div key={s} className="bg-cream p-8">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-xl text-ink">{s}</h3>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="bg-paper py-section">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="Who We Serve" lines={["Properties across", "Calgary and Alberta."]} />
            <div className="mt-8 space-y-4">
              {[
                "Commercial office buildings",
                "Multi-family residential complexes",
                "Industrial facilities",
                "Retail and hospitality spaces",
                "Corporate campuses",
                "Medical and institutional buildings",
              ].map((type) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span className="font-sans text-base text-ink/80">{type}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading eyebrow="Contract Options" lines={["Flexible terms", "for every need."]} />
            <div className="mt-8 space-y-6">
              {[
                { type: "Multi-Year Contract", desc: "Long-term service agreements with guaranteed SLAs and fixed pricing." },
                { type: "Monthly Service", desc: "Flexible monthly contracts — adjust scope or frequency as your needs change." },
                { type: "One-Time Service", desc: "Deep clean, post-construction cleanup, or event facility preparation." },
              ].map((c) => (
                <div key={c.type} className="border-l-2 border-gold pl-5">
                  <h3 className="font-sans text-sm font-medium uppercase tracking-eyebrow text-ink">{c.type}</h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-ink/65">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured contract */}
      {facilityProjects.length > 0 && (
        <section className="bg-navy py-section text-cream">
          <div className="container-site max-w-3xl">
            <Reveal>
              <span className="eyebrow mb-6 block text-gold-light">Proven Results</span>
              {facilityProjects.map((p) => (
                <div key={p.title}>
                  <h2 className="font-serif text-3xl text-cream md:text-4xl">{p.title}</h2>
                  <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                    <div>
                      <dt className="eyebrow text-gold-light">Contract Value</dt>
                      <dd className="mt-2 font-serif text-2xl text-cream">{p.value}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-gold-light">Duration</dt>
                      <dd className="mt-2 font-serif text-2xl text-cream">{p.timeline}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-gold-light">SLA Achievement</dt>
                      <dd className="mt-2 font-serif text-2xl text-cream">99%+</dd>
                    </div>
                  </dl>
                  <p className="mt-6 font-sans text-base leading-relaxed text-cream/75">{p.outcome}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Quote CTA */}
      <section className="bg-cream py-section">
        <div className="container-site max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow mb-6 block text-gold">Get a Facility Services Quote</span>
            <h2 className="font-serif text-display-md leading-snug text-ink">
              Ready to Elevate Your Property?
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink/70">
              Tell us about your property and service requirements. Our team will prepare a
              tailored proposal within one business day.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact?type=facility" className="btn-gold">
                <span>Request a Quote</span>
              </Link>
              <Link href="/companies#xandrea-facility-services" className="btn-ink">
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
