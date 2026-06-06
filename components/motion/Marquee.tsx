"use client";

/**
 * Auto-scrolling infinite marquee for "Client and partner recognition".
 * The track is duplicated so the CSS translateX(-50%) loop is seamless.
 * Pauses on hover. Honors reduced motion (renders a static wrapped row).
 */
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function Marquee({ items }: { items: string[] }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {items.map((item) => (
          <span key={item} className="font-serif text-xl text-cream/70">
            {item}
          </span>
        ))}
      </div>
    );
  }

  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-10 whitespace-nowrap font-serif text-xl text-cream/60 transition-colors duration-500 hover:text-gold"
          >
            {item}
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-navy-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy-deep to-transparent" />
    </div>
  );
}
