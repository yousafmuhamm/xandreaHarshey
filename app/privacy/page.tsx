import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import JsonLd, { breadcrumb } from "@/components/seo/JsonLd";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Xandrea Harshey Services Inc. privacy policy — how we collect, use, and protect your personal information in compliance with PIPEDA (Canada's Personal Information Protection and Electronic Documents Act).",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb(
          [{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }],
          site.url
        )}
      />

      <PageHero
        eyebrow="Legal"
        titleLines={["Privacy Policy."]}
        intro="How Xandrea Harshey Services Inc. collects, uses, and protects your personal information."
      />

      <section className="bg-cream py-section">
        <div className="container-site max-w-3xl">
          <Reveal>
            <p className="font-sans text-xs text-ink/40">Last updated: June 2026</p>
          </Reveal>

          <div className="mt-10 space-y-12 font-sans text-base leading-relaxed text-ink/75">

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">1. Who We Are</h2>
              <p className="mt-4">
                Xandrea Harshey Services Inc. ("<strong>Xandrea Harshey</strong>", "we", "us", or "our")
                is a Canadian corporation headquartered in Calgary, Alberta. This Privacy Policy applies
                to personal information collected through our website at{" "}
                <a href={site.url} className="link-underline text-ink hover:text-gold">
                  {site.url}
                </a>{" "}
                and through our contact, inquiry, newsletter, and careers forms.
              </p>
              <p className="mt-3">
                We are committed to protecting your privacy in accordance with the{" "}
                <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and
                Canada's Anti-Spam Legislation (CASL).
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">2. What Personal Information We Collect</h2>
              <p className="mt-4">We may collect the following categories of personal information:</p>
              <ul className="mt-4 space-y-2 pl-5 list-disc">
                <li><strong>Contact details:</strong> name, email address, phone number</li>
                <li><strong>Inquiry information:</strong> the subject, category, and content of messages submitted through our contact form</li>
                <li><strong>Career applications:</strong> name, email, phone, area of interest, resume/CV, and any message you include</li>
                <li><strong>Newsletter subscriptions:</strong> email address</li>
                <li><strong>Technical data:</strong> IP address, browser type, pages visited, and referral source (collected automatically via server logs and analytics tools)</li>
              </ul>
              <p className="mt-4">
                We do not collect sensitive personal information (e.g., health data, financial account
                numbers, or government identification numbers) through this website.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">3. How We Use Your Information</h2>
              <p className="mt-4">We use your personal information only for the purposes for which it was collected:</p>
              <ul className="mt-4 space-y-2 pl-5 list-disc">
                <li>To respond to your inquiry, consultation request, or quote request</li>
                <li>To process and evaluate career applications</li>
                <li>To send newsletters or company updates to subscribers who have opted in</li>
                <li>To improve the functionality and content of our website</li>
                <li>To comply with legal obligations</li>
              </ul>
              <p className="mt-4">
                We will not use your personal information for purposes beyond those listed above without
                obtaining your additional consent.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">4. Legal Basis and Consent</h2>
              <p className="mt-4">
                By submitting information through our forms, you consent to the collection and use of
                your personal information as described in this policy. You may withdraw your consent
                at any time by contacting us at{" "}
                <a href={`mailto:${site.email}`} className="link-underline text-ink hover:text-gold">
                  {site.email}
                </a>
                . Withdrawal of consent will not affect the lawfulness of any processing conducted
                prior to withdrawal.
              </p>
              <p className="mt-3">
                Newsletter subscribers may unsubscribe at any time using the unsubscribe link
                included in every email, or by contacting us directly.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">5. Sharing of Personal Information</h2>
              <p className="mt-4">
                We do not sell, rent, or trade your personal information to third parties. We may share
                information with:
              </p>
              <ul className="mt-4 space-y-2 pl-5 list-disc">
                <li>
                  <strong>Service providers:</strong> trusted third-party vendors (e.g., email delivery,
                  applicant tracking) who process data on our behalf and are bound by confidentiality
                  obligations
                </li>
                <li>
                  <strong>Legal authorities:</strong> where required by law, court order, or
                  regulatory requirement
                </li>
                <li>
                  <strong>Business transfers:</strong> in the event of a merger, acquisition, or sale of
                  assets, personal information may be transferred to the successor organization
                </li>
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">6. Data Retention</h2>
              <p className="mt-4">
                We retain personal information only as long as necessary to fulfil the purposes for
                which it was collected, or as required by applicable law. Contact and inquiry
                information is typically retained for up to 24 months. Career applications are
                retained for up to 12 months unless you are hired. Newsletter subscriptions are
                retained until you unsubscribe.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">7. Security</h2>
              <p className="mt-4">
                We use reasonable administrative, technical, and physical safeguards to protect your
                personal information against unauthorized access, disclosure, alteration, or
                destruction. Our website is served over HTTPS. However, no method of transmission
                over the internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">8. Your Rights</h2>
              <p className="mt-4">Under PIPEDA, you have the right to:</p>
              <ul className="mt-4 space-y-2 pl-5 list-disc">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete personal information</li>
                <li>Withdraw consent for our use of your personal information</li>
                <li>Request deletion of your personal information (subject to legal retention requirements)</li>
                <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, contact us at{" "}
                <a href={`mailto:${site.email}`} className="link-underline text-ink hover:text-gold">
                  {site.email}
                </a>
                . We will respond within 30 days.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">9. Cookies and Analytics</h2>
              <p className="mt-4">
                Our website may use cookies and similar tracking technologies to improve functionality
                and analyse site usage. You may disable cookies through your browser settings;
                however, some site features may not function correctly without them. We do not
                currently use third-party advertising cookies.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">10. Third-Party Links</h2>
              <p className="mt-4">
                Our website may contain links to third-party websites (e.g., LinkedIn, Google Maps).
                We are not responsible for the privacy practices of those sites. We encourage you
                to review the privacy policies of any third-party site you visit.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">11. Changes to This Policy</h2>
              <p className="mt-4">
                We may update this Privacy Policy from time to time. The "Last updated" date at the
                top of this page indicates when the policy was last revised. Continued use of our
                website after changes constitutes acceptance of the updated policy.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-2xl text-ink">12. Contact Us</h2>
              <p className="mt-4">
                For questions, access requests, or privacy complaints, contact our Privacy Officer:
              </p>
              <div className="mt-4 border-l-2 border-gold pl-5">
                <p className="font-sans font-medium text-ink">Xandrea Harshey Services Inc.</p>
                <p>Calgary, Alberta, Canada</p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${site.email}`} className="link-underline text-ink hover:text-gold">
                    {site.email}
                  </a>
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </>
  );
}
