import { NextResponse } from "next/server";

/**
 * Newsletter signup handler.
 *
 * If RESEND_API_KEY + NEWSLETTER_TO_EMAIL are set, a notification of the new
 * subscriber is emailed (a lightweight alternative to a full ESP integration —
 * swap for Mailchimp/Beehiiv/etc. here when chosen). Otherwise the signup is
 * accepted and logged so the UI flow works in development.
 */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();

  // Honeypot.
  if (String(body.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!emailRe.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL;
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
          subject: "New newsletter subscriber",
          text: `New subscriber: ${email}`,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("Newsletter delivery failed:", res.status, detail);
        return NextResponse.json(
          { ok: false, error: "Something went wrong. Please try again." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("Newsletter request error:", err);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }
  } else {
    console.info("[newsletter] (no provider configured) subscriber:", email);
  }

  return NextResponse.json({ ok: true });
}
