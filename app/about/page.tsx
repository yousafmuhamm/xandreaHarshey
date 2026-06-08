import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import SplitFeature from "@/components/sections/SplitFeature";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import FaqAccordion from "@/components/ui/FaqAccordion";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { about, site } from "@/data/content";

export const metadata: Metadata = {
  title: "About — Mission, Vision & Core Values",
  description:
    "Xandrea Harshey Services Inc. is a diversified Canadian business group focused on building sustainable businesses and delivering long-term value. Learn our history, mission, vision, and core values.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Xandrea Harshey Services Inc.",
    description:
      "A diversified Canadian business group focused on building sustainable businesses and creating long-term value.",
    url: `${site.url}/about`,
  },
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Xandrea Harshey Services Inc.",
  description:
    "Xandrea Harshey Services Inc. is a diversified Canadian business group headquartered in Calgary, Alberta — delivering construction, facility services, international trade, and property services.",
  url: `${site.url}/about`,
  dateModified: "2026-06-07",
  inLanguage: "en-CA",
  about: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    foundingDate: "2018",
    foundingLocation: { "@type": "City", name: "Calgary" },
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }], site.url)}
      />
      <JsonLd data={aboutPageJsonLd} />

      <PageHero
        eyebrow={about.eyebrow}
        titleLines={["A diversified Canadian", "business group built", "on trust."]}
        intro={about.intro}
        image={about.image}
      />

      {/* Intro continuation */}
      <section className="bg-cream pb-section">
        <div className="container-site max-w-3xl">
          <Reveal>
            <p className="mb-2 font-sans text-xs text-ink/40">Last Updated: June 2026</p>
            <p className="font-sans text-lg leading-relaxed text-ink/70">
              {about.intro2} Our four operating divisions —{" "}
              <Link href="/construction" className="link-underline text-ink hover:text-gold">
                G-Pinoy Construction & Development
              </Link>
              ,{" "}
              <Link href="/facility-services" className="link-underline text-ink hover:text-gold">
                Xandrea Facility Services
              </Link>
              , Primeport Commodity, and the Construction & Property Services Division — deliver
              integrated solutions across{" "}
              <Link href="/services" className="link-underline text-ink hover:text-gold">
                eight capability areas
              </Link>{" "}
              serving clients in Calgary, Alberta, and beyond. Explore our{" "}
              <Link href="/companies" className="link-underline text-ink hover:text-gold">
                full company portfolio
              </Link>{" "}
              to learn what each division delivers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Company History */}
      <SplitFeature
        eyebrow="Our Story"
        headingLines={[about.history.heading]}
        body={about.history.body}
        image={about.historyImage}
        imageAlt={about.historyImageAlt}
        theme="paper"
        reverse
      />

      {/* Mission & Vision */}
      <section className="bg-navy text-cream py-section">
        <div className="container-site grid gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <span className="eyebrow mb-5 block text-gold-light">{about.mission.heading}</span>
            <p className="font-serif text-2xl leading-snug text-cream md:text-3xl">
              {about.mission.body}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow mb-5 block text-gold-light">{about.vision.heading}</span>
            <p className="font-serif text-2xl leading-snug text-cream md:text-3xl">
              {about.vision.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-cream py-section">
        <div className="container-site">
          <div className="mb-14 max-w-2xl">
            <SectionHeading eyebrow="What We Stand For" lines={[about.values.heading]} />
          </div>
          <Reveal className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3" stagger>
            {about.values.items.map((v, i) => (
              <div key={v.name} className="group bg-cream p-8 transition-colors duration-500 hover:bg-paper">
                <span className="font-sans text-xs text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-2xl text-ink">{v.name}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65">{v.blurb}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="bg-paper py-section">
        <div className="container-site max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow mb-6 block text-gold-deep">{about.philosophy.heading}</span>
          </Reveal>
          <SectionHeading align="center" lines={[about.philosophy.body]} as="h2" />
        </div>
      </section>

      {/* FAQ — accordion dropdowns for UX; FAQPage JSON-LD keeps AI search signals */}
      <section className="bg-cream py-section">
        <div className="container-site max-w-3xl">
          <Reveal>
            <span className="eyebrow mb-10 block text-gold">Frequently Asked Questions</span>
          </Reveal>
          <FaqAccordion
            items={[
              {
                q: "What is Xandrea Harshey Services Inc.?",
                a: "Xandrea Harshey Services Inc. is a diversified Canadian business group headquartered in Calgary, Alberta. Founded in 2018, the company operates four divisions — G-Pinoy Construction & Development, Xandrea Facility Services, Primeport Commodity, and a Construction & Property Services division — delivering integrated solutions across construction, facility management, international trade, and property services.",
              },
              {
                q: "What does Xandrea Harshey Services Inc. do?",
                a: "The company provides construction and development services, commercial facility management, international commodity trading, property renovation and restoration, hospitality ventures, and strategic business investments. Its eight capability areas serve commercial, residential, industrial, and multi-family clients across Alberta and Canada.",
              },
              {
                q: "Where is Xandrea Harshey Services Inc. headquartered?",
                a: "Xandrea Harshey Services Inc. is headquartered in Calgary, Alberta, Canada. The company primarily serves clients across Calgary and Alberta, with international trade operations extending to global markets through Primeport Commodity Inc.",
              },
              {
                q: "Who founded Xandrea Harshey Services Inc.?",
                a: "Xandrea Harshey Services Inc. was founded in 2018 in Calgary, Alberta. The company is led by Chairman Alejandro Pagcaliwagan, President Ajit Hardasani, and Chief Operating Officer Harlem Pagcaliwagan.",
              },
              {
                q: "Is Xandrea Harshey Services Inc. Canadian-owned?",
                a: "Yes. Xandrea Harshey Services Inc. is 100% Canadian-owned and operated, headquartered in Calgary, Alberta. The company is registered in Canada and all executive leadership is based in Calgary.",
              },
            ]}
          />
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is Xandrea Harshey Services Inc.?", acceptedAnswer: { "@type": "Answer", text: "Xandrea Harshey Services Inc. is a diversified Canadian business group headquartered in Calgary, Alberta, founded in 2018, operating across construction, facility management, international trade, and property services." } },
            { "@type": "Question", name: "What does Xandrea Harshey Services Inc. do?", acceptedAnswer: { "@type": "Answer", text: "The company provides construction and development, commercial facility management, international commodity trading, property renovation, hospitality ventures, and strategic business investments serving clients across Alberta and Canada." } },
            { "@type": "Question", name: "Where is Xandrea Harshey Services Inc. headquartered?", acceptedAnswer: { "@type": "Answer", text: "Xandrea Harshey Services Inc. is headquartered in Calgary, Alberta, Canada." } },
            { "@type": "Question", name: "Who founded Xandrea Harshey Services Inc.?", acceptedAnswer: { "@type": "Answer", text: "Xandrea Harshey Services Inc. was founded in 2018 in Calgary, Alberta. The company is led by Chairman Alejandro Pagcaliwagan, President Ajit Hardasani, and COO Harlem Pagcaliwagan." } },
            { "@type": "Question", name: "Is Xandrea Harshey Services Inc. Canadian-owned?", acceptedAnswer: { "@type": "Answer", text: "Yes. Xandrea Harshey Services Inc. is 100% Canadian-owned and operated, headquartered in Calgary, Alberta." } },
          ],
        }}
      />

      <ContactCTA />
    </>
  );
}
