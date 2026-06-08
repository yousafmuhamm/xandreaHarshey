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
import Image from "next/image";
import Button from "@/components/ui/Button";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { hero, heroStats } from "@/data/content";

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
            preload="none"
            poster={hero.poster}
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          >
            <source src={hero.video} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Overlays — a uniform scrim plus a stronger bottom gradient so the white
          headline/stats read clearly over the (bright) footage, matching the
          reference's contrast. */}
      <div className="absolute inset-0 bg-navy-deep/40" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-navy-deep/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/45 to-transparent" />

      {/* Content — minimal, image-led */}
      <div
        ref={contentRef}
        className="container-site relative z-10 pb-14 pt-44 md:pb-16 md:pt-48"
      >
        <span data-hero-fade className="eyebrow mb-6 block text-gold-light">
          {hero.eyebrow}
        </span>

        <h1 className="max-w-5xl font-serif text-[clamp(2.05rem,5.25vw,4.875rem)] font-normal uppercase leading-[1.02] !tracking-[0.04em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
          {hero.headlineLines.map((line, i) => (
            <span key={i} className="reveal-line">
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div
          data-hero-fade
          className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5"
        >
          <Button href="/companies" variant="gold">
            Explore Our Companies
          </Button>
          <ContactTrigger className="link-underline font-sans text-[0.78rem] uppercase tracking-eyebrow text-white/90 hover:text-white">
            Request a Consultation
          </ContactTrigger>
        </div>

        {/* Stat panel — three bold gold figures inside a frosted glass box,
            overlaid on the hero (instant, static — never flickers). */}
        <dl
          data-hero-fade
          className="mt-12 grid w-full max-w-[49rem] grid-cols-1 border border-white/20 bg-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:grid-cols-3 sm:divide-x sm:divide-white/20 md:mt-14"
        >
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className={`flex min-h-[7.75rem] flex-col items-center justify-center px-8 py-6 text-center ${
                i > 0 ? "border-t border-white/20 sm:border-t-0" : ""
              }`}
            >
              <dt className="font-serif text-3xl font-light leading-none text-gold-light md:text-[2.75rem]">
                {s.value}
              </dt>
              <dd className="mt-2 font-sans text-[0.66rem] uppercase tracking-eyebrow text-white/70">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
