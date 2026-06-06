"use client";

/**
 * Editorial split block: large parallax image one side, eyebrow + heading +
 * body (+ optional bullets / CTA) the other — the Carolwood partner-section
 * pattern. Reversible and theme-aware (cream or navy background).
 */
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";
import AnimatedImage from "@/components/motion/AnimatedImage";
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
}: Props) {
  const dark = theme === "navy";
  const bg = theme === "navy" ? "bg-navy text-cream" : theme === "paper" ? "bg-paper" : "bg-cream";

  return (
    <section className={`${bg} py-section`}>
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <div className={reverse ? "lg:order-2" : "lg:order-1"}>
          <AnimatedImage
            src={image}
            alt={imageAlt}
            parallax
            ratioClass={ratioClass}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Text */}
        <div className={reverse ? "lg:order-1" : "lg:order-2"}>
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
        </div>
      </div>
    </section>
  );
}
