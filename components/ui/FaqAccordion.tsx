"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-ink/10">
      {items.map(({ q, a }, i) => {
        const isOpen = open === i;
        return (
          <div key={q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-7 text-left"
            >
              <h2 className="font-serif text-xl text-ink md:text-2xl">{q}</h2>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/50 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 300ms ease",
              }}
            >
              <div className="overflow-hidden">
                <p className="pb-7 font-sans text-base leading-relaxed text-ink/70">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
