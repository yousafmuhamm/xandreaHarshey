import Hero from "@/components/sections/Hero";
import SplitFeature from "@/components/sections/SplitFeature";
import StatBand from "@/components/sections/StatBand";
import CompanyGrid from "@/components/sections/CompanyGrid";
import ServiceMatrix from "@/components/sections/ServiceMatrix";
import ProjectsPreview from "@/components/sections/ProjectsPreview";
import Leadership from "@/components/sections/Leadership";
import PremiumFeatures from "@/components/sections/PremiumFeatures";
import RecognitionStrip from "@/components/sections/RecognitionStrip";
import ContactCTA from "@/components/sections/ContactCTA";
import { overview } from "@/data/content";

/**
 * Home — long animated single page stitching the main sections, each
 * reproducing a Carolwood motion (see README "Animation map").
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Corporate Overview — "Who We Are" + Corporate Highlights */}
      <SplitFeature
        eyebrow={overview.eyebrow}
        headingLines={["Who We Are"]}
        body={overview.body}
        bullets={overview.highlights}
        image={overview.image}
        imageAlt="Calgary corporate skyline representing Xandrea Harshey's diversified enterprise"
        cta={{ label: "About the Company", href: "/about" }}
      />

      <StatBand />
      <CompanyGrid />
      <ServiceMatrix />
      <ProjectsPreview />
      <Leadership preview />
      <PremiumFeatures />
      <RecognitionStrip />
      <ContactCTA />
    </>
  );
}
