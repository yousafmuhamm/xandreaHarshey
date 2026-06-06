/**
 * Centralized animation config — the single place to tune the "feel".
 *
 * Reveals are kept SNAPPY so they enhance (rather than slow) the now-native
 * scroll: short durations, soft power2 ease, small staggers, transform/opacity
 * only, and `once: true` so they never re-trigger. Adjust here and the whole
 * site re-tunes.
 */

export const EASE = {
  // GSAP string eases
  out: "power2.out",
  expo: "power2.out",
  inOut: "power2.inOut",
  // CSS cubic-bezier equivalent (matches tailwind `ease-luxe`)
  cssLuxe: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const DURATION = {
  fast: 0.5,
  base: 0.6,
  slow: 0.7,
  hero: 0.7,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.06,
  loose: 0.08,
} as const;

/** Standard ScrollTrigger start for "element enters viewport" reveals. */
export const TRIGGER_START = "top 85%";

/** Reveals fire once and never re-trigger (keeps native scroll feeling fast). */
export const TRIGGER_ONCE = true;

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
