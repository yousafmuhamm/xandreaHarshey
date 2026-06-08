"use client";

/**
 * Minimal, elegant top bar (Carolwood pattern): logo on the left; on the right
 * a small set of primary links + a "Menu" button that opens the full-screen
 * overlay menu. Transparent with light text while over the dark hero (detected
 * via a #hero-anchor element on the home page); solid cream with ink text once
 * scrolled past it. Home is reachable via the logo, so it is not a visible tab.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { primaryNav } from "@/data/content";

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

  // White logo + links only while the dark hero is behind the header; otherwise
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

          <div className="flex items-center gap-8 md:gap-10">
            <nav
              className="hidden items-center gap-8 md:flex"
              aria-label="Primary"
            >
              {primaryNav.map((item) => {
                const active = pathname === item.href;
                const cls = `link-underline font-sans text-[0.72rem] uppercase tracking-eyebrow transition-colors duration-300 ${
                  light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink"
                } ${active ? "after:origin-left after:scale-x-100" : ""}`;
                if (item.href === "/contact") {
                  return (
                    <ContactTrigger key={item.href} className={cls}>
                      {item.label}
                    </ContactTrigger>
                  );
                }
                return (
                  <Link key={item.href} href={item.href} className={cls}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Menu trigger — full-screen overlay */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className={`group flex min-h-[44px] min-w-[44px] items-center gap-3 px-2 font-sans text-[0.72rem] uppercase tracking-eyebrow transition-colors duration-300 ${
                light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink"
              }`}
            >
              <span className="hidden sm:inline">Menu</span>
              <span className="flex flex-col gap-[5px]">
                <span
                  className={`block h-px w-6 transition-colors ${light ? "bg-white" : "bg-ink"}`}
                />
                <span
                  className={`block h-px w-6 transition-colors ${light ? "bg-white" : "bg-ink"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
