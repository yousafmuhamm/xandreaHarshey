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
import { DURATION, EASE, STAGGER, TRIGGER_START } from "@/lib/animation";
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

    const ctx = gsap.context(() => {
      const tween = {
        yPercent: 0,
        duration: DURATION.hero,
        ease: EASE.expo,
        stagger: STAGGER.base,
        delay,
      };
      if (immediate) {
        gsap.to(spans, tween);
      } else {
        gsap.to(spans, {
          ...tween,
          scrollTrigger: { trigger: el, start: TRIGGER_START },
        });
      }
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
