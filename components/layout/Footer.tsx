/**
 * Site footer — dark navy, editorial. Opens with an oversized brand wordmark
 * that fills the space with presence, then the link columns, contact, and a
 * stubbed newsletter form. Wrapped in scroll Reveals for the footer entrance.
 */
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import NewsletterForm from "./NewsletterForm";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { nav, companies, site, footer, contact } from "@/data/content";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-cream">
      <div className="container-site pb-10 pt-20 md:pt-24">
        {/* Oversized brand wordmark */}
        <Reveal>
          <h2 className="font-serif font-light uppercase leading-[0.9] tracking-[0.02em] text-cream text-[clamp(2.5rem,11vw,9rem)]">
            Xandrea
            <br />
            Harshey
          </h2>
          <p className="mt-6 font-serif text-lg italic text-gold-light">
            {footer.tagline}
          </p>
        </Reveal>

        {/* Link columns */}
        <Reveal>
          <div className="mt-16 grid gap-12 border-t border-cream/15 pt-14 lg:grid-cols-12">
            {/* Brand blurb */}
            <div className="lg:col-span-4">
              <p className="max-w-sm font-sans text-sm leading-relaxed text-cream/60">
                {footer.blurb}
              </p>
            </div>

            {/* Explore */}
            <div className="lg:col-span-2">
              <h3 className="eyebrow mb-5 text-cream/50">Explore</h3>
              <ul className="space-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    {item.href === "/contact" ? (
                      <ContactTrigger className="link-underline block py-1 font-sans text-sm text-cream/80 hover:text-cream">
                        {item.label}
                      </ContactTrigger>
                    ) : (
                      <Link
                        href={item.href}
                        className="link-underline block py-1 font-sans text-sm text-cream/80 hover:text-cream"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <Link href="/projects" className="link-underline block py-1 font-sans text-sm text-cream/80 hover:text-cream">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="link-underline block py-1 font-sans text-sm text-cream/80 hover:text-cream">
                    Safety
                  </Link>
                </li>
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
                      className="link-underline block py-1 font-sans text-sm text-cream/80 hover:text-cream"
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
              <p className="mt-3 font-sans text-[0.65rem] text-cream/35">
                By subscribing you agree to our{" "}
                <Link href="/privacy" className="underline hover:text-cream/60">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-8 sm:flex-row sm:items-center">
            <p className="font-sans text-xs text-cream/50">{footer.copyright}</p>
            <div className="flex flex-wrap items-center gap-6">
              <p className="font-sans text-[0.7rem] uppercase tracking-eyebrow text-cream/40">
                {site.city}, {site.region}, {site.country}
              </p>
              <Link
                href="/privacy"
                className="font-sans text-[0.7rem] uppercase tracking-eyebrow text-cream/40 hover:text-cream/70 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
