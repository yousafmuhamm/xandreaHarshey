"use client";

/**
 * Inline trigger that opens the global glassy contact modal. Drop-in
 * replacement for a `<Link href="/contact">` — keeps the caller's existing
 * classes so styling is unchanged. Optionally preselects an inquiry category.
 */
import { type ReactNode } from "react";
import { useContactModal } from "./ContactModalProvider";

export default function ContactTrigger({
  children,
  className = "",
  category,
  onActivate,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  category?: string;
  /** Optional side-effect (e.g. close a parent menu) fired before opening. */
  onActivate?: () => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) {
  const { open } = useContactModal();

  return (
    <button
      type="button"
      onClick={() => {
        onActivate?.();
        open(category);
      }}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
