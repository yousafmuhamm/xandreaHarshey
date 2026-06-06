"use client";

/**
 * Masked line-by-line text reveal (clip / yPercent from 110%) used for
 * display headings — the Carolwood headline entrance. Each line sits in an
 * overflow-hidden block and rises into view on scroll. Content is always
 * rendered (SSR-safe / crawlable); GSAP only animates after hydration.
 */
import { useRef, type ElementType } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, STAGGER, TRIGGER_START, TRIGGER_ONCE } from "@/lib/animation";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Play immediately on mount instead of on scroll (used in the hero). */
  immediate?: boolean;
  delay?: number;
};

export default function RevealText({
  lines,
  as: Tag = "h2",
  className = "",
  immediate = false,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const spans = el.querySelectorAll<HTMLElement>(".reveal-line > span");
    if (!spans.length) return;

    const ctx = gsap.context(() => {
      // A single fromTo owns the hidden "from" (yPercent:110) and the reveal
      // as ONE linked tween, so gsap.context().revert() cleans it up fully
      // (StrictMode-safe — no orphaned gsap.set lingering after a re-mount).
      // The CSS default is visible; driving the start from a CSS
      // `translateY(110%)` would be read by GSAP as pixels, so a `yPercent:0`
      // tween resolves to 0→0 (no movement = permanently stuck heading).
      const to = {
        yPercent: 0,
        duration: DURATION.hero,
        ease: EASE.expo,
        stagger: STAGGER.base,
        delay,
      };
      gsap.fromTo(
        spans,
        { yPercent: 110 },
        immediate
          ? to
          : { ...to, scrollTrigger: { trigger: el, start: TRIGGER_START, once: TRIGGER_ONCE } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line">
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
