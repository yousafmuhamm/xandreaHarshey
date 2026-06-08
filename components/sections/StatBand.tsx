"use client";

/**
 * Full-width statistics band — a standout moment, not a small row. Deep navy
 * surface with oversized gold numerals that count up on scroll-in, separated by
 * thin gold dividers. Figures come from data/content.ts.
 */
import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";
import { stats } from "@/data/content";

export default function StatBand() {
  return (
    <section className="bg-navy-deep py-section text-cream">
      <div className="container-site">
        <Reveal className="mb-14 max-w-2xl">
          <span className="eyebrow block text-gold-light">By the Numbers</span>
          <p className="mt-5 font-serif text-display-md text-cream">
            A diversified group, built to scale.
          </p>
        </Reveal>

        <Reveal
          className="grid grid-cols-2 gap-y-14 border-t border-gold/20 pt-14 lg:grid-cols-4 lg:divide-x lg:divide-gold/20"
          stagger
        >
          {stats.map((s) => (
            <div key={s.label} className="px-2 text-center lg:px-8">
              <div className="font-serif text-6xl leading-none text-gold-light md:text-7xl lg:text-[5.5rem]">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-5 font-sans text-[0.72rem] uppercase tracking-eyebrow text-cream/65">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
