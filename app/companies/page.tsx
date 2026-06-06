import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CompanyDetail from "@/components/sections/CompanyDetail";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { companies, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Our Companies — Construction, Facility Services & Trade",
  description:
    "Explore the companies of Xandrea Harshey Services Inc.: G-Pinoy Construction & Development, Xandrea Facility Services, Primeport Commodity, and the Construction & Property Services Division.",
  alternates: { canonical: "/companies" },
  openGraph: {
    title: "Our Companies | Xandrea Harshey Services Inc.",
    description:
      "A group of businesses across construction, facility services, international trade, and property services.",
    url: `${site.url}/companies`,
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Xandrea Harshey Services Inc. — Companies & Divisions",
  itemListElement: companies.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    description: c.tagline,
    url: `${site.url}/companies#${c.slug}`,
  })),
};

export default function CompaniesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "Companies", path: "/companies" }], site.url)}
      />
      <JsonLd data={itemListJsonLd} />

      <PageHero
        eyebrow="Our Companies"
        titleLines={["A group of businesses,", "one standard of", "excellence."]}
        intro="Xandrea Harshey Services Inc. operates through multiple business divisions and strategic ventures — each built to deliver exceptional results while creating synergies across industries."
        image="https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=2000&q=80"
      />

      {companies.map((company, i) => (
        <CompanyDetail key={company.slug} company={company} index={i} />
      ))}

      <ContactCTA />
    </>
  );
}
