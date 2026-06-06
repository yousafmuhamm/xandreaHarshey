"use client";

/**
 * Full-screen overlay mobile menu with a staggered link reveal. Locks the
 * Lenis scroll while open and animates open/closed with Framer Motion.
 */
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { nav, site } from "@/data/content";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.06 } },
  exit: { opacity: 0, transition: { duration: 0.35, when: "afterChildren", staggerChildren: 0.03 } },
};

const link = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.25 } },
};

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (open) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
    return () => {
      start();
      document.body.style.overflow = "";
    };
  }, [open, stop, start]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlay}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[300] flex flex-col bg-navy-deep text-cream lg:hidden"
        >
          <div className="container-site flex items-center justify-between py-5">
            <span className="font-serif text-xl text-cream">{site.shortName}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="font-sans text-[0.72rem] uppercase tracking-eyebrow text-cream/80"
            >
              Close
            </button>
          </div>

          <nav className="container-site flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <motion.div key={item.href} variants={link}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-2 font-serif text-4xl text-cream transition-colors duration-300 hover:text-gold sm:text-5xl"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div variants={link} className="container-site py-8 text-cream/50">
            <p className="font-sans text-[0.72rem] uppercase tracking-eyebrow">{site.hqLine}</p>
            <p className="mt-1 font-sans text-sm">{site.email}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
