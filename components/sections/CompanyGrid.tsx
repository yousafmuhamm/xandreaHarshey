"use client";

/**
 * "Our Companies" — an asymmetric, near full-bleed image grid (the template's
 * featured-listings feel). Tiles vary in size; each is a large image with the
 * company name + tagline overlaid, a hover zoom, and a blurb that slides up on
 * hover. Tiles fade/rise in on scroll.
 */
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { companies } from "@/data/content";

// Asymmetric column spans + heights per tile (desktop). Big tile alternates
// sides row-to-row so the grid never reads as equal cards.
const layout = [
  "md:col-span-7 md:h-[68vh]",
  "md:col-span-5 md:h-[68vh]",
  "md:col-span-5 md:h-[58vh]",
  "md:col-span-7 md:h-[58vh]",
];

export default function CompanyGrid() {
  return (
    <section className="bg-cream py-section">
      <div className="container-site mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Our Companies"
          lines={["A group of businesses,", "one standard of excellence."]}
        />
        <Reveal>
          <Link
            href="/companies"
            className="link-underline shrink-0 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/70 hover:text-ink"
          >
            View all companies
          </Link>
        </Reveal>
      </div>

      {/* Near full-bleed grid */}
      <Reveal
        className="grid grid-cols-1 gap-2 px-2 md:grid-cols-12 md:gap-3 md:px-3"
        stagger
      >
        {companies.map((c, i) => (
          <Link
            key={c.slug}
            href={`/companies#${c.slug}`}
            data-cursor="View"
            className={`group relative block h-[58vh] overflow-hidden bg-navy-deep ${layout[i] ?? "md:col-span-6 md:h-[58vh]"}`}
          >
            <Image
              src={c.image}
              alt={c.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <span className="eyebrow text-gold-light">{c.tagline}</span>
              <h3 className="mt-3 font-serif text-3xl text-white md:text-4xl">
                {c.name}
              </h3>

              {/* Slide-up reveal on hover */}
              <div className="grid grid-rows-[0fr] transition-all duration-700 ease-luxe group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="max-w-md pt-4 font-sans text-sm leading-relaxed text-white/80">
                    {c.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-eyebrow text-gold-light">
                    Explore
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
