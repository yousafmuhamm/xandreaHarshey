"use client";

/**
 * Leadership section — executive cards with a subtle hover image treatment.
 * Clicking a card opens an animated modal/drawer with the full verbatim bio
 * (scale + opacity in, backdrop blur). Scroll locks while the modal is open.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { leaders, type Leader } from "@/data/content";

export default function Leadership({ preview = false }: { preview?: boolean }) {
  const [open, setOpen] = useState<Leader | null>(null);
  const { stop, start } = useSmoothScroll();

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
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Leadership Team" lines={["The people behind", "the enterprise."]} />
          {preview && (
            <Reveal>
              <Link
                href="/leadership"
                className="link-underline shrink-0 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/70 hover:text-ink"
              >
                Meet the team
              </Link>
            </Reveal>
          )}
        </div>

        <Reveal className="grid gap-8 md:grid-cols-3" stagger>
          {leaders.map((leader) => (
            <button
              key={leader.slug}
              type="button"
              onClick={() => setOpen(leader)}
              data-cursor="Read bio"
              className="group text-left"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-navy-deep">
                <Image
                  src={leader.image}
                  alt={`${leader.name}, ${leader.title} — Xandrea Harshey Services Inc.`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale transition-all duration-[1.1s] ease-luxe group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="mt-5">
                <span className="eyebrow text-gold">{leader.title}</span>
                <h3 className="mt-2 font-serif text-2xl text-ink">{leader.name}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60">{leader.short}</p>
              </div>
            </button>
          ))}
        </Reveal>
      </div>

      {/* Bio modal */}
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
              aria-label={`${open.name} biography`}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 grid max-h-[88vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-sm bg-cream md:grid-cols-[0.8fr_1.2fr]"
            >
              <div className="relative hidden min-h-[320px] md:block">
                <Image
                  src={open.image}
                  alt={`${open.name}, ${open.title}`}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
              <div className="overflow-y-auto p-8 md:p-10">
                <div className="mb-6 flex items-start justify-between gap-6">
                  <div>
                    <span className="eyebrow text-gold">{open.title}</span>
                    <h3 className="mt-2 font-serif text-3xl text-ink">{open.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    aria-label="Close biography"
                    className="shrink-0 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/60 hover:text-ink"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-4">
                  {open.bio.map((p, i) => (
                    <p key={i} className="font-sans text-sm leading-relaxed text-ink/75">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
