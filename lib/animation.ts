/**
 * Centralized animation config — the single place to tune the "feel".
 *
 * The Carolwood mood is slow, smooth, and expensive: long durations,
 * soft expo/power eases, and generous staggers. Adjust here and the
 * whole site re-tunes.
 */

export const EASE = {
  // GSAP string eases
  out: "power3.out",
  expo: "expo.out",
  inOut: "power2.inOut",
  // CSS cubic-bezier equivalent (matches tailwind `ease-luxe`)
  cssLuxe: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const DURATION = {
  fast: 0.6,
  base: 0.9,
  slow: 1.2,
  hero: 1.4,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.09,
  loose: 0.12,
} as const;

/** Standard ScrollTrigger start for "element enters viewport" reveals. */
export const TRIGGER_START = "top 82%";

/** Framer Motion variants reused across components. */
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER.base, delayChildren: 0.05 },
  },
};
