import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ProjectsGallery from "@/components/sections/ProjectsGallery";
import BeforeAfterSlider from "@/components/sections/BeforeAfterSlider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { projects, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Projects & Portfolio — Featured Work",
  description:
    "Featured projects from Xandrea Harshey Services Inc. across commercial, residential, property restoration, facility services, hospitality, and special projects — with before & after photography.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects & Portfolio | Xandrea Harshey Services Inc.",
    description: "Selected work across construction, restoration, facility services, and hospitality.",
    url: `${site.url}/projects`,
  },
};

const portfolioJsonLd = {
  "@context": "https://schema.org",
  "@graph": projects.map((p) => ({
    "@type": "CreativeWork",
    name: p.title,
    about: p.category,
    description: p.scope,
    creator: { "@type": "Organization", name: site.name },
  })),
};

const BEFORE =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80";
const AFTER =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }], site.url)}
      />
      <JsonLd data={portfolioJsonLd} />

      <PageHero
        eyebrow="Projects & Portfolio"
        titleLines={["Selected work", "across the group."]}
        intro="Showcasing professional projects with before & after photography, project value, timelines, scope of work, client objectives, and outcomes."
      />

      {/* Before & After feature */}
      <section className="bg-paper py-section">
        <div className="container-site">
          <div className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Before & After Photography"
              lines={["See the", "transformation."]}
            />
            <Reveal className="mt-6">
              <p className="font-sans text-base leading-relaxed text-ink/70">
                Drag the handle to compare a property before and after our team's work — restoration,
                renovation, and finishing delivered to an exceptional standard.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <BeforeAfterSlider
              before={BEFORE}
              after={AFTER}
              beforeAlt="Property before restoration — construction in progress"
              afterAlt="Property after restoration — finished modern interior"
            />
          </Reveal>
        </div>
      </section>

      <ProjectsGallery />

      <ContactCTA />
    </>
  );
}
