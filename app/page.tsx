import Hero from "@/components/sections/Hero";
import CompanyGrid from "@/components/sections/CompanyGrid";
import TrustRow from "@/components/sections/TrustRow";
import WelcomeImage from "@/components/sections/WelcomeImage";
import SplitFeature from "@/components/sections/SplitFeature";
import ProjectsPreview from "@/components/sections/ProjectsPreview";
import ContactCTA from "@/components/sections/ContactCTA";
import { companies } from "@/data/content";

/**
 * Home — a lean, image-led gallery. Our Companies leads the scroll right after
 * the hero, then a thin trust row, a full-bleed welcome still, featured
 * projects, a single trade feature, and the contact CTA.
 *
 * Deliberately NOT on the landing (each lives on its own page): the brand
 * "story"/intro statement (/about), the Construction & Property division
 * feature (/companies), the leadership team (/leadership), the full
 * capabilities accordion (/services), and the deferred premium-features
 * section. The "by the numbers" figures are folded into the hero's glass panel.
 */
const trade = companies.find((c) => c.slug === "primeport-commodity")!;

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Our Companies — the centerpiece, second in the scroll */}
      <CompanyGrid />

      <TrustRow />

      <WelcomeImage />

      <ProjectsPreview />

      {/* Full-bleed feature — International Trade (image on the right) */}
      <SplitFeature
        fullBleed
        reverse
        theme="navy"
        eyebrow="International Trade"
        headingLines={["Connecting markets,", "delivering opportunity."]}
        body={[trade.blurb!]}
        image={trade.image}
        imageAlt={trade.imageAlt}
        cta={{ label: "Explore PrimePort", href: `/companies#${trade.slug}` }}
      />

      <ContactCTA />
    </>
  );
}
