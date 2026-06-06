"use client";

/**
 * "Client and partner recognition" — auto-scrolling infinite marquee strip
 * on a dark band. Items are connective placeholders (swap for real partners).
 */
import Reveal from "@/components/motion/Reveal";
import Marquee from "@/components/motion/Marquee";
import { recognition } from "@/data/content";

export default function RecognitionStrip() {
  return (
    <section className="bg-navy py-16">
      <div className="container-site mb-8 text-center">
        <Reveal>
          <span className="eyebrow text-cream/50">Client & Partner Recognition</span>
        </Reveal>
      </div>
      <Marquee items={recognition} />
    </section>
  );
}
