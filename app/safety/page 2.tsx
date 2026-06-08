import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import SplitFeature from "@/components/sections/SplitFeature";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { safety, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Safety & Quality Standards",
  description:
    "Safety and quality are integrated into every aspect of Xandrea Harshey's operations: fully insured operations, WCB coverage, safety training, quality control systems, regulatory compliance, and continuous improvement.",
  alternates: { canonical: "/safety" },
  openGraph: {
    title: "Safety & Quality Standards | Xandrea Harshey Services Inc.",
    description: "Fully insured, WCB-covered operations with rigorous quality control.",
    url: `${site.url}/safety`,
  },
};

export default function SafetyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "Safety", path: "/safety" }], site.url)}
      />

      <PageHero
        eyebrow={safety.eyebrow}
        titleLines={["Safety and quality,", "built into everything", "we do."]}
        intro={safety.heading}
        image={safety.image}
      />

      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading eyebrow="Standards Include" lines={["Eight commitments", "to every project."]} />
          </div>
          <Reveal className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4" stagger>
            {safety.standards.map((s, i) => (
              <div key={s.name} className="group bg-cream p-8 transition-colors duration-500 hover:bg-paper">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-xl text-ink">{s.name}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65">{s.blurb}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <SplitFeature
        eyebrow="Operational Discipline"
        headingLines={["Quality you can", "build on."]}
        body={[
          "From the first site audit to final handover, our teams operate to documented quality-control systems and professional project-management standards.",
          "Fully insured operations and WCB coverage protect every client, project, and crew member — while continuous improvement programs ensure we get better with every build.",
        ]}
        image={safety.image}
        imageAlt={safety.imageAlt}
        theme="paper"
        reverse
      />

      <ContactCTA />
    </>
  );
}
