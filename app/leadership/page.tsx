import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import LeaderProfile from "@/components/sections/LeaderProfile";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { leaders, leadershipFeatures, pageHeroImages, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Leadership Team — Calgary Board & Executives | Xandrea Harshey",
  description:
    "Meet the Calgary-based leadership of Xandrea Harshey Services Inc.: Alejandro Pagcaliwagan (Chairman of the Board), Ajit Hardasani (President), and Harlem Pagcaliwagan (Chief Operating Officer).",
  alternates: { canonical: "/leadership" },
  openGraph: {
    title: "Leadership Team | Xandrea Harshey Services Inc. — Calgary, Alberta",
    description: "Strong leadership, operational discipline, and long-term vision — based in Calgary, Alberta.",
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
        eyebrow="Leadership Team — Calgary, Alberta"
        titleLines={["The people behind", "the enterprise."]}
        intro="Building organizations through strong leadership, operational discipline, strategic partnerships, and long-term thinking. Based in Calgary, Alberta."
        image={pageHeroImages.leadership}
      />

      {/* Last updated + context links */}
      <section className="bg-cream pb-10 pt-2">
        <div className="container-site max-w-3xl">
          <Reveal>
            <p className="mb-3 font-sans text-xs text-ink/40">Last Updated: June 2026</p>
            <p className="font-sans text-base leading-relaxed text-ink/65">
              The leadership team of Xandrea Harshey Services Inc. oversees four Calgary-based operating
              divisions and a growing portfolio of strategic ventures. Explore our{" "}
              <Link href="/companies" className="link-underline text-ink hover:text-gold">
                operating companies
              </Link>
              , review{" "}
              <Link href="/projects" className="link-underline text-ink hover:text-gold">
                completed projects
              </Link>
              , or learn more{" "}
              <Link href="/about" className="link-underline text-ink hover:text-gold">
                about the organization
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

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
