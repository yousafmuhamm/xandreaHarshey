"use client";

/**
 * Closing call-to-action band — large editorial invitation with the CTA
 * buttons from the hero, over a dark image.
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
    <section className="relative overflow-hidden bg-navy-deep py-section text-cream">
      <Image src={CTA_IMAGE} alt="" fill sizes="100vw" className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-navy-deep/60" />

      <div className="container-site relative z-10 text-center">
        <Reveal>
          <span className="eyebrow mb-6 block text-gold-light">{contact.eyebrow}</span>
        </Reveal>
        <RevealText
          lines={["Let's Build Something", "Great Together."]}
          className="mx-auto max-w-4xl font-serif text-display-lg text-cream"
        />
        <Reveal className="mx-auto mt-8 max-w-xl">
          <p className="font-sans text-base leading-relaxed text-cream/70">
            Whether you're a client, partner, or investor, our team in {contact.hq} is ready to help
            you build, create, and deliver.
          </p>
        </Reveal>
        <Reveal className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact" variant="gold">
            Request a Consultation
          </Button>
          <Button href="/companies" variant="light">
            Explore Our Companies
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
