"use client";

/**
 * Hero scroll-down indicator that fades out as the user scrolls past the
 * first viewport.
 */
import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none flex flex-col items-center gap-3 transition-opacity duration-700 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <span className="font-sans text-[0.62rem] uppercase tracking-eyebrow text-white/70">
        Scroll
      </span>
      <span className="scroll-indicator-line" />
    </div>
  );
}
