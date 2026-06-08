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

      {/* Crawlable intro — gives Google indexable body text about who we are and
          where we operate, since the hero and company grid are image-led. */}
      <section className="bg-cream py-16">
        <div className="container-site max-w-3xl">
          <p className="font-sans text-lg leading-relaxed text-ink/70">
            Xandrea Harshey Services Inc. is a Calgary-based, 100% Canadian-owned
            diversified enterprise operating across construction, facility management,
            international trade, and hospitality. Through our four operating companies —
            G-Pinoy Construction &amp; Development, Xandrea Facility Services, Primeport
            Commodity, and our Construction &amp; Property Services division — we deliver
            integrated solutions for commercial, residential, and industrial clients
            across Alberta and Canada.
          </p>
        </div>
      </section>

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
