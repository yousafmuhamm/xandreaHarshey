"use client";

/**
 * Big-number statistics band (the Carolwood $1.3B / $5B stat block analogue).
 * Numbers count up on scroll-in. Figures come from data/content.ts.
 */
import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";
import { stats } from "@/data/content";

export default function StatBand() {
  return (
    <section className="bg-navy text-cream py-section">
      <div className="container-site">
        <Reveal className="grid grid-cols-2 gap-y-14 lg:grid-cols-4" stagger>
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-5xl text-gold-light md:text-6xl lg:text-7xl">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-4 font-sans text-[0.72rem] uppercase tracking-eyebrow text-cream/60">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
