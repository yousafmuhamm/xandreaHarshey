"use client";

/**
 * Contact / consultation / quote request form. Fully styled, client-side
 * validated, and delivered by the server route when email env vars are present.
 */
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { inquiryCategories } from "@/data/content";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "w-full border-b border-ink/20 bg-transparent py-3 font-sans text-base text-ink placeholder:text-ink/60 focus:border-ink focus:outline-none transition-colors";
const labelCls = "eyebrow mb-2 block text-ink/65";

export default function ContactForm({ defaultCategory }: { defaultCategory?: string }) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name")).trim()) next.name = "Please enter your name.";
    const email = String(data.get("email"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email.";
    if (!String(data.get("message")).trim()) next.message = "Please tell us how we can help.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (payload?.errors) setErrors(payload.errors as Errors);
        setFormError(
          payload?.error || "We couldn't send your message. Please try again."
        );
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
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-sm border border-gold/40 bg-gold/5 p-10 text-center"
        >
          <h3 className="font-serif text-2xl text-ink">Thank you — message received.</h3>
          <p className="mt-3 font-sans text-sm text-ink/65">
            A member of our team will be in touch shortly. We look forward to building something great
            together.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          exit={{ opacity: 0 }}
          className="grid gap-7"
        >
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelCls}>Full Name</label>
              <input id="name" name="name" className={field} placeholder="Your name" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>Email</label>
              <input id="email" name="email" type="email" className={field} placeholder="you@email.com" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className={labelCls}>Phone (optional)</label>
              <input id="phone" name="phone" className={field} placeholder="Phone number" />
            </div>
            <div>
              <label htmlFor="category" className={labelCls}>Inquiry Type</label>
              <select id="category" name="category" defaultValue={defaultCategory} className={`${field} cursor-pointer`}>
                {inquiryCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className={labelCls}>How can we help?</label>
            <textarea id="message" name="message" rows={4} className={`${field} resize-none`} placeholder="Tell us about your project, partnership, or inquiry…" />
            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
          </div>

          {/* Honeypot — hidden from humans, catches bots. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="btn-ink min-h-11 w-full sm:w-auto sm:self-start"
              disabled={submitting}
              aria-busy={submitting}
            >
              <span>{submitting ? "Sending…" : "Send Message"}</span>
            </button>
            {formError && (
              <p role="alert" className="text-sm text-red-600">{formError}</p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
