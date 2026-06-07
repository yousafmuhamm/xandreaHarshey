import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ContactModalProvider from "@/components/contact/ContactModalProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import XandreaChatBot from "@/components/XandreaChatBot";
import { site } from "@/data/content";

/*
 * Single geometric-sans type system (matches the reference landing page): an
 * Avenir/Futura-like face for both display and body. Avenir Next/Avenir is
 * preferred on Apple devices (see the font stacks in tailwind.config + globals);
 * Jost is the self-hosted, cross-platform fallback so every visitor gets the
 * same thin, elegant geometric look. The classical serif now lives only in the
 * brand logo image.
 */
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Diversified Canadian Business Group`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Xandrea Harshey Services",
    "diversified business group Canada",
    "Calgary construction company",
    "facility services Calgary",
    "international trade Canada",
    "G-Pinoy Construction & Development",
    "Primeport Commodity",
    "property services Alberta",
    "Canadian enterprise",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Building Businesses. Creating Opportunities. Delivering Excellence.`,
    description: site.description,
    images: [
      {
        url: "/og.jpg", // PLACEHOLDER — add a 1200×630 OG image to /public/og.jpg
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "business",
};

/** Organization structured data for rich results / knowledge panel eligibility. */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: "Xandrea Harshey",
  url: site.url,
  description: site.description,
  slogan: site.tagline,
  foundingDate: site.founded,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.regionCode,
    addressCountry: site.countryCode,
  },
  areaServed: { "@type": "Country", name: "Canada" },
  knowsAbout: [
    "Construction",
    "Facility Services",
    "Hospitality",
    "International Trade",
    "Entertainment",
    "Property Services",
    "Project Management",
  ],
  subOrganization: [
    { "@type": "Organization", name: "G-Pinoy Construction & Development Inc" },
    { "@type": "Organization", name: "Xandrea Facility Services" },
    { "@type": "Organization", name: "Primeport Commodity Inc." },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only z-[400] rounded-sm bg-navy-deep px-5 py-3 font-sans text-[0.72rem] uppercase tracking-eyebrow text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>
          <ContactModalProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </ContactModalProvider>
        </SmoothScrollProvider>
        <XandreaChatBot />
      </body>
    </html>
  );
}
