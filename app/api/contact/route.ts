import { NextResponse } from "next/server";

/**
 * Contact / consultation form handler.
 *
 * Validates server-side, then delivers the message via Resend if configured.
 * Set these env vars to enable real email delivery (e.g. in .env.local / your
 * host's dashboard):
 *   RESEND_API_KEY   — a Resend API key (https://resend.com)
 *   CONTACT_TO_EMAIL — where inquiries should be delivered
 *   CONTACT_FROM_EMAIL — a verified sender (defaults to onboarding@resend.dev)
 *
 * Without these, the submission is accepted and logged (so the form works in
 * development and the UI flow can be verified) but no email is sent.
 */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const country = String(body.country ?? "").trim();
  const category = String(body.category ?? "General Inquiries").trim();
  const message = String(body.message ?? "").trim();
  const newsletter = body.newsletter === true;

  // Honeypot — bots fill hidden fields; humans never see them.
  if (String(body.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!emailRe.test(email)) errors.email = "Please enter a valid email.";
  if (!message) errors.message = "Please tell us how we can help.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Xandrea Harshey <onboarding@resend.dev>";

  if (apiKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `New inquiry (${category}) — ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "—"}`,
            `Country: ${country || "—"}`,
            `Inquiry type: ${category}`,
            `Newsletter opt-in: ${newsletter ? "Yes" : "No"}`,
            "",
            message,
          ].join("\n"),
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("Resend delivery failed:", res.status, detail);
        return NextResponse.json(
          { ok: false, error: "We couldn't send your message. Please try again or email us directly." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("Resend request error:", err);
      return NextResponse.json(
        { ok: false, error: "We couldn't send your message. Please try again." },
        { status: 502 }
      );
    }
  } else {
    // No provider configured — accept and log so the flow works in dev.
    console.info("[contact] (no email provider configured) submission:", {
      name,
      email,
      phone,
      country,
      category,
      newsletter,
      message,
    });
  }

  return NextResponse.json({ ok: true });
}
