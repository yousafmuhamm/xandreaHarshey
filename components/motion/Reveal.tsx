"use client";

/**
 * Generic scroll-triggered fade + rise (y:40 → 0, opacity 0 → 1).
 * Wrap any block of content. With `stagger`, direct children animate in
 * sequence (eyebrow → heading → body, card grids, value lists, etc.).
 * SSR-safe: children render in the DOM; only the motion is deferred.
 */
import { useRef, type ElementType, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, STAGGER, TRIGGER_START, TRIGGER_ONCE } from "@/lib/animation";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children in sequence instead of the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
  y?: number;
  /**
   * Play immediately on mount via a plain tween instead of waiting for a
   * ScrollTrigger. Use for above-the-fold content (hero eyebrows / intros) so
   * it can never be left invisible while ScrollTrigger waits to refresh after
   * fonts load — the cause of the "blank navy flash".
   */
  immediate?: boolean;
};

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  stagger = false,
  delay = 0,
  y = 40,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? (el.children as unknown as Element[]) : el;
      // Single linked fromTo (see RevealText): the hidden state is owned by
      // the tween and fully reverted on cleanup, so content is never left
      // stuck-hidden by a re-mount, a GSAP failure, or no JS.
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          delay,
          stagger: stagger ? STAGGER.base : 0,
          // Above the fold → play now; below the fold → reveal on scroll-in.
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start: TRIGGER_START, once: TRIGGER_ONCE } }),
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
