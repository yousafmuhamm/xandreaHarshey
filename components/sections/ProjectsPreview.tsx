"use client";

/**
 * Home-page Projects & Portfolio preview — a few featured projects with hover
 * zoom, linking through to the full filterable gallery at /projects.
 */
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/data/content";

export default function ProjectsPreview() {
  const featured = projects.slice(0, 3);
  return (
    <section className="bg-cream py-section">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Projects & Portfolio" lines={["Selected work", "across the group."]} />
          <Reveal>
            <Link
              href="/projects"
              className="link-underline shrink-0 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/70 hover:text-ink"
            >
              View full portfolio
            </Link>
          </Reveal>
        </div>

        <Reveal className="grid gap-6 md:grid-cols-3" stagger>
          {featured.map((p) => (
            <Link
              key={p.title}
              href="/projects"
              data-cursor="View"
              className="group block"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-navy-deep">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <span className="eyebrow text-gold">{p.category}</span>
                <h3 className="mt-2 font-serif text-xl text-ink">{p.title}</h3>
                <p className="mt-1 font-sans text-sm text-ink/55">
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
