"use client";

/**
 * Route transition shell. Lives in app/template.tsx, which re-mounts on every
 * navigation — so this plays an enter animation each time: a navy curtain
 * wipes away while the page content fades + rises in. Skipped under reduced
 * motion (content shows instantly).
 */
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[200] origin-top bg-navy-deep"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "top" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
