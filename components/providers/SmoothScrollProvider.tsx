"use client";

/**
 * Lenis smooth inertia scroll synced to GSAP ScrollTrigger — the backbone
 * of the Carolwood feel. Exposes the Lenis instance via context so the
 * mobile menu / modals can lock scrolling and nav links can do smooth
 * anchor jumps. Fully disabled under prefers-reduced-motion.
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type LenisCtx = {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
};

const SmoothScrollContext = createContext<LenisCtx>({
  lenis: null,
  stop: () => {},
  start: () => {},
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Static experience: let ScrollTrigger use native scroll, no Lenis.
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    // Drive ScrollTrigger from Lenis, and run Lenis on GSAP's ticker.
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    setReady(true);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Refresh ScrollTrigger once everything (fonts, images) has settled.
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [ready]);

  const value: LenisCtx = {
    lenis: lenisRef.current,
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
    scrollTo: (target, offset = 0) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
      } else if (typeof target !== "number") {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior: "auto", block: "start" });
      }
    },
  };

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
