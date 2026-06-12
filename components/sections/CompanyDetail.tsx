"use client";

/**
 * Full company section for the /companies page: alternating editorial split
 * with parallax image, tagline, name, blurb, a services list, and an optional
 * "extra" panel (e.g. Why Choose Xandrea). Anchored by slug for deep links.
 */
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";
import AnimatedImage from "@/components/motion/AnimatedImage";
import Image from "next/image";
import type { Company } from "@/data/content";

export default function CompanyDetail({
  company,
  index,
}: {
  company: Company;
  index: number;
}) {
  const reverse = index % 2 === 1;
  const bg = index % 2 === 1 ? "bg-paper" : "bg-cream";

  return (
    <section id={company.slug} className={`${bg} scroll-mt-24 py-section`}>
      <div className="container-site grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={reverse ? "lg:order-2" : "lg:order-1"}>
          <div className="relative">
            <AnimatedImage
              src={company.image}
              alt={company.imageAlt}
              parallax
              ratioClass="aspect-[4/5]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {company.logo && (
              <>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/35 via-navy-deep/10 to-navy-deep/25"
                  aria-hidden
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 md:px-12">
                  <Image
                    src={company.logo}
                    alt=""
                    width={620}
                    height={620}
                    className="h-auto max-h-[42%] w-auto max-w-[72%] object-contain opacity-90 drop-shadow-[0_2px_18px_rgba(14,26,43,0.55)]"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className={reverse ? "lg:order-1" : "lg:order-2"}>
          <Reveal>
            <span className="eyebrow mb-4 block text-gold-deep">
              {String(index + 1).padStart(2, "0")} / {company.tagline}
            </span>
          </Reveal>
          <RevealText lines={[company.name]} className="font-serif text-display-md text-ink" />

          {company.blurb && (
            <Reveal className="mt-6">
              <p className="font-sans text-base leading-relaxed text-ink/70">{company.blurb}</p>
            </Reveal>
          )}

          <Reveal className="mt-10">
            <h3 className="eyebrow mb-5 text-ink/65">Services</h3>
          </Reveal>
          <Reveal className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2" stagger>
            {company.services.map((s) => (
              <div key={s} className="flex items-center gap-3 border-b border-ink/10 pb-3 font-sans text-sm text-ink/80">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {s}
              </div>
            ))}
          </Reveal>

          {company.extra && (
            <div className="mt-10">
              <Reveal>
                <h3 className="eyebrow mb-5 text-ink/65">{company.extra.heading}</h3>
              </Reveal>
              <Reveal className="flex flex-wrap gap-2" stagger>
                {company.extra.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-4 py-2 font-sans text-xs text-ink/75"
                  >
                    {item}
                  </span>
                ))}
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
