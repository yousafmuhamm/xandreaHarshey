"use client";

/**
 * Lean trust / credibility row — the Carolwood "Featured In" equivalent,
 * condensed to a single elegant line of standards (Fully Insured · WCB ·
 * Safety Certified · Quality Assured). Quiet, confident, low-chrome.
 */
import Reveal from "@/components/motion/Reveal";
import { trustSignals } from "@/data/content";

export default function TrustRow() {
  return (
    <section className="border-y border-ink/10 bg-paper py-12">
      <div className="container-site">
        <Reveal className="flex flex-col items-center gap-7 text-center" stagger>
          <span className="eyebrow text-ink/45">Trusted Standards</span>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
            {trustSignals.map((signal, i) => (
              <li key={signal} className="flex items-center gap-8 md:gap-12">
                <span className="font-serif text-lg text-ink/80 md:text-xl">
                  {signal}
                </span>
                {i < trustSignals.length - 1 && (
                  <span aria-hidden className="hidden h-1 w-1 rounded-full bg-gold md:inline-block" />
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
