"use client";

/**
 * Number that counts up from 0 → value when scrolled into view (the big
 * stat-band figures). Renders the final value in the DOM immediately for
 * SEO/no-JS, then animates on the client.
 */
import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export default function Counter({ value, prefix = "", suffix = "", className = "" }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    setDisplay(0);
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => setDisplay(Math.round(obj.n)),
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
