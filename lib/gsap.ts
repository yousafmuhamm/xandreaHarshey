"use client";

/**
 * Single GSAP entry point. Registers ScrollTrigger once (guarded for
 * client-only / HMR) and re-exports the pieces components need.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
