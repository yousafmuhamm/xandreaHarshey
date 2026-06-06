"use client";

/**
 * "Our Companies" tile grid — each card has hover image zoom + overlay text
 * slide-up (the Carolwood listings hover). Cards stagger in on scroll.
 */
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { companies } from "@/data/content";

export default function CompanyGrid() {
  return (
    <section className="bg-cream py-section">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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

        <Reveal className="grid gap-6 md:grid-cols-2" stagger>
          {companies.map((c) => (
            <Link
              key={c.slug}
              href={`/companies#${c.slug}`}
              data-cursor="View"
              className="group relative block aspect-[16/11] overflow-hidden rounded-sm bg-navy-deep"
            >
              <Image
                src={c.image}
                alt={c.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <span className="eyebrow text-gold-light">{c.tagline}</span>
                <h3 className="mt-3 font-serif text-2xl text-white md:text-3xl">{c.name}</h3>

                {/* slide-up reveal on hover */}
                <div className="grid grid-rows-[0fr] transition-all duration-700 ease-luxe group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-4 font-sans text-sm leading-relaxed text-white/80">
                      {c.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-eyebrow text-gold-light">
                      Explore
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
