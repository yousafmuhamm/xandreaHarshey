import Link from "next/link";
import Image from "next/image";

/**
 * Brand wordmark (image). The source art is a white logo, so over the dark hero
 * it shows as-is; on the solid cream header / footer it's darkened to ink via a
 * brightness(0) filter (the art is monochrome, so this yields a clean black
 * mark). `compact` trims the height slightly once the header shrinks on scroll.
 */
export default function Logo({
  tone = "ink",
  compact = false,
}: {
  tone?: "ink" | "light";
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Xandrea Harshey Services Inc. — home"
      className="group block"
    >
      <Image
        src="/brand/logo-white.png"
        alt="Xandrea Harshey Services Inc."
        width={981}
        height={140}
        priority
        className={`w-auto transition-all duration-500 ${
          compact ? "h-9 md:h-10" : "h-11 md:h-14"
        } ${tone === "light" ? "" : "[filter:brightness(0)]"}`}
      />
    </Link>
  );
}
