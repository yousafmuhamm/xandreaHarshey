"use client";

/**
 * Native-scroll provider. Lenis smooth/inertia scrolling has been removed so
 * the page tracks the wheel/trackpad 1:1 (no perceived lag). This provider
 * now only:
 *   - keeps GSAP ScrollTrigger positions correct (refresh after fonts load,
 *     on route change, and on resize),
 *   - resets to the top of the page on navigation,
 *   - exposes a tiny `useSmoothScroll()` API so modals / the menu can lock the
 *     page scroll and nav links can do native in-page jumps.
 *
 * The scroll-triggered reveal animations (GSAP ScrollTrigger) are untouched —
 * they read the normal window scroll and still fade/rise content into view.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

type ScrollCtx = {
  /** Lock the page scroll (used by full-screen menu / modals). */
  stop: () => void;
  /** Release the page scroll lock. */
  start: () => void;
  /** Native in-page jump to an element/selector or absolute Y. */
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
};

const SmoothScrollContext = createContext<ScrollCtx>({
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
  const pathname = usePathname();
  // Track how many things have requested a scroll lock so nested locks behave.
  const lockCount = useRef(0);

  // Keep ScrollTrigger positions correct: jump to top on navigation, refresh
  // after layout settles, once web fonts load (they change heading heights →
  // trigger positions), and on resize. ScrollTrigger reads native window
  // scroll directly, so no scrollerProxy/Lenis hookup is needed.
  useEffect(() => {
    window.scrollTo(0, 0);

    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 300);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    window.addEventListener("resize", refresh);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", refresh);
    };
  }, [pathname]);

  const stop = useCallback(() => {
    lockCount.current += 1;
    document.body.style.overflow = "hidden";
  }, []);

  const start = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1);
    if (lockCount.current === 0) document.body.style.overflow = "";
  }, []);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, offset = 0) => {
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: "auto" });
        return;
      }
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "auto" });
      }
    },
    []
  );

  return (
    <SmoothScrollContext.Provider value={{ stop, start, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
