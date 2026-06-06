import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { site } from "@/data/content";

/* High-contrast serif display + clean grotesque sans, self-hosted via next/font */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SmoothScrollProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
