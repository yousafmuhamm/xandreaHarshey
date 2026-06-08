"use client";

/**
 * Interactive Services & Capabilities matrix. On desktop it's an editorial
 * index: hovering/selecting a capability crossfades a large preview image and
 * detail. On mobile it collapses to an animated accordion. Height/opacity
 * animate on interaction; the list staggers in on scroll.
 */
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { capabilities } from "@/data/content";

const capabilityLinks: Record<string, string> = {
  "Construction & Development": "/companies#g-pinoy-construction-development",
  "Facility Services": "/companies#xandrea-facility-services",
  "International Trade": "/companies#primeport-commodity",
  "Property Services": "/companies#construction-property-services",
};

const contactTypes: Record<string, string> = {
  "Construction & Development": "construction",
  "Facility Services": "facility",
  "Hospitality & Restaurants": "General Inquiries",
  "International Trade": "General Inquiries",
  "Entertainment & Events": "General Inquiries",
  "Strategic Business Ventures": "partnership",
  "Property Services": "construction",
  "Project Management": "construction",
};

export default function ServiceMatrix({
  withHeading = true,
}: {
  withHeading?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);

  return (
    <section className="bg-paper py-section">
      <div className="container-site">
        {withHeading && (
          <div className="mb-14 max-w-2xl">
            <SectionHeading
              eyebrow="Services & Capabilities"
              lines={["Capabilities across", "every division."]}
            />
            <Reveal className="mt-6">
              <p className="font-sans text-base leading-relaxed text-ink/70">
                An interactive service matrix displaying all company capabilities across divisions —
                from construction and facility services to international trade and project management.
              </p>
            </Reveal>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Index (desktop hover, mobile accordion) */}
          <Reveal className="border-t border-ink/15" stagger>
            {capabilities.map((cap, i) => {
              const isActive = i === active;
              const isOpen = openMobile === i;
              return (
                <div key={cap.title} className="border-b border-ink/15">
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setOpenMobile(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-sans text-xs text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-serif text-xl transition-colors duration-300 md:text-2xl ${
                          isActive ? "text-ink" : "text-ink/55 group-hover:text-ink"
                        }`}
                      >
                        {cap.title}
                      </span>
                    </span>
                    <span className="font-sans text-lg text-ink/40 lg:hidden">
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>

                  {/* Mobile detail accordion */}
                  <div
                    className={`grid transition-all duration-500 ease-luxe lg:hidden ${
                      isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-sm">
                        <Image
                          src={cap.image}
                          alt={cap.title}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                      <p className="font-sans text-sm leading-relaxed text-ink/70">{cap.blurb}</p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {capabilityLinks[cap.title] && (
                          <Link
                            href={capabilityLinks[cap.title]}
                            className="btn-gold text-xs"
                          >
                            <span>Explore Division</span>
                          </Link>
                        )}
                        <Link
                          href={`/contact?type=${contactTypes[cap.title] ?? "General Inquiries"}`}
                          className="btn-ink text-xs"
                        >
                          <span>Get a Quote</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>

          {/* Desktop preview panel */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-cream">
                {/* Only the active image is mounted/fetched — keying on `active`
                    lets the browser fetch one image at a time instead of all 8. */}
                <Image
                  key={capabilities[active].title}
                  src={capabilities[active].image}
                  alt={capabilities[active].title}
                  fill
                  sizes="50vw"
                  className="animate-[fadeIn_0.7s_ease] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <h3 className="font-serif text-3xl text-white">{capabilities[active].title}</h3>
                  <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-white/80">
                    {capabilities[active].blurb}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {capabilityLinks[capabilities[active].title] && (
                      <Link
                        href={capabilityLinks[capabilities[active].title]}
                        className="btn-gold text-xs"
                      >
                        <span>Explore Division</span>
                      </Link>
                    )}
                    <Link
                      href={`/contact?type=${contactTypes[capabilities[active].title] ?? "General Inquiries"}`}
                      className="btn-light text-xs"
                    >
                      <span>Get a Quote</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
