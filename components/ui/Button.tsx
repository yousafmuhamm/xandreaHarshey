"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { useContactModal } from "@/components/contact/ContactModalProvider";

/**
 * Fill-on-hover CTA in the Carolwood style. The `variant` controls the
 * resting palette (ink on light, light on dark, gold accent). Renders a
 * Next.js Link when `href` is internal.
 *
 * Special case: any button pointing at `/contact` opens the global glassy
 * contact modal instead of navigating, so the contact experience is the same
 * everywhere on the site.
 */
type Variant = "ink" | "light" | "gold";

const variantClass: Record<Variant, string> = {
  ink: "btn-ink",
  light: "btn-light",
  gold: "btn-gold",
};

export default function Button({
  href,
  children,
  variant = "ink",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const { open } = useContactModal();
  const classes = `${variantClass[variant]} ${className}`;

  if (href === "/contact") {
    return (
      <button type="button" onClick={() => open()} className={classes}>
        <span>{children}</span>
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      <span>{children}</span>
    </Link>
  );
}
