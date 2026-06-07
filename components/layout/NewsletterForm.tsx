"use client";

/**
 * Footer newsletter signup. Client-side validation + animated success state.
 * No backend yet — submit is stubbed.
 */
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success" | "submitting">("idle");
  const [errorMsg, setErrorMsg] = useState("Please enter a valid email address.");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(payload?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.p
            key="ok"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-sans text-sm text-gold-light"
          >
            Thank you — you're on the list.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center border-b border-cream/30 pb-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Email address"
              aria-label="Email address"
              className="w-full bg-transparent font-sans text-sm text-cream placeholder:text-cream/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
              className="ml-3 shrink-0 font-sans text-[0.7rem] uppercase tracking-eyebrow text-gold transition-colors hover:text-gold-light disabled:opacity-60"
            >
              {status === "submitting" ? "…" : "Subscribe"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === "error" && (
        <p role="alert" className="mt-2 font-sans text-xs text-red-300">{errorMsg}</p>
      )}
    </div>
  );
}
