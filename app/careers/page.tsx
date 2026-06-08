import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import CareersForm from "@/components/forms/CareersForm";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { careers, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Careers — Build Your Future With Xandrea",
  description:
    "Join Xandrea Harshey Services Inc. Explore current opportunities, employee benefits, training programs, leadership development, and career advancement pathways across our diversified Canadian enterprise.",
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

      {/* Features */}
      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading eyebrow="Why Join Us" lines={["Room to grow,", "real opportunity."]} />
          </div>
          <Reveal className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3" stagger>
            {careers.features.map((f, i) => (
              <div key={f} className="bg-cream p-8">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-xl text-ink">{f}</h3>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Application form */}
      <section className="bg-paper py-section">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Apply Now" lines={["Start the", "conversation."]} />
            <Reveal className="mt-6">
              <p className="font-sans text-base leading-relaxed text-ink/70">
                Submit a general application or express interest in a specific area, and our team
                will be in touch about current and upcoming opportunities.
              </p>
            </Reveal>
          </div>
          <div>
            <CareersForm />
          </div>
        </div>
      </section>
    </>
  );
}
