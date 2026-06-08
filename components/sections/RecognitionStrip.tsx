"use client";

/**
 * Operating standards strip. Partner logos or memberships should only be added
 * after official approvals are confirmed.
 */
import Reveal from "@/components/motion/Reveal";
import Marquee from "@/components/motion/Marquee";
import { recognition } from "@/data/content";

export default function RecognitionStrip() {
  return (
    <section className="bg-navy py-16">
      <div className="container-site mb-8 text-center">
        <Reveal>
          <span className="eyebrow text-cream/65">Operating Standards</span>
        </Reveal>
      </div>
      <Marquee items={recognition} />
    </section>
  );
}
