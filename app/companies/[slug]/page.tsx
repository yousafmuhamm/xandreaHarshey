import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { companies, projects, site } from "@/data/content";

type Props = { params: { slug: string } };

const ctaLinks: Record<string, { href: string; label: string }> = {
  "g-pinoy-construction-development": { href: "/construction", label: "View Construction Services" },
  "xandrea-facility-services": { href: "/facility-services", label: "View Facility Services" },
};

const schemaTypes: Record<string, string> = {
  "g-pinoy-construction-development": "HomeAndConstructionBusiness",
  "xandrea-facility-services": "LocalBusiness",
  "primeport-commodity": "Organization",
  "construction-property-services": "LocalBusiness",
};

export async function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = companies.find((c) => c.slug === params.slug);
  if (!company) return {};
  return {
    title: `${company.name} — Calgary, Alberta | Xandrea Harshey`,
    description: company.blurb ?? company.tagline,
    alternates: { canonical: `/companies/${company.slug}` },
    openGraph: {
      title: `${company.name} | Xandrea Harshey Services Inc.`,
      description: company.blurb ?? company.tagline,
      url: `${site.url}/companies/${company.slug}`,
      images: [{ url: company.image, alt: company.imageAlt }],
    },
  };
}

export default function CompanySlugPage({ params }: Props) {
  const company = companies.find((c) => c.slug === params.slug);
  if (!company) notFound();

  const relatedProjects = projects.filter(
    (p) =>
      (params.slug === "g-pinoy-construction-development" &&
        ["Commercial Projects", "Residential Projects"].includes(p.category)) ||
      (params.slug === "xandrea-facility-services" &&
        p.category === "Facility Services Contracts") ||
      (params.slug === "construction-property-services" &&
        p.category === "Property Restoration") ||
      (params.slug === "primeport-commodity" && p.category === "Special Projects")
  );

  const cta = ctaLinks[params.slug];
  const schemaType = schemaTypes[params.slug] ?? "Organization";

  const companyJsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: company.name,
    description: company.blurb ?? company.tagline,
    url: `${site.url}/companies/${company.slug}`,
    parentOrganization: { "@type": "Organization", name: site.name, url: site.url },
    ...(schemaType !== "Organization" && {
      address: {
        "@type": "PostalAddress",
        addressLocality: "Calgary",
        addressRegion: "AB",
        addressCountry: "CA",
      },
      areaServed:
        params.slug === "primeport-commodity"
          ? { "@type": "Country", name: "Canada" }
          : [{ "@type": "City", name: "Calgary" }, { "@type": "State", name: "Alberta" }],
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${company.name} Services`,
      itemListElement: company.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={breadcrumb(
          [
            { name: "Home", path: "/" },
            { name: "Companies", path: "/companies" },
            { name: company.name, path: `/companies/${company.slug}` },
          ],
          site.url
        )}
      />
      <JsonLd data={companyJsonLd} />

      <PageHero
        eyebrow={`${company.name} — Calgary, Alberta`}
        titleLines={company.tagline.split(". ").filter(Boolean)}
        intro={company.blurb ?? company.tagline}
        image={company.image}
      />

      {/* Services */}
      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading eyebrow="Services" lines={["What we deliver."]} />
          </div>
          <Reveal
            className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3"
            stagger
          >
            {company.services.map((s, i) => (
              <div key={s} className="bg-cream p-8">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-4 font-serif text-xl text-ink">{s}</h2>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* "Why Choose Us" extras if available */}
      {company.extra && (
        <section className="bg-navy py-section text-cream">
          <div className="container-site">
            <div className="mb-14 max-w-2xl">
              <SectionHeading light eyebrow="Why Choose Us" lines={[company.extra.heading]} />
            </div>
            <Reveal
              className="grid gap-px overflow-hidden rounded-sm border border-cream/15 bg-cream/15 sm:grid-cols-2 lg:grid-cols-3"
              stagger
            >
              {company.extra.items.map((item, i) => (
                <div key={item} className="bg-navy p-8">
                  <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-serif text-xl text-cream">{item}</h3>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="bg-paper py-section">
          <div className="container-site">
            <div className="mb-14 max-w-2xl">
              <SectionHeading eyebrow="Featured Work" lines={["Projects delivered."]} />
            </div>
            <Reveal className="grid gap-6 md:grid-cols-2" stagger>
              {relatedProjects.map((p) => (
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
                    <div className="absolute left-4 top-4 rounded-sm bg-gold px-3 py-1.5 font-sans text-xs uppercase tracking-eyebrow text-navy-deep">
                      {p.value}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="eyebrow text-gold">{p.category}</span>
                    <h3 className="mt-2 font-serif text-xl text-ink">{p.title}</h3>
                    <p className="mt-2 font-sans text-sm text-ink/60">{p.timeline} · {p.scope}</p>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-ink/70">{p.outcome}</p>
                  </div>
                </div>
              ))}
            </Reveal>
            <Reveal className="mt-10 text-center">
              <Link href="/projects" className="btn-ink">
                <span>View All Projects</span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-cream py-section">
        <div className="container-site max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow mb-6 block text-gold">Get in Touch</span>
            <h2 className="font-serif text-display-md leading-snug text-ink">
              Ready to Work Together?
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink/70">
              Contact Xandrea Harshey Services Inc. to discuss your project requirements.
              Our team will respond within one business day.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-gold">
                <span>Contact Us</span>
              </Link>
              {cta && (
                <Link href={cta.href} className="btn-ink">
                  <span>{cta.label}</span>
                </Link>
              )}
              <Link href="/companies" className="btn-ink">
                <span>All Companies</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
