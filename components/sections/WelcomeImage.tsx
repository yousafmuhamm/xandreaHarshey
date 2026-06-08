"use client";

/**
 * The "breathtaking still" moment right after the hero video: a large,
 * full-bleed photograph of a warm home/property with a gentle scale-on-scroll
 * parallax and a welcoming serif statement overlaid. Establishes the template
 * rhythm of motion (video) → a beautiful still (home) → warm intro.
 */
import { useRef } from "react";
import Image from "next/image";
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { welcome } from "@/data/content";

export default function WelcomeImage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Slow scale + drift as it scrolls through the viewport.
      gsap.fromTo(
        media,
        { scale: 1.12, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[78vh] items-end overflow-hidden bg-navy-deep md:min-h-[92vh]"
    >
      <div ref={mediaRef} className="absolute inset-0 h-full w-full">
        <Image
          src={welcome.image}
          alt={welcome.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Overlay — strong enough at the bottom that the white statement reads
          clearly while the photo stays bright up top. */}
      <div className="absolute inset-0 bg-navy-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent" />

      <div className="container-site relative z-10 pb-16 md:pb-24">
        <Reveal>
          <span className="eyebrow mb-6 block text-gold-light">{welcome.eyebrow}</span>
        </Reveal>
        <RevealText
          lines={[welcome.statement]}
          className="max-w-4xl font-serif text-display-md leading-[1.15] text-white md:text-display-lg"
        />
      </div>
    </section>
  );
}
