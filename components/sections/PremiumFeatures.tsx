"use client";

/**
 * "Premium Website Features" — marketing cards describing capabilities that
 * are stubbed for later (portals, AI assistant, dashboards, i18n). Each card
 * shows title + description + a "Coming Soon" badge. No backend is wired.
 */
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { premiumFeatures } from "@/data/content";

export default function PremiumFeatures() {
  return (
    <section className="bg-navy-deep text-cream py-section">
      <div className="container-site">
        <div className="mb-14 max-w-2xl">
          <SectionHeading
            light
            eyebrow="Premium Experience"
            lines={["Built for the way", "modern clients work."]}
          />
          <Reveal className="mt-6">
            <p className="font-sans text-base leading-relaxed text-cream/65">
              A suite of premium digital experiences — secure portals, intelligent assistance, and
              real-time reporting — designed to make working with Xandrea Harshey seamless.
            </p>
          </Reveal>
        </div>

        <Reveal className="grid gap-px overflow-hidden rounded-sm border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4" stagger>
          {premiumFeatures.map((f, i) => (
            <div
              key={f.title}
              className="group flex flex-col bg-navy-deep p-7 transition-colors duration-500 hover:bg-navy"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-sans text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="rounded-full border border-cream/20 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-eyebrow text-cream/50">
                  {f.status}
                </span>
              </div>
              <h3 className="font-serif text-xl text-cream">{f.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-cream/60">{f.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
