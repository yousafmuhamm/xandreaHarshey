"use client";

/**
 * Full-screen cinematic hero. The video background autoplays muted + looping
 * (we also call play() explicitly on mount because React can drop the `muted`
 * attribute, which blocks autoplay). The headline, eyebrow, subtext, and links
 * animate in IMMEDIATELY on mount via a plain GSAP timeline (not ScrollTrigger,
 * not gated on the video) so the hero is never a blank navy block. The
 * #hero-anchor id lets the Header know it is over a dark hero.
 */
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ScrollIndicator from "@/components/motion/ScrollIndicator";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { hero } from "@/data/content";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Kick off video playback as early as possible. React sometimes omits the
  // `muted` attribute on first render, so we force it via the ref — a muted
  // video is required for autoplay in Chrome/Safari. If play() rejects we
  // simply keep the poster.
  useIsomorphicLayoutEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    // Some browsers only allow play once the data is ready.
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  // Immediate entrance — fast (hero readable well under ~500ms), independent
  // of the video/poster layer (which fades in separately).
  useIsomorphicLayoutEffect(() => {
    const content = contentRef.current;
    const media = mediaRef.current;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Fade the media wrapper in (never toggle the <video> itself off, or
      // the browser may refuse to autoplay it).
      if (media) {
        gsap.fromTo(media, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
      }

      if (content) {
        const lines = content.querySelectorAll<HTMLElement>(".reveal-line > span");
        const fades = content.querySelectorAll<HTMLElement>("[data-hero-fade]");

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.fromTo(
          lines,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, stagger: 0.08 },
          0.05
        ).fromTo(
          fades,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
          0.18
        );
      }
    }, sectionRef);

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
            ref={videoRef}
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

      {/* Soft, warm overlays — keep the footage bright and inviting, just enough
          contrast for the header (top) and the content (bottom). */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-navy-deep/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/20 to-transparent" />

      {/* Content — minimal, image-led */}
      <div
        ref={contentRef}
        className="container-site relative z-10 pb-24 pt-32 md:pb-28 md:pt-36"
      >
        <span data-hero-fade className="eyebrow mb-6 block text-gold-light">
          {hero.eyebrow}
        </span>

        <h1 className="max-w-5xl font-serif text-display-xl text-white">
          {hero.headlineLines.map((line, i) => (
            <span key={i} className="reveal-line">
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <p
          data-hero-fade
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-white/85 md:text-lg"
        >
          {hero.subtext}
        </p>

        <div
          data-hero-fade
          className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5"
        >
          <Button href={hero.cta.href} variant="gold">
            {hero.cta.label}
          </Button>
          {hero.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline font-sans text-[0.78rem] uppercase tracking-eyebrow text-white/90 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
