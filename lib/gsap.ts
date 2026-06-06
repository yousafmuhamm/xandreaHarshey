"use client";

/**
 * Single GSAP entry point. Registers ScrollTrigger once (guarded for
 * client-only / HMR) and re-exports the pieces components need.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Dev-only introspection hook (handy for debugging reveal/scroll issues).
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).gsap = gsap;
    (window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger };
