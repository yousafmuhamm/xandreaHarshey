import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import SplitFeature from "@/components/sections/SplitFeature";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { about, site } from "@/data/content";

export const metadata: Metadata = {
  title: "About — Mission, Vision & Core Values",
  description:
    "Xandrea Harshey Services Inc. is a diversified Canadian business group focused on building sustainable businesses and delivering long-term value. Learn our history, mission, vision, and core values.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Xandrea Harshey Services Inc.",
    description:
      "A diversified Canadian business group focused on building sustainable businesses and creating long-term value.",
    url: `${site.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }], site.url)}
      />

      <PageHero
        eyebrow={about.eyebrow}
        titleLines={["A diversified Canadian", "business group built", "on trust."]}
        intro={about.intro}
      />

      {/* Intro continuation */}
      <section className="bg-cream pb-section">
        <div className="container-site max-w-3xl">
          <Reveal>
            <p className="font-sans text-lg leading-relaxed text-ink/70">{about.intro2}</p>
          </Reveal>
        </div>
      </section>

      {/* Company History */}
      <SplitFeature
        eyebrow="Our Story"
        headingLines={[about.history.heading]}
        body={about.history.body}
        image={about.image}
        imageAlt={about.imageAlt}
        theme="paper"
        reverse
      />

      {/* Mission & Vision */}
      <section className="bg-navy text-cream py-section">
        <div className="container-site grid gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <span className="eyebrow mb-5 block text-gold-light">{about.mission.heading}</span>
            <p className="font-serif text-2xl leading-snug text-cream md:text-3xl">
              {about.mission.body}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow mb-5 block text-gold-light">{about.vision.heading}</span>
            <p className="font-serif text-2xl leading-snug text-cream md:text-3xl">
              {about.vision.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading eyebrow="What We Stand For" lines={[about.values.heading]} />
          </div>
          <Reveal className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3" stagger>
            {about.values.items.map((v, i) => (
              <div key={v.name} className="group bg-cream p-8 transition-colors duration-500 hover:bg-paper">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-2xl text-ink">{v.name}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65">{v.blurb}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="bg-paper py-section">
        <div className="container-site max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow mb-6 block text-gold">{about.philosophy.heading}</span>
          </Reveal>
          <SectionHeading align="center" lines={[about.philosophy.body]} as="h2" />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
