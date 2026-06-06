import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ServiceMatrix from "@/components/sections/ServiceMatrix";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { capabilities, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Services & Capabilities — Eight Capability Areas",
  description:
    "An interactive service matrix of Xandrea Harshey's capabilities: construction & development, facility services, hospitality, international trade, entertainment & events, strategic ventures, property services, and project management.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Capabilities | Xandrea Harshey Services Inc.",
    description: "Capabilities across every division of a diversified Canadian enterprise.",
    url: `${site.url}/services`,
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": capabilities.map((c) => ({
    "@type": "Service",
    name: c.title,
    description: c.blurb,
    provider: { "@type": "Organization", name: site.name },
    areaServed: { "@type": "Country", name: "Canada" },
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
        eyebrow="Services & Capabilities"
        titleLines={["Capabilities across", "every division."]}
        intro="An interactive service matrix displaying all company capabilities across divisions — hover or tap any area to explore."
      />

      <ServiceMatrix withHeading={false} />

      <ContactCTA />
    </>
  );
}
