"use client";

/**
 * Full-screen cinematic hero — video background (poster fallback), dark
 * gradient overlay, line-by-line masked headline reveal, staggered subhead +
 * CTAs, scroll indicator, and a slow video scale/parallax on scroll.
 * The #hero-anchor id lets the Header know it is over a dark hero.
 */
import { useRef, useState } from "react";
import Image from "next/image";
import RevealText from "@/components/motion/RevealText";
import ScrollIndicator from "@/components/motion/ScrollIndicator";
import Button from "@/components/ui/Button";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { hero } from "@/data/content";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Slow scale/parallax drift on the media as you scroll out of the hero.
      gsap.fromTo(
        media,
        { scale: 1.05, yPercent: 0 },
        {
          scale: 1.18,
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      // Subhead + CTAs stagger in after the headline. fromTo is StrictMode-safe
      // (single linked tween that ctx.revert() can fully undo on re-mount).
      if (bottomRef.current) {
        gsap.fromTo(
          bottomRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.7 }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-anchor"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy-deep"
    >
      {/* Media layer (poster always present; video on top, hides on error) */}
      <div ref={mediaRef} className="absolute inset-0 h-full w-full">
        <Image
          src={hero.poster}
          alt="Calgary skyline at dusk — Xandrea Harshey Services Inc."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {!videoFailed && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={hero.poster}
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          >
            <source src={hero.video} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-navy-deep/30" />
      <div className="absolute inset-0 bg-ink/20" />

      {/* Content */}
      <div className="container-site relative z-10 pb-20 pt-32 md:pb-24 md:pt-36">
        <span className="eyebrow mb-6 block text-gold-light">{hero.eyebrow}</span>

        <RevealText
          as="h1"
          immediate
          delay={0.25}
          lines={hero.headlineLines}
          className="max-w-5xl font-serif text-display-xl text-white"
        />

        <div ref={bottomRef} className="mt-10 max-w-2xl">
          <p className="font-sans text-base leading-relaxed text-white/85 md:text-lg">
            {hero.body}
          </p>
          <p className="mt-4 font-sans text-base leading-relaxed text-white/70">
            {hero.body2}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {hero.ctas.map((cta) => (
              <Button
                key={cta.label}
                href={cta.href}
                variant={cta.primary ? "gold" : "light"}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
