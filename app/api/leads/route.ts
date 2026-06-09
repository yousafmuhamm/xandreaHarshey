import { NextResponse } from "next/server";

/**
 * AI lead bot submission handler.
 *
 * Uses the same Resend configuration as the contact form:
 *   RESEND_API_KEY
 *   CONTACT_TO_EMAIL
 *   CONTACT_FROM_EMAIL
 */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_CHARS = 1600;

type LeadPayload = {
  fullName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  projectLocation: string;
  propertyType: string;
  propertyTypeOther: string;
  serviceRequired: string[];
  serviceOther: string;
  scope: string;
  urgent: string;
  hasDocuments: string;
  startTimeline: string;
  siteInspection: string;
  contactTime: string;
};

function text(value: unknown) {
  return String(value ?? "").trim().slice(0, MAX_FIELD_CHARS);
}

function textList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => text(item))
    .filter(Boolean)
    .slice(0, 12);
}

function parsePayload(body: Record<string, unknown>): LeadPayload {
  return {
    fullName: text(body.fullName),
    companyName: text(body.companyName),
    contactNumber: text(body.contactNumber),
    email: text(body.email),
    projectLocation: text(body.projectLocation),
    propertyType: text(body.propertyType),
    propertyTypeOther: text(body.propertyTypeOther),
    serviceRequired: textList(body.serviceRequired),
    serviceOther: text(body.serviceOther),
    scope: text(body.scope),
    urgent: text(body.urgent),
    hasDocuments: text(body.hasDocuments),
    startTimeline: text(body.startTimeline),
    siteInspection: text(body.siteInspection),
    contactTime: text(body.contactTime),
  };
}

function validateLead(lead: LeadPayload) {
  const errors: Record<string, string> = {};

  if (!lead.fullName) errors.fullName = "Please enter your full name.";
  if (lead.contactNumber.replace(/\D/g, "").length < 7) {
    errors.contactNumber = "Please enter a valid contact number.";
  }
  if (!emailRe.test(lead.email)) errors.email = "Please enter a valid email.";
  if (!lead.projectLocation) errors.projectLocation = "Please enter the project location.";
  if (!lead.propertyType) errors.propertyType = "Please select the property type.";
  if (lead.propertyType === "Other" && !lead.propertyTypeOther) {
    errors.propertyTypeOther = "Please specify the property type.";
  }
  if (lead.serviceRequired.length === 0) {
    errors.serviceRequired = "Please select at least one service.";
  }
  if (lead.serviceRequired.includes("Other") && !lead.serviceOther) {
    errors.serviceOther = "Please specify the other service required.";
  }
  if (!lead.scope) errors.scope = "Please describe the scope of work.";
  if (!lead.urgent) errors.urgent = "Please answer whether the project is urgent.";
  if (!lead.hasDocuments) {
    errors.hasDocuments = "Please answer whether photos or documents are available.";
  }
  if (!lead.startTimeline) errors.startTimeline = "Please select a preferred start time.";
  if (!lead.siteInspection) {
    errors.siteInspection = "Please answer whether a site inspection is requested.";
  }
  if (!lead.contactTime) errors.contactTime = "Please select the best contact time.";

  return errors;
}

function buildLeadEmail(lead: LeadPayload) {
  const submittedAt = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Edmonton",
  }).format(new Date());

  const propertyType =
    lead.propertyType === "Other" && lead.propertyTypeOther
      ? `Other: ${lead.propertyTypeOther}`
      : lead.propertyType;
  const serviceRequired = lead.serviceRequired
    .map((service) =>
      service === "Other" && lead.serviceOther ? `Other: ${lead.serviceOther}` : service,
    )
    .join(", ");

  return [
    "New Lead from Xandrea Website AI Bot",
    "",
    "Client Information",
    `Full Name: ${lead.fullName}`,
    `Company Name: ${lead.companyName || "Not provided"}`,
    `Contact Number: ${lead.contactNumber}`,
    `Email Address: ${lead.email}`,
    `Property Address / Project Location: ${lead.projectLocation}`,
    "",
    "Project Information",
    `Property Type: ${propertyType}`,
    `Service Required: ${serviceRequired}`,
    "",
    "Scope of Work / Issue",
    lead.scope,
    "",
    "Additional Information",
    `Urgent: ${lead.urgent}`,
    `Photos, drawings, or documents available: ${lead.hasDocuments}`,
    `Preferred start: ${lead.startTimeline}`,
    "",
    "Site Visit & Quotation",
    `Site inspection requested: ${lead.siteInspection}`,
    `Best time to contact: ${lead.contactTime}`,
    "",
    "Lead Source",
    "Website AI Lead Bot",
    `Submitted: ${submittedAt} America/Edmonton`,
  ].join("\n");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: the browser widget submits this empty. Bots often fill it.
  if (text(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const lead = parsePayload(body);
  const errors = validateLead(lead);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Xandrea Harshey <onboarding@resend.dev>";
  const primaryService =
    lead.serviceRequired[0] === "Other" && lead.serviceOther
      ? lead.serviceOther
      : lead.serviceRequired[0] || "General";
  const subject = `New Lead: ${primaryService} - ${lead.fullName}`;
  const textBody = buildLeadEmail(lead);

  if (!apiKey || !to) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead delivery is not configured yet. Please email us directly.",
        },
        { status: 503 },
      );
    }

    console.info("[lead] (no email provider configured) submission:", lead);
    return NextResponse.json({ ok: true });
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
        reply_to: lead.email,
        subject,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Lead delivery failed:", res.status, detail);
      return NextResponse.json(
        {
          ok: false,
          error: "We could not send your request. Please try again or email us directly.",
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Lead delivery request error:", error);
    return NextResponse.json(
      { ok: false, error: "We could not send your request. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
