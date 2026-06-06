"use client";

/**
 * Image with a clip-path curtain wipe + slow inner-image scale (1.18 → 1.0)
 * on scroll-in, plus optional parallax drift. Uses next/image for
 * optimization. The wrapper aspect ratio is controlled by `className`
 * (e.g. "aspect-[4/5]") on the parent or via `ratioClass`.
 */
import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, TRIGGER_START } from "@/lib/animation";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  src: string;
  alt: string;
  ratioClass?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: boolean;
  rounded?: boolean;
};

export default function AnimatedImage({
  src,
  alt,
  ratioClass = "aspect-[4/5]",
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  parallax = false,
  rounded = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = imgRef.current;
    if (!wrap || !inner || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Curtain wipe
      gsap.to(wrap, {
        clipPath: "inset(0 0 0% 0)",
        duration: DURATION.slow,
        ease: EASE.expo,
        scrollTrigger: { trigger: wrap, start: TRIGGER_START },
      });
      // Inner scale settle
      gsap.to(inner, {
        scale: 1,
        duration: DURATION.hero,
        ease: EASE.out,
        scrollTrigger: { trigger: wrap, start: TRIGGER_START },
      });
      // Parallax drift
      if (parallax) {
        gsap.fromTo(
          inner,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`img-reveal relative w-full overflow-hidden ${ratioClass} ${
        rounded ? "rounded-sm" : ""
      } ${className}`}
    >
      <div ref={imgRef} className="absolute inset-0 h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
