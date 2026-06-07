"use client";

/**
 * Glassy, site-wide contact popup. Opened from any "Contact / Request a
 * Consultation / Get in Touch" trigger via ContactModalProvider.
 *
 * Layout mirrors the reference: an editorial info column (intro + location /
 * email / contact / social) on the left and a frosted-glass form card on the
 * right, over a softly blurred navy backdrop. Animations use the project's
 * luxe easing and respect prefers-reduced-motion.
 */
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { inquiryCategories, contact, site, social } from "@/data/content";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const LUXE = [0.16, 1, 0.3, 1] as const;

const fieldCls =
  "w-full rounded-xl border border-ink/15 bg-paper/70 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink/20";

const backdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: LUXE } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: LUXE } },
};

const panel = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: LUXE, when: "beforeChildren", staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.28, ease: LUXE } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: LUXE } },
};

export default function ContactModal({
  isOpen,
  category,
  onClose,
}: {
  isOpen: boolean;
  category?: string;
  onClose: () => void;
}) {
  const { stop, start } = useSmoothScroll();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(category ?? "General Inquiries");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset transient state each time the modal (re)opens; sync the active pill
  // to whatever category the trigger requested.
  useEffect(() => {
    if (isOpen) {
      setActive(category ?? "General Inquiries");
      setSent(false);
      setErrors({});
      setFormError(null);
    }
  }, [isOpen, category]);

  // Scroll lock + Escape-to-close while open.
  useEffect(() => {
    if (!isOpen) return;
    stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Move focus into the dialog for keyboard users.
    const t = window.setTimeout(() => dialogRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      start();
    };
  }, [isOpen, stop, start, onClose]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const data = new FormData(e.currentTarget);

    const first = String(data.get("firstName") ?? "").trim();
    const last = String(data.get("lastName") ?? "").trim();
    const name = [first, last].filter(Boolean).join(" ");
    const email = String(data.get("email") ?? "");

    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email.";
    if (!String(data.get("message") ?? "").trim()) next.message = "Please tell us how we can help.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const payloadBody = {
        name,
        email,
        phone: String(data.get("phone") ?? ""),
        country: String(data.get("country") ?? ""),
        category: active,
        message: String(data.get("message") ?? ""),
        newsletter: data.get("newsletter") === "on",
        company: String(data.get("company") ?? ""), // honeypot
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBody),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (payload?.errors) setErrors(payload.errors as Errors);
        setFormError(payload?.error || "We couldn't send your message. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setFormError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto bg-navy-deep/70 px-4 py-8 backdrop-blur-md sm:px-6"
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Contact us"
            variants={panel}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-5xl gap-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl outline-none lg:grid-cols-[0.82fr_1.18fr]"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close contact form"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 bg-paper/80 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-ink hover:text-cream"
            >
              <span className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 block h-px w-4 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 block h-px w-4 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>

            {/* Info column */}
            <motion.div
              variants={item}
              className="relative flex flex-col justify-between gap-10 bg-navy-deep/40 p-8 text-cream sm:p-10"
            >
              <div>
                <span className="eyebrow text-gold-light">{contact.eyebrow}</span>
                <h2 className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl">
                  Let&rsquo;s Build Something
                  <br />
                  Great Together.
                </h2>
                <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-cream/70">
                  Whether you&rsquo;re a client, partner, or investor, our team is ready to assist
                  you with every detail — big or small.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="eyebrow mb-3 text-cream/50">Location</h3>
                  <p className="font-sans text-sm leading-relaxed text-cream/80">{contact.hq}</p>
                </div>
                <div>
                  <h3 className="eyebrow mb-3 text-cream/50">Social</h3>
                  <ul className="space-y-1.5">
                    {social.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline font-sans text-sm text-cream/80 hover:text-cream"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow mb-3 text-cream/50">Email</h3>
                  <a
                    href={`mailto:${site.email}`}
                    className="link-underline font-sans text-sm text-cream/80 hover:text-cream"
                  >
                    {site.email}
                  </a>
                </div>
                <div>
                  <h3 className="eyebrow mb-3 text-cream/50">Contact</h3>
                  <a
                    href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                    className="link-underline font-sans text-sm text-cream/80 hover:text-cream"
                  >
                    {site.phone}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form card */}
            <motion.div
              variants={item}
              className="bg-cream/95 p-8 text-ink sm:p-10"
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-xl border border-gold/40 bg-gold/5 p-10 text-center"
                  >
                    <h3 className="font-serif text-2xl text-ink">Thank you — message received.</h3>
                    <p className="mt-3 max-w-sm font-sans text-sm text-ink/65">
                      A member of our team will be in touch shortly. We look forward to building
                      something great together.
                    </p>
                    <button type="button" onClick={onClose} className="btn-ink mt-8">
                      <span>Close</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    exit={{ opacity: 0 }}
                    className="grid gap-5"
                  >
                    <div>
                      <h3 className="font-serif text-2xl text-ink">Tell Us What You Need</h3>
                      <p className="mt-1.5 font-sans text-sm text-ink/55">
                        Our team is ready to assist you with every detail, big or small.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input name="firstName" className={fieldCls} placeholder="First Name" aria-label="First name" />
                      <input name="lastName" className={fieldCls} placeholder="Last Name" aria-label="Last name" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input name="country" className={fieldCls} placeholder="Country" aria-label="Country" />
                      <input name="phone" className={fieldCls} placeholder="Phone Number" aria-label="Phone number" />
                    </div>

                    <div>
                      <input name="email" type="email" className={fieldCls} placeholder="Email Address" aria-label="Email address" />
                      {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                      {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                      <span className="eyebrow mb-3 block text-ink/50">Type of Inquiry</span>
                      <div className="flex flex-wrap gap-2">
                        {inquiryCategories.map((c) => {
                          const selected = active === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setActive(c)}
                              aria-pressed={selected}
                              className={`rounded-full border px-4 py-2 font-sans text-xs transition-colors duration-300 ${
                                selected
                                  ? "border-ink bg-ink text-cream"
                                  : "border-ink/20 text-ink/70 hover:border-ink/50"
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <textarea
                        name="message"
                        rows={4}
                        className={`${fieldCls} resize-none`}
                        placeholder="Message"
                        aria-label="Message"
                      />
                      {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
                    </div>

                    <label className="flex items-center gap-3 font-sans text-xs text-ink/65">
                      <input type="checkbox" name="newsletter" className="h-4 w-4 rounded border-ink/30 text-ink focus:ring-ink/30" />
                      I&rsquo;d like to receive exclusive offers and updates
                    </label>

                    {/* Honeypot — hidden from humans, catches bots. */}
                    <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                      <label htmlFor="contact-company">Company</label>
                      <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
                    </div>

                    <button
                      type="submit"
                      className="btn-ink w-full justify-center"
                      disabled={submitting}
                      aria-busy={submitting}
                    >
                      <span>{submitting ? "Sending…" : "Submit"}</span>
                    </button>
                    {formError && (
                      <p role="alert" className="text-sm text-red-600">{formError}</p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
