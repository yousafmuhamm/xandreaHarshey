"use client";

/**
 * Interior page header. Sits below the (solid) fixed header with top padding,
 * shows an eyebrow + masked-reveal title + optional intro, over an optional
 * dark image. Used by every sub-page for a consistent editorial open.
 */
import Image from "next/image";
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";

export default function PageHero({
  eyebrow,
  titleLines,
  intro,
  image,
  compact = false,
}: {
  eyebrow: string;
  titleLines: string[];
  intro?: string;
  image?: string;
  compact?: boolean;
}) {
  const dark = Boolean(image);
  const spacing = compact
    ? "pb-[clamp(3.5rem,7vw,6.5rem)] pt-28 md:pt-40"
    : "pb-section pt-28 md:pt-48";

  return (
    <section
      className={`relative overflow-hidden ${dark ? "bg-navy-deep text-cream" : "bg-cream text-ink"}`}
    >
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/50" />
        </>
      )}

      <div className={`container-site relative z-10 ${spacing}`}>
        <Reveal immediate>
          <span className={`eyebrow mb-6 block ${dark ? "text-gold-light" : "text-gold-deep"}`}>
            {eyebrow}
          </span>
        </Reveal>
        <RevealText
          as="h1"
          lines={titleLines}
          immediate
          delay={0.15}
          className={`max-w-5xl font-serif text-display-lg ${dark ? "text-cream" : "text-ink"}`}
        />
        {intro && (
          <Reveal className="mt-8 max-w-2xl" immediate delay={0.25}>
            <p
              className={`font-sans text-base leading-relaxed md:text-lg ${
                dark ? "text-cream/75" : "text-ink/70"
              }`}
            >
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
