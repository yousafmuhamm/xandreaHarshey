"use client";

/**
 * Featured Projects — an editorial gallery with big imagery, a category label,
 * and project value / timeline in small caps. Minimal chrome (no boxes); two
 * large tiles over one wide tile. Links through to the full /projects gallery.
 */
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/data/content";

export default function ProjectsPreview() {
  const featured = projects.slice(0, 3);
  const spans = ["md:col-span-6 aspect-[4/5]", "md:col-span-6 aspect-[4/5]", "md:col-span-12 aspect-[16/8]"];

  return (
    <section className="bg-cream py-section">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Featured Projects" lines={["Selected work", "across the group."]} />
          <Reveal>
            <Link
              href="/projects"
              className="link-underline shrink-0 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/70 hover:text-ink"
            >
              View full portfolio
            </Link>
          </Reveal>
        </div>

        <Reveal className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-12" stagger>
          {featured.map((p, i) => (
            <Link
              key={p.title}
              href="/projects"
              data-cursor="View"
              className={`group block ${spans[i] ?? "md:col-span-6 aspect-[4/5]"}`}
            >
              <div className="relative h-full w-full overflow-hidden bg-navy-deep">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.05]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <div>
                  <span className="eyebrow text-gold">{p.category}</span>
                  <h3 className="mt-2 font-serif text-2xl text-ink md:text-3xl">{p.title}</h3>
                </div>
                <p className="shrink-0 font-sans text-[0.7rem] uppercase tracking-eyebrow text-ink/45">
                  {p.value} · {p.timeline}
                </p>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
