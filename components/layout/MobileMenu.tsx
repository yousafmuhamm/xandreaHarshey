"use client";

/**
 * Full-screen overlay menu (all breakpoints) — the template's luxury slide-out.
 * Navy background, gold accents, large serif links with a staggered reveal, and
 * an address / email / social footer. Locks the page scroll while open and
 * animates open/closed with Framer Motion.
 */
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav, site, social } from "@/data/content";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { useDialogFocus } from "@/lib/useDialogFocus";

const overlay = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, when: "afterChildren", staggerChildren: 0.02 },
  },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 16, transition: { duration: 0.2 } },
};

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { stop, start } = useSmoothScroll();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) stop();
    else start();

    return () => {
      start();
    };
  }, [open, stop, start, onClose]);
  useDialogFocus(dialogRef, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          variants={overlay}
          initial="hidden"
          animate="show"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[300] flex flex-col bg-navy-deep text-cream"
        >
          {/* Top bar mirrors the header */}
          <div className="container-site flex items-center justify-between py-5">
            <Link href="/" onClick={onClose} aria-label="Xandrea Harshey Services Inc. — home">
              <Image
                src="/brand/logo-white.png"
                alt="Xandrea Harshey Services Inc."
                width={981}
                height={140}
                className="h-9 w-auto md:h-11"
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="group flex min-h-11 min-w-11 items-center gap-3 px-2 font-sans text-[0.72rem] uppercase tracking-eyebrow text-cream/80 transition-colors hover:text-cream"
            >
              Close
              <span className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 block h-px w-4 -translate-y-1/2 rotate-45 bg-cream" />
                <span className="absolute left-0 top-1/2 block h-px w-4 -translate-y-1/2 -rotate-45 bg-cream" />
              </span>
            </button>
          </div>

          {/* Links */}
          <nav
            className="container-site flex flex-1 flex-col justify-center"
            aria-label="Full navigation"
          >
            <div className="flex flex-col gap-1">
              {nav.map((link, i) => {
                const active = pathname === link.href;
                const cls = `group flex items-baseline gap-4 py-1.5 font-serif text-4xl leading-tight transition-colors duration-300 sm:text-5xl lg:text-6xl ${
                  active ? "text-gold" : "text-cream hover:text-gold"
                }`;
                const index = (
                  <span className="font-sans text-xs text-gold/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                );
                return (
                  <motion.div key={link.href} variants={item}>
                    {link.href === "/contact" ? (
                      <ContactTrigger
                        onActivate={onClose}
                        className={`${cls} w-full text-left`}
                      >
                        {index}
                        {link.label}
                      </ContactTrigger>
                    ) : (
                      <Link href={link.href} onClick={onClose} className={cls}>
                        {index}
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </nav>

          {/* Footer — address / email / social */}
          <motion.div
            variants={item}
            className="container-site flex flex-col gap-6 border-t border-cream/10 py-8 text-cream/60 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="font-sans text-[0.72rem] uppercase tracking-eyebrow text-gold-light">
                {site.hqLine}
              </p>
              <p className="mt-2 font-sans text-sm text-cream/75">{site.email}</p>
              {site.phone && (
                <p className="mt-1 font-sans text-sm text-cream/75">{site.phone}</p>
              )}
            </div>
            {social.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline font-sans text-[0.72rem] uppercase tracking-eyebrow text-cream/70 hover:text-cream"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
