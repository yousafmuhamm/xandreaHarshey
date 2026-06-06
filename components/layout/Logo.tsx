import Link from "next/link";

/**
 * Text-based corporate wordmark. `tone` swaps between light (over hero) and
 * ink (on solid header / footer). Swap for an SVG logo when branding lands.
 */
export default function Logo({
  tone = "ink",
  compact = false,
}: {
  tone?: "ink" | "light";
  compact?: boolean;
}) {
  const color = tone === "light" ? "text-white" : "text-ink";
  const sub = tone === "light" ? "text-white/60" : "text-gold";
  return (
    <Link href="/" aria-label="Xandrea Harshey Services Inc. — home" className="group block">
      <span className={`block font-serif leading-none tracking-tight transition-all duration-500 ${color} ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>
        Xandrea Harshey
      </span>
      <span className={`mt-1 block font-sans text-[0.55rem] uppercase tracking-eyebrow transition-colors duration-500 ${sub}`}>
        Services Inc.
      </span>
    </Link>
  );
}
