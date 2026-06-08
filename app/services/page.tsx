import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ServiceMatrix from "@/components/sections/ServiceMatrix";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { capabilities, pageHeroImages, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Construction & Facility Services Calgary | Xandrea Harshey Services Inc.",
  description:
    "Calgary construction, facility management, international trade, and property services. Xandrea Harshey Services Inc. delivers eight integrated capability areas across Alberta and Canada.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Construction & Facility Services Calgary | Xandrea Harshey Services Inc.",
    description: "Eight integrated capability areas serving Calgary, Alberta, and Canada.",
    url: `${site.url}/services`,
  },
};

const internationalTitles = new Set(["International Trade"]);

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": capabilities.map((c) => ({
    "@type": "Service",
    name: c.title,
    description: c.blurb,
    provider: { "@type": "Organization", name: site.name },
    areaServed: internationalTitles.has(c.title)
      ? { "@type": "Country", name: "Canada" }
      : [
          { "@type": "City", name: "Calgary" },
          { "@type": "State", name: "Alberta" },
        ],
  })),
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }], site.url)}
      />
      <JsonLd data={servicesJsonLd} />

      <PageHero
        eyebrow="Services & Capabilities — Calgary, Alberta"
        titleLines={["Capabilities across", "every division."]}
        intro="Serving Calgary and Alberta with eight integrated capability areas — from construction and facility management to international trade and project delivery. Hover or tap any area to explore."
        image={pageHeroImages.services}
      />

      <ServiceMatrix withHeading={false} />

      <ContactCTA />
    </>
  );
}
