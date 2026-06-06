/**
 * Site footer — dark navy, editorial. Uses the exact footer copy from the
 * blueprint, plus quick links, company list, contact, and a stubbed
 * newsletter form. Wrapped in a scroll Reveal for the footer entrance.
 */
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import NewsletterForm from "./NewsletterForm";
import { nav, companies, site, footer, contact } from "@/data/content";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-cream">
      <div className="container-site py-section">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <h2 className="font-serif text-2xl text-cream">{footer.name}</h2>
              <p className="mt-4 font-serif text-lg italic text-gold-light">
                {footer.tagline}
              </p>
              <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-cream/60">
                {footer.blurb}
              </p>
            </div>

            {/* Explore */}
            <div className="lg:col-span-2">
              <h3 className="eyebrow mb-5 text-cream/50">Explore</h3>
              <ul className="space-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline font-sans text-sm text-cream/80 hover:text-cream"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Companies */}
            <div className="lg:col-span-3">
              <h3 className="eyebrow mb-5 text-cream/50">Our Companies</h3>
              <ul className="space-y-3">
                {companies.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/companies#${c.slug}`}
                      className="link-underline font-sans text-sm text-cream/80 hover:text-cream"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + newsletter */}
            <div className="lg:col-span-3">
              <h3 className="eyebrow mb-5 text-cream/50">{contact.hqHeading}</h3>
              <p className="font-sans text-sm text-cream/80">{contact.hq}</p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-2 inline-block font-sans text-sm text-cream/80 hover:text-cream"
              >
                {site.email}
              </a>

              <h3 className="eyebrow mb-4 mt-10 text-cream/50">Newsletter</h3>
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-8 sm:flex-row sm:items-center">
            <p className="font-sans text-xs text-cream/50">{footer.copyright}</p>
            <p className="font-sans text-[0.7rem] uppercase tracking-eyebrow text-cream/40">
              {site.city}, {site.region}, {site.country}
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
