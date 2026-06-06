import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LeaderProfile from "@/components/sections/LeaderProfile";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { leaders, leadershipFeatures, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Leadership Team — Board & Executives",
  description:
    "Meet the leadership of Xandrea Harshey Services Inc.: Alejandro Pagcaliwagan (Chairman of the Board), Ajit Hardasani (President), and Harlem Pagcaliwagan (Chief Operating Officer).",
  alternates: { canonical: "/leadership" },
  openGraph: {
    title: "Leadership Team | Xandrea Harshey Services Inc.",
    description: "Strong leadership, operational discipline, and long-term vision.",
    url: `${site.url}/leadership`,
  },
};

// Person schema enriched with the full bio for stronger entity signals.
const peopleJsonLd = {
  "@context": "https://schema.org",
  "@graph": leaders.map((l) => ({
    "@type": "Person",
    name: l.name,
    jobTitle: l.title,
    description: l.bio.join(" "),
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
  })),
};

export default function LeadershipPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "Leadership", path: "/leadership" }], site.url)}
      />
      <JsonLd data={peopleJsonLd} />

      <PageHero
        eyebrow="Leadership Team"
        titleLines={["The people behind", "the enterprise."]}
        intro="Building organizations through strong leadership, operational discipline, strategic partnerships, and long-term thinking."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Full verbatim bios as crawlable page content */}
      {leaders.map((leader, i) => (
        <LeaderProfile key={leader.slug} leader={leader} index={i} />
      ))}

      {/* Leadership Section Features */}
      <section className="bg-navy text-cream py-section">
        <div className="container-site">
          <div className="mb-12 max-w-2xl">
            <SectionHeading
              light
              eyebrow="How We Lead"
              lines={["A leadership team", "built for the long term."]}
            />
          </div>
          <Reveal className="grid gap-px overflow-hidden rounded-sm border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-5" stagger>
            {leadershipFeatures.map((f) => (
              <div key={f} className="bg-navy p-7 text-center">
                <p className="font-sans text-sm leading-relaxed text-cream/80">{f}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
