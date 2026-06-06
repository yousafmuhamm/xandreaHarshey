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
    const heroAnchor = document.getElementById("hero-anchor");

    const update = () => {
      setScrolled(window.scrollY > 40);
      if (heroAnchor) {
        const rect = heroAnchor.getBoundingClientRect();
        setOverHero(rect.bottom > 90);
      } else {
        setOverHero(false);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Light treatment only when transparent over the hero and not scrolled.
  const light = overHero && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[150] transition-all duration-500 ease-luxe ${
          scrolled || !overHero
            ? "border-b border-ink/10 bg-cream/90 backdrop-blur-md"
            : "bg-transparent"
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
