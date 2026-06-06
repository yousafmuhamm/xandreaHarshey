"use client";

/**
 * Reusable eyebrow + display heading pair with the masked-line reveal.
 * Used to open most sections and sub-pages.
 */
import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";

export default function SectionHeading({
  eyebrow,
  lines,
  align = "left",
  light = false,
  as = "h2",
  className = "",
}: {
  eyebrow?: string;
  lines: string[];
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className="eyebrow mb-5 block">{eyebrow}</span>
        </Reveal>
      )}
      <RevealText
        as={as}
        lines={lines}
        className={`font-serif text-display-md md:text-display-lg ${
          light ? "text-cream" : "text-ink"
        }`}
      />
    </div>
  );
}
