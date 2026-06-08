import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { safety, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Safety & Quality Standards | Xandrea Harshey Services Inc. Calgary",
  description:
    "Xandrea Harshey Services Inc. maintains rigorous safety and quality standards across all Calgary operations — WCB coverage, fully insured, site audits, regulatory compliance, and continuous improvement.",
  alternates: { canonical: "/safety" },
  openGraph: {
    title: "Safety & Quality Standards | Xandrea Harshey Services Inc.",
    description: "WCB coverage, full insurance, safety training, and quality systems — Calgary construction and facility services.",
    url: `${site.url}/safety`,
  },
};

const safetyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Safety & Quality Standards — Xandrea Harshey Services Inc.",
  description: safety.heading,
  url: `${site.url}/safety`,
  provider: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
  },
  about: safety.standards.map((s) => ({
    "@type": "Thing",
    name: s.name,
    description: s.blurb,
  })),
};

export default function SafetyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb(
          [{ name: "Home", path: "/" }, { name: "Safety", path: "/safety" }],
          site.url
        )}
      />
      <JsonLd data={safetyJsonLd} />

      <PageHero
        eyebrow="Safety & Quality — Calgary, Alberta"
        titleLines={["Safety first.", "Quality always."]}
        intro="Every project delivered by Xandrea Harshey Services Inc. and its divisions operates under rigorous safety and quality standards — WCB covered, fully insured, and continuously improving across all Calgary and Alberta operations."
        image={safety.image}
      />

      {/* Key credentials */}
      <section className="bg-navy py-12">
        <div className="container-site">
          <Reveal className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { label: "WCB Coverage", desc: "Workers' Compensation Board" },
              { label: "Fully Insured", desc: "Comprehensive Coverage" },
              { label: "Safety Certified", desc: "Trained Workforce" },
              { label: "Quality Assured", desc: "Every Project Stage" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center">
                <span className="font-sans text-xs text-gold uppercase tracking-eyebrow">{b.desc}</span>
                <span className="mt-1 font-serif text-xl text-cream">{b.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Standards grid */}
      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading
              eyebrow={safety.eyebrow}
              lines={["Eight standards that", "protect every project."]}
            />
          </div>
          <Reveal
            className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4"
            stagger
          >
            {safety.standards.map((s, i) => (
              <div key={s.name} className="bg-cream p-8">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-4 font-serif text-xl text-ink">{s.name}</h2>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65">{s.blurb}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WCB spotlight */}
      <section className="bg-paper py-section">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="WCB Alberta"
              lines={["Workers protected.", "Clients protected."]}
            />
            <p className="mt-6 font-sans text-base leading-relaxed text-ink/70">
              All operations under Xandrea Harshey Services Inc. — including{" "}
              <Link href="/construction" className="link-underline text-ink hover:text-gold">
                G-Pinoy Construction & Development
              </Link>{" "}
              and{" "}
              <Link href="/facility-services" className="link-underline text-ink hover:text-gold">
                Xandrea Facility Services
              </Link>{" "}
              — maintain active WCB Alberta coverage. This protects workers in the event of
              workplace injuries and gives clients confidence that they are working with a
              compliant, responsible contractor.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              Our WCB standing is verified annually and maintained in good standing across all
              Calgary and Alberta project sites.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={safety.image}
                alt={safety.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quality philosophy */}
      <section className="bg-navy py-section text-cream">
        <div className="container-site max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow mb-6 block text-gold-light">Our Philosophy</span>
            <h2 className="font-serif text-display-sm leading-snug text-cream md:text-display-md">
              {safety.heading}
            </h2>
            <p className="mt-8 font-sans text-base leading-relaxed text-cream/70">
              We don't treat safety as a compliance checkbox — it's embedded in how we hire,
              train, plan, and execute every project. From site audits to continuous improvement
              programs, every Xandrea Harshey division is held to the same rigorous standard.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-section">
        <div className="container-site max-w-3xl">
          <Reveal>
            <span className="eyebrow mb-10 block text-gold">Safety Questions</span>
          </Reveal>
          <div className="divide-y divide-ink/10">
            {[
              {
                q: "Is Xandrea Harshey Services Inc. WCB covered?",
                a: "Yes. Xandrea Harshey Services Inc. and all its divisions maintain active Workers' Compensation Board (WCB) coverage for all workers on Calgary and Alberta project sites.",
              },
              {
                q: "Are Xandrea Harshey's construction crews fully insured?",
                a: "Yes. All Xandrea Harshey Services Inc. operations are fully insured with comprehensive liability coverage, protecting both clients and workers on every project.",
              },
              {
                q: "What safety training do Xandrea Harshey workers receive?",
                a: "All crew members undergo ongoing safety training programs designed to keep workers current with Alberta workplace safety regulations and industry best practices.",
              },
              {
                q: "How does Xandrea Harshey ensure quality on construction projects?",
                a: "Structured QC checkpoints are applied at every stage of each project, supported by site audits, professional project management, and continuous improvement programs.",
              },
            ].map(({ q, a }) => (
              <Reveal key={q} className="py-8">
                <h2 className="font-serif text-xl text-ink md:text-2xl">{q}</h2>
                <p className="mt-3 font-sans text-base leading-relaxed text-ink/70">{a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Is Xandrea Harshey Services Inc. WCB covered?", acceptedAnswer: { "@type": "Answer", text: "Yes. Xandrea Harshey Services Inc. and all its divisions maintain active Workers' Compensation Board (WCB) coverage for all workers on Calgary and Alberta project sites." } },
            { "@type": "Question", name: "Are Xandrea Harshey's construction crews fully insured?", acceptedAnswer: { "@type": "Answer", text: "Yes. All Xandrea Harshey Services Inc. operations are fully insured with comprehensive liability coverage, protecting both clients and workers on every project." } },
            { "@type": "Question", name: "What safety training do Xandrea Harshey workers receive?", acceptedAnswer: { "@type": "Answer", text: "All crew members undergo ongoing safety training programs designed to keep workers current with Alberta workplace safety regulations and industry best practices." } },
            { "@type": "Question", name: "How does Xandrea Harshey ensure quality on construction projects?", acceptedAnswer: { "@type": "Answer", text: "Structured QC checkpoints are applied at every stage of each project, supported by site audits, professional project management, and continuous improvement programs." } },
          ],
        }}
      />

      <ContactCTA />
    </>
  );
}
