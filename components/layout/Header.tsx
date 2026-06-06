"use client";

/**
 * Sticky header that is transparent with light text while over a dark hero
 * (detected via a #hero-anchor element on the home page) and turns solid /
 * shrinks with ink text once scrolled — including a logo tone swap and
 * animated nav underlines. On pages without a hero it starts solid.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { nav } from "@/data/content";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Re-query each run: on client navigation the hero anchor only exists
    // on the home page, and the new DOM mounts after this effect's deps change.
    const update = () => {
      setScrolled(window.scrollY > 40);
      const heroAnchor = document.getElementById("hero-anchor");
      // "Over the hero" = the dark hero still covers the header strip. Tie the
      // light treatment to this alone so the header flips to solid/ink the
      // instant a light section reaches the top — never white-on-cream.
      setOverHero(
        heroAnchor ? heroAnchor.getBoundingClientRect().bottom > 80 : false
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // White logo + nav only while the dark hero is behind the header; otherwise
  // solid cream background with ink text. `scrolled` just trims the height.
  const light = overHero;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[150] transition-all duration-500 ease-luxe ${
          overHero
            ? "bg-transparent"
            : "border-b border-ink/10 bg-cream/90 shadow-[0_1px_20px_rgba(17,17,17,0.06)] backdrop-blur-md"
        } ${scrolled ? "py-3" : "py-5"}`}
      >
        <div className="container-site flex items-center justify-between">
          <Logo tone={light ? "light" : "ink"} compact={scrolled} />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link-underline font-sans text-[0.72rem] uppercase tracking-eyebrow transition-colors duration-300 ${
                    light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink"
                  } ${active ? "after:scale-x-100 after:origin-left" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex flex-col gap-[6px] p-2 lg:hidden"
          >
            <span className={`block h-px w-7 transition-colors ${light ? "bg-white" : "bg-ink"}`} />
            <span className={`block h-px w-7 transition-colors ${light ? "bg-white" : "bg-ink"}`} />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
