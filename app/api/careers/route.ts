import { NextResponse } from "next/server";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid application." }, { status: 400 });
  }

  const name = String(body.get("name") ?? "").trim();
  const email = String(body.get("email") ?? "").trim();
  const phone = String(body.get("phone") ?? "").trim();
  const role = String(body.get("role") ?? "").trim();
  const message = String(body.get("message") ?? "").trim();
  const resume = body.get("resume");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!emailRe.test(email)) errors.email = "Valid email required.";
  if (!role) errors.role = "Please select an area.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  if (resume instanceof File && resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Resume files must be 4 MB or smaller." },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CAREERS_TO_EMAIL || process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Xandrea Harshey <onboarding@resend.dev>";

  if (!apiKey || !to) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "Applications are not configured yet. Please email us directly." },
        { status: 503 }
      );
    }
    console.info("[careers] (no email provider configured) application:", {
      name,
      email,
      phone,
      role,
      message,
      resume: resume instanceof File ? resume.name : "",
    });
    return NextResponse.json({ ok: true });
  }

  const attachments = [];
  if (resume instanceof File && resume.size > 0) {
    const bytes = Buffer.from(await resume.arrayBuffer());
    attachments.push({
      filename: resume.name || "resume",
      content: bytes.toString("base64"),
    });
  }

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
        subject: `New career application (${role}) - ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || "Not provided"}`,
          `Area of interest: ${role}`,
          "",
          message || "No additional message provided.",
        ].join("\n"),
        attachments,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Career delivery failed:", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "We couldn't submit your application. Please email us directly." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Career request error:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your application. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
