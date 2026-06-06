"use client";

/**
 * Filterable Projects & Portfolio gallery. Category filters animate the grid
 * with Framer Motion layout transitions (the GSAP-Flip analogue). Each card
 * opens an animated detail modal with Value, Timeline, Scope, Objectives, and
 * Outcomes — the blueprint's "Featured Projects" fields.
 */
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { projects, projectCategories, type Project } from "@/data/content";

export default function ProjectsGallery() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const [open, setOpen] = useState<Project | null>(null);
  const { stop, start } = useSmoothScroll();

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  useEffect(() => {
    if (open) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      start();
      document.body.style.overflow = "";
    };
  }, [open, stop, start]);

  return (
    <section className="bg-cream py-section">
      <div className="container-site">
        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-3">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full border px-5 py-2 font-sans text-[0.7rem] uppercase tracking-eyebrow transition-colors duration-300 ${
                filter === cat
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/20 text-ink/70 hover:border-ink/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.button
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setOpen(p)}
                data-cursor="Details"
                className="group block text-left"
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
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-navy-deep/70 backdrop-blur-md"
              onClick={() => setOpen(null)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${open.title} project details`}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 grid max-h-[88vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-sm bg-cream md:grid-cols-2"
            >
              <div className="relative min-h-[240px]">
                <Image src={open.image} alt={open.imageAlt} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="overflow-y-auto p-8 md:p-10">
                <div className="mb-6 flex items-start justify-between gap-6">
                  <div>
                    <span className="eyebrow text-gold">{open.category}</span>
                    <h3 className="mt-2 font-serif text-3xl text-ink">{open.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    aria-label="Close project details"
                    className="shrink-0 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/60 hover:text-ink"
                  >
                    Close
                  </button>
                </div>

                <dl className="space-y-5">
                  {[
                    ["Project Value", open.value],
                    ["Timeline", open.timeline],
                    ["Scope of Work", open.scope],
                    ["Client Objectives", open.objective],
                    ["Project Outcomes", open.outcome],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <dt className="eyebrow text-ink/45">{label}</dt>
                      <dd className="mt-1 font-sans text-sm leading-relaxed text-ink/80">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
