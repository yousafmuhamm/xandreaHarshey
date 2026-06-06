"use client";

/**
 * Draggable before/after image comparison for "Before & After Photography".
 * Pointer / keyboard accessible: the handle reveals the "after" image by
 * clipping the overlay. Works on touch and mouse.
 */
import { useCallback, useRef, useState } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-sm bg-navy-deep"
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      {/* After (base) */}
      <Image src={after} alt={afterAlt} fill sizes="100vw" className="object-cover" />
      <span className="absolute bottom-4 right-4 z-10 rounded-full bg-ink/60 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-eyebrow text-white">
        After
      </span>

      {/* Before (clipped overlay) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={beforeAlt} fill sizes="100vw" className="object-cover" />
        <span className="absolute bottom-4 left-4 z-10 rounded-full bg-ink/60 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-eyebrow text-white">
          Before
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 z-20 flex w-0 items-center justify-center"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 w-px bg-white/90" />
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg"
        >
          <span aria-hidden className="font-sans text-xs">⟷</span>
        </button>
      </div>
    </div>
  );
}
