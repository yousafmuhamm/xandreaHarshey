"use client";

/**
 * Full executive profile for the /leadership page: alternating editorial split
 * with the leader's photo and their COMPLETE verbatim bio rendered as real
 * page content (crawlable for SEO), anchored by slug. The interactive bio
 * modal still lives on the home-page Leadership preview.
 */
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";
import AnimatedImage from "@/components/motion/AnimatedImage";
import type { Leader } from "@/data/content";

export default function LeaderProfile({
  leader,
  index,
}: {
  leader: Leader;
  index: number;
}) {
  const reverse = index % 2 === 1;
  const bg = index % 2 === 1 ? "bg-paper" : "bg-cream";

  return (
    <section id={leader.slug} className={`${bg} scroll-mt-24 py-section`}>
      <div className="container-site grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className={reverse ? "lg:order-2" : "lg:order-1"}>
          <AnimatedImage
            src={leader.image}
            alt={`${leader.name}, ${leader.title} — Xandrea Harshey Services Inc.`}
            ratioClass="aspect-[4/5]"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>

        <div className={reverse ? "lg:order-1" : "lg:order-2"}>
          <Reveal>
            <span className="eyebrow mb-4 block text-gold-deep">{leader.title}</span>
          </Reveal>
          <RevealText lines={[leader.name]} className="font-serif text-display-md text-ink" />

          <Reveal className="mt-7 space-y-5" stagger>
            {leader.bio.map((p, i) => (
              <p key={i} className="font-sans text-base leading-relaxed text-ink/70">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
