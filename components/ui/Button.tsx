import Link from "next/link";
import { type ReactNode } from "react";

/**
 * Fill-on-hover CTA in the Carolwood style. The `variant` controls the
 * resting palette (ink on light, light on dark, gold accent). Renders a
 * Next.js Link when `href` is internal.
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
  cursorLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  cursorLabel?: string;
}) {
  return (
    <Link
      href={href}
      className={`${variantClass[variant]} ${className}`}
      data-cursor={cursorLabel}
    >
      <span>{children}</span>
    </Link>
  );
}
