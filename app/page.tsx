import Hero from "@/components/sections/Hero";
import WelcomeImage from "@/components/sections/WelcomeImage";
import TrustRow from "@/components/sections/TrustRow";
import CompanyGrid from "@/components/sections/CompanyGrid";
import SplitFeature from "@/components/sections/SplitFeature";
import ContactCTA from "@/components/sections/ContactCTA";
import { companies } from "@/data/content";

/**
 * Home — a lean, image-led gallery:
 *   hero (video + glass stat panel)
 *   → full-bleed welcome still ("Who We Are")
 *   → trusted-standards row
 *   → Our Companies image grid
 *   → International Trade feature
 *   → contact CTA → footer.
 *
 * Not on the landing (each lives on its own page): the brand story (/about),
 * the Construction & Property feature (/companies), the leadership team
 * (/leadership), and the capabilities accordion (/services). The "by the
 * numbers" figures live in the hero.
 */
const trade = companies.find((c) => c.slug === "primeport-commodity")!;

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Welcome still + trusted standards, directly below the hero */}
      <WelcomeImage />
      <TrustRow />

      {/* Our Companies — the centerpiece */}
      <CompanyGrid />

      {/* Full-bleed feature — International Trade (image on the right) */}
      <SplitFeature
        fullBleed
        reverse
        theme="paper"
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
