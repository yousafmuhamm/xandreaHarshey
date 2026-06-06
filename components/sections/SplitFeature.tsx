"use client";

/**
 * Editorial split block: large image one side, eyebrow + heading + body (+
 * optional bullets / CTA) the other — the Carolwood partner-section pattern.
 * Reversible and theme-aware (cream / navy / paper).
 *
 * `fullBleed` makes the image run flush to the viewport edge with the copy
 * given generous margins and a larger type scale (the homepage feature look).
 * Without it, the classic contained two-column layout is used (sub-pages).
 */
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";
import AnimatedImage from "@/components/motion/AnimatedImage";
import Image from "next/image";
import Button from "@/components/ui/Button";

type Props = {
  eyebrow?: string;
  headingLines: string[];
  body?: string[];
  bullets?: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  theme?: "cream" | "navy" | "paper";
  cta?: { label: string; href: string };
  ratioClass?: string;
  fullBleed?: boolean;
};

export default function SplitFeature({
  eyebrow,
  headingLines,
  body,
  bullets,
  image,
  imageAlt,
  reverse = false,
  theme = "cream",
  cta,
  ratioClass = "aspect-[4/5]",
  fullBleed = false,
}: Props) {
  const dark = theme === "navy";
  const bg = theme === "navy" ? "bg-navy text-cream" : theme === "paper" ? "bg-paper" : "bg-cream";

  const Copy = (
    <>
      {eyebrow && (
        <Reveal>
          <span className="eyebrow mb-5 block">{eyebrow}</span>
        </Reveal>
      )}
      <RevealText
        lines={headingLines}
        className={`font-serif text-display-md md:text-display-lg ${dark ? "text-cream" : "text-ink"}`}
      />

      {body && (
        <Reveal className="mt-7 space-y-5" stagger>
          {body.map((p, i) => (
            <p
              key={i}
              className={`font-sans text-base leading-relaxed ${dark ? "text-cream/75" : "text-ink/70"}`}
            >
              {p}
            </p>
          ))}
        </Reveal>
      )}

      {bullets && (
        <Reveal className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2" stagger>
          {bullets.map((b) => (
            <div
              key={b}
              className={`flex items-center gap-3 font-sans text-sm ${dark ? "text-cream/80" : "text-ink/80"}`}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {b}
            </div>
          ))}
        </Reveal>
      )}

      {cta && (
        <Reveal className="mt-10">
          <Button href={cta.href} variant={dark ? "light" : "ink"}>
            {cta.label}
          </Button>
        </Reveal>
      )}
    </>
  );

  if (fullBleed) {
    return (
      <section className={bg}>
        <div className="grid items-stretch lg:grid-cols-2">
          {/* Full-bleed image */}
          <div
            className={`relative min-h-[58vh] overflow-hidden lg:min-h-[86vh] ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Copy with breathing room */}
          <div
            className={`flex items-center px-6 py-section md:px-12 lg:px-20 ${
              reverse ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <div className="w-full max-w-xl">{Copy}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${bg} py-section`}>
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={reverse ? "lg:order-2" : "lg:order-1"}>
          <AnimatedImage
            src={image}
            alt={imageAlt}
            parallax
            ratioClass={ratioClass}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className={reverse ? "lg:order-1" : "lg:order-2"}>{Copy}</div>
      </div>
    </section>
  );
}
