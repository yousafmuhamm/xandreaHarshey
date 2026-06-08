"use client";

/**
 * Careers application form — styled + client-side validated with an animated
 * success state. No backend; submit is stubbed (// TODO connect ATS / email).
 */
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Errors = Partial<Record<"name" | "email" | "role", string>>;

const field =
  "w-full border-b border-ink/20 bg-transparent py-3 font-sans text-base text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none transition-colors";
const labelCls = "eyebrow mb-2 block text-ink/50";

const ROLES = [
  "Construction & Trades",
  "Facility Services",
  "Project Management",
  "Corporate & Administration",
  "International Trade",
  "Other / General Application",
];

export default function CareersForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [fileName, setFileName] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name")).trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email")))) next.email = "Valid email required.";
    if (!String(data.get("role"))) next.role = "Please select an area.";
    setErrors(next);
    if (Object.keys(next).length) return;

    // TODO: connect backend (applicant tracking system / email).
    setSent(true);
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
          <h3 className="font-serif text-2xl text-ink">Application received.</h3>
          <p className="mt-3 font-sans text-sm text-ink/65">
            Thank you for your interest in building your future with Xandrea. Our team will review your
            application and reach out if there's a fit.
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="grid gap-7">
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className={labelCls}>Full Name</label>
              <input id="c-name" name="name" className={field} placeholder="Your name" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="c-email" className={labelCls}>Email</label>
              <input id="c-email" name="email" type="email" className={field} placeholder="you@email.com" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="c-phone" className={labelCls}>Phone (optional)</label>
              <input id="c-phone" name="phone" className={field} placeholder="(403) 000-0000" />
            </div>
            <div>
              <label htmlFor="role" className={labelCls}>Area of Interest</label>
              <select id="role" name="role" defaultValue="" className={`${field} cursor-pointer`}>
                <option value="" disabled>Select an area…</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>Resume (optional)</label>
            <label className="flex cursor-pointer items-center justify-between border-b border-ink/20 py-3 font-sans text-sm text-ink/60 hover:border-ink/50">
              <span>{fileName || "Attach a PDF or document"}</span>
              <span className="text-[0.7rem] uppercase tracking-eyebrow text-gold">Browse</span>
              <input
                type="file"
                name="resume"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </div>

          <div>
            <label htmlFor="c-msg" className={labelCls}>Message (optional)</label>
            <textarea id="c-msg" name="message" rows={3} className={`${field} resize-none`} placeholder="Tell us a little about yourself…" />
          </div>

          <button type="submit" className="btn-ink self-start">
            <span>Submit Application</span>
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
