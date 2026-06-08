import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { projects, projectCategories, pageHeroImages, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Construction & Facility Projects Calgary | Xandrea Harshey Portfolio",
  description:
    "Explore completed construction, facility services, property restoration, and trade projects by Xandrea Harshey Services Inc. — serving Calgary, Alberta and beyond. $50M+ enterprise scale.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects Portfolio | Xandrea Harshey Services Inc.",
    description: "Construction, facility services, restoration, and trade projects across Calgary and Alberta.",
    url: `${site.url}/projects`,
  },
};

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Xandrea Harshey Services Inc. — Project Portfolio",
  description: "Completed construction, facility services, property restoration, and trade projects in Calgary, Alberta.",
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: p.title,
      description: p.outcome,
      provider: {
        "@type": "Organization",
        name: site.name,
        url: site.url,
      },
      locationCreated: {
        "@type": "City",
        name: "Calgary",
        addressRegion: "AB",
        addressCountry: "CA",
      },
    },
  })),
};

const categoryColors: Record<string, string> = {
  "Commercial Projects": "bg-navy text-cream",
  "Residential Projects": "bg-gold text-navy-deep",
  "Property Restoration": "bg-paper text-ink",
  "Facility Services Contracts": "bg-navy text-cream",
  "Hospitality Projects": "bg-gold text-navy-deep",
  "Special Projects": "bg-paper text-ink",
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb(
          [{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }],
          site.url
        )}
      />
      <JsonLd data={projectsJsonLd} />

      <PageHero
        eyebrow="Project Portfolio — Calgary, Alberta"
        titleLines={["Work that speaks", "for itself."]}
        intro="From ground-up construction and commercial developments to facility contracts and property restoration — a portfolio of projects delivered across Calgary, Alberta, and beyond. $50M+ enterprise scale."
        image={pageHeroImages.services}
      />

      {/* Stats bar */}
      <section className="bg-navy py-10">
        <div className="container-site">
          <Reveal className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
            {[
              { value: "$50M+", label: "Total Project Value" },
              { value: "6+", label: "Project Categories" },
              { value: "100%", label: "Canadian Owned" },
              { value: "Calgary", label: "Headquarters" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl text-gold">{s.value}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-eyebrow text-cream/60">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Project grid */}
      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading
              eyebrow="All Projects"
              lines={["Construction, facility,", "restoration & trade."]}
            />
          </div>

          <Reveal className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" stagger>
            {projects.map((p) => (
              <article
                key={p.title}
                className="group flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-white"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-navy-deep/20" />
                  <div className="absolute left-4 top-4">
                    <span
                      className={`rounded-sm px-3 py-1.5 font-sans text-xs uppercase tracking-eyebrow ${categoryColors[p.category] ?? "bg-paper text-ink"}`}
                    >
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-sm bg-gold px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-eyebrow text-navy-deep">
                    {p.value}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-serif text-xl text-ink">{p.title}</h2>
                  <p className="mt-1 font-sans text-xs text-ink/50">{p.timeline} · {p.scope}</p>
                  <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-ink/70">{p.outcome}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Capability breakdown */}
      <section className="bg-paper py-section">
        <div className="container-site max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="Project Categories"
              lines={["We deliver across", "every discipline."]}
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {projectCategories.filter((c) => c !== "All").map((cat) => (
                <div key={cat} className="flex items-center gap-3 border-l-2 border-gold pl-4 py-2">
                  <span className="font-sans text-sm text-ink/80">{cat}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-section text-cream">
        <div className="container-site max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow mb-6 block text-gold-light">Start Your Project</span>
            <h2 className="font-serif text-display-md leading-snug text-cream">
              Ready to Build Something Great?
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-cream/70">
              From construction and facility management to property restoration — our team delivers
              across every discipline. Serving Calgary and Alberta.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-gold">
                <span>Get a Quote</span>
              </Link>
              <Link href="/companies" className="btn-light">
                <span>Our Companies</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
