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
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Static experience: let ScrollTrigger use native scroll, no Lenis.
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
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

  // Keep ScrollTrigger positions correct: refresh after layout settles, once
  // web fonts load (they change heading heights → trigger positions), and on
  // every route change. Also reset to the top on navigation so each new page
  // starts at its hero. (ScrollTrigger auto-refreshes on resize itself.)
  useEffect(() => {
    if (!ready) return;
    lenisRef.current?.scrollTo(0, { immediate: true });

    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 350);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    return () => window.clearTimeout(id);
  }, [ready, pathname]);

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
