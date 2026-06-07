"use client";

/**
 * Closing call-to-action — a full-bleed navy section with a single large serif
 * line and one button. Minimal, confident, lots of breathing room.
 */
import Image from "next/image";
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { contact } from "@/data/content";

const CTA_IMAGE =
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80";

export default function ContactCTA() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy-deep text-cream">
      <Image src={CTA_IMAGE} alt="" fill sizes="100vw" className="object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/85 to-navy-deep/70" />

      <div className="container-site relative z-10 py-section text-center">
        <Reveal>
          <span className="eyebrow mb-8 block text-gold-light">{contact.eyebrow}</span>
        </Reveal>
        <RevealText
          lines={["Let's Build Something", "Great Together."]}
          className="mx-auto max-w-5xl font-serif text-display-lg text-cream md:text-display-xl"
        />
        <Reveal className="mt-12">
          <Button href="/contact" variant="gold">
            Request a Consultation
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
