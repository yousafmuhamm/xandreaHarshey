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
import { DURATION, EASE, STAGGER, TRIGGER_START } from "@/lib/animation";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children in sequence instead of the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
  y?: number;
};

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  stagger = false,
  delay = 0,
  y = 40,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? (el.children as unknown as Element[]) : el;
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: DURATION.base,
        ease: EASE.out,
        delay,
        stagger: stagger ? STAGGER.base : 0,
        scrollTrigger: { trigger: el, start: TRIGGER_START },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
