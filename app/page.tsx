import Hero from "@/components/sections/Hero";
import WelcomeImage from "@/components/sections/WelcomeImage";
import StatBand from "@/components/sections/StatBand";
import IntroStatement from "@/components/sections/IntroStatement";
import CompanyGrid from "@/components/sections/CompanyGrid";
import SplitFeature from "@/components/sections/SplitFeature";
import ServiceMatrix from "@/components/sections/ServiceMatrix";
import ProjectsPreview from "@/components/sections/ProjectsPreview";
import Leadership from "@/components/sections/Leadership";
import RecognitionStrip from "@/components/sections/RecognitionStrip";
import ContactCTA from "@/components/sections/ContactCTA";
import { companies } from "@/data/content";

/**
 * Home — a warm, image-led single page following the template's rhythm:
 * cinematic hero video → breathtaking full-bleed home still → warm intro →
 * standout stat band → asymmetric companies grid → full-bleed division feature
 * → capabilities index → featured projects gallery → leadership → recognition
 * → full-bleed contact CTA.
 */
const division = companies.find((c) => c.slug === "construction-property-services")!;

export default function HomePage() {
  return (
    <>
      <Hero />
      <WelcomeImage />
      <IntroStatement />
      <StatBand />
      <CompanyGrid />

      {/* Full-bleed division feature */}
      <SplitFeature
        fullBleed
        eyebrow="Construction & Property Services"
        headingLines={["Building trust,", "creating value."]}
        body={[division.blurb!]}
        bullets={division.extra?.items}
        image={division.image}
        imageAlt={division.imageAlt}
        cta={{ label: "Explore the Division", href: `/companies#${division.slug}` }}
      />

      <ServiceMatrix />
      <ProjectsPreview />
      <Leadership preview />
      <RecognitionStrip />
      <ContactCTA />
    </>
  );
}
