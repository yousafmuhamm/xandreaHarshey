import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import CareersForm from "@/components/forms/CareersForm";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { careers, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Careers — Build Your Future With Xandrea",
  description:
    "Explore careers at Xandrea Harshey Services Inc. View current opportunities, learn about training and leadership development, and leave your resume for future roles across our Canadian enterprise.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers | Xandrea Harshey Services Inc.",
    description: "Build your future with a diversified Canadian business group.",
    url: `${site.url}/careers`,
  },
};

export default function CareersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }], site.url)}
      />

      <PageHero
        eyebrow={careers.eyebrow}
        titleLines={["Build Your Future", "With Xandrea."]}
        intro={careers.body}
        image={careers.image}
      />

      {/* Current opportunities */}
      <section className="bg-cream py-section" aria-labelledby="careers-opportunities">
        <div className="container-site">
          <div className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow={careers.opportunities.eyebrow}
              lines={careers.opportunities.headingLines}
            />
          </div>

          <Reveal>
            <div
              id="careers-opportunities"
              className="max-w-3xl rounded-sm border border-ink/10 bg-paper px-8 py-10 md:px-12 md:py-14"
            >
              <h3 className="font-serif text-2xl text-ink md:text-3xl">
                {careers.opportunities.emptyTitle}
              </h3>
              <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ink/70">
                {careers.opportunities.emptyBody}
              </p>
              <Link
                href="#leave-resume"
                className="link-underline mt-8 inline-block font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/75 hover:text-ink"
              >
                Leave your resume
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Growth pillars */}
      <section className="bg-navy py-section text-cream" aria-labelledby="careers-growth">
        <div className="container-site">
          <div id="careers-growth" className="mb-14 max-w-2xl">
            <SectionHeading
              light
              eyebrow="Why Join Us"
              lines={["Training, leadership,", "room to advance."]}
            />
          </div>

          <Reveal className="grid gap-10 md:grid-cols-3 md:gap-12" stagger>
            {careers.growthPillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-cream/15 pt-8">
                <h3 className="font-serif text-xl text-cream md:text-2xl">{pillar.title}</h3>
                <p className="mt-4 font-sans text-sm leading-relaxed text-cream/70 md:text-base">
                  {pillar.description}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Resume submission */}
      <section id="leave-resume" className="bg-paper py-section scroll-mt-28">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={careers.resume.eyebrow}
              lines={careers.resume.headingLines}
            />
            <Reveal className="mt-6">
              <p className="max-w-md font-sans text-base leading-relaxed text-ink/70">
                {careers.resume.intro}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <CareersForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
