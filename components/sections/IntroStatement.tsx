"use client";

/**
 * Large, centered serif positioning statement with generous whitespace — the
 * editorial "who we are" moment. The lead clause is emphasized in ink, the
 * remainder in a softer tone, with a gold accent rule above.
 */
import Reveal from "@/components/motion/Reveal";
import { statement } from "@/data/content";

export default function IntroStatement() {
  return (
    <section className="bg-cream py-section">
      <div className="container-site">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center" stagger>
          <span className="mb-10 block h-px w-16 bg-gold" />
          <span className="eyebrow mb-8 block">{statement.eyebrow}</span>
          <p className="font-serif text-display-md leading-[1.25] text-ink md:text-display-lg md:leading-[1.2]">
            <span>{statement.lead} </span>
            <span className="text-ink/45">{statement.rest}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
