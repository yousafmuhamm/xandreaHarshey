import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { contact, inquiryCategories, contactFeatures, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact & Consultation — Let's Build Something Great",
  description:
    "Contact Xandrea Harshey Services Inc. Corporate headquarters in Calgary, Alberta, Canada. Request a consultation or quote for construction, facility services, partnerships, investor relations, and more.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Consultation | Xandrea Harshey Services Inc.",
    description: "Corporate headquarters in Calgary, Alberta. Let's build something great together.",
    url: `${site.url}/contact`,
  },
};

// Map a hero CTA's ?type= to a default inquiry category.
const typeToCategory: Record<string, string> = {
  partnership: "Partnership Opportunities",
  investor: "Investor Relations",
  media: "Media Inquiries",
  careers: "Career Applications",
  construction: "Construction Projects",
  facility: "Facility Services",
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const defaultCategory =
    (searchParams?.type && typeToCategory[searchParams.type]) || "General Inquiries";

  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }], site.url)}
      />

      <PageHero
        eyebrow={contact.eyebrow}
        titleLines={["Let's Build Something", "Great Together."]}
        intro={`Our corporate headquarters is in ${contact.hq}. Whether you're a client, partner, or investor, our team is ready to help.`}
      />

      <section className="bg-cream py-section">
        <div className="container-site grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Info column */}
          <div>
            <Reveal>
              <h2 className="eyebrow text-ink/50">{contact.hqHeading}</h2>
              <p className="mt-3 font-serif text-2xl text-ink">{contact.hq}</p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-3 inline-block font-sans text-sm text-ink/70 hover:text-ink"
              >
                {site.email}
              </a>
            </Reveal>

            <Reveal className="mt-10">
              <h3 className="eyebrow mb-4 text-ink/50">Inquiry Categories</h3>
              <ul className="space-y-2">
                {inquiryCategories.map((c) => (
                  <li key={c} className="flex items-center gap-3 font-sans text-sm text-ink/75">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10">
              <h3 className="eyebrow mb-4 text-ink/50">Contact Features</h3>
              <ul className="flex flex-wrap gap-2">
                {contactFeatures.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-ink/15 px-4 py-2 font-sans text-xs text-ink/70"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Form column */}
          <div>
            <ContactForm defaultCategory={defaultCategory} />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-paper pb-section">
        <div className="container-site">
          <Reveal>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm border border-ink/10 grayscale">
              <iframe
                title="Xandrea Harshey Services Inc. — Calgary, Alberta"
                src="https://maps.google.com/maps?q=Calgary%2C%20Alberta%2C%20Canada&t=&z=11&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
