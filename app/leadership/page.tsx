import type { Metadata } from "next";
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
    "Meet the Calgary-based leadership of Xandrea Harshey Services Inc.: Alejandro Pagcaliwagan (Chairman of the Board), Ajit Hardasani (General Manager), and Harlem Pagcaliwagan (Chief Operating Officer).",
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
        intro="Calgary-based leadership overseeing operating divisions, project execution, and strategic ventures."
        image={pageHeroImages.leadership}
        compact
      />

      {/* Full verbatim bios as crawlable page content */}
      {leaders.map((leader, i) => (
        <LeaderProfile key={leader.slug} leader={leader} index={i} />
      ))}

      {/* Leadership Section Features */}
      <section className="relative overflow-hidden bg-navy py-[clamp(4.5rem,10vw,8.5rem)] text-cream">
        <div className="container-site">
          <div className="max-w-2xl">
            <SectionHeading
              light
              eyebrow="How We Lead"
              lines={["A leadership team", "built for the long term."]}
            />
          </div>

          <Reveal
            as="ul"
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-5"
            stagger
          >
            {leadershipFeatures.map((f) => (
              <li key={f} className="min-w-0">
                <div className="flex min-h-24 w-full items-center justify-center rounded-full border border-cream/18 bg-cream/[0.045] px-5 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] md:min-h-28 lg:px-6">
                  <span className="max-w-[13rem] font-sans text-sm leading-snug text-cream/86 md:text-[0.95rem]">
                    {f}
                  </span>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
