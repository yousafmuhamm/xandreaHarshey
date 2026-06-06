"use client";

/**
 * Subtle cursor-follow dot that scales up (and can show a label) when
 * hovering interactive media / links — the luxury-LP touch. Disabled on
 * touch devices and under reduced motion. Uses a quickTo for buttery follow.
 */
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    document.body.classList.add("custom-cursor-active");

    const xTo = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3.out" });
    const lxTo = gsap.quickTo(label, "x", { duration: 0.25, ease: "power3.out" });
    const lyTo = gsap.quickTo(label, "y", { duration: 0.25, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      lxTo(e.clientX);
      lyTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (target) {
        dot.classList.add("is-hovering");
        const labelText = target.getAttribute("data-cursor");
        if (labelText) {
          label.textContent = labelText;
          label.classList.add("is-visible");
        }
      } else {
        dot.classList.remove("is-hovering");
        label.classList.remove("is-visible");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
}
