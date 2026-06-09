"use client";

/**
 * Xandrea lead assistant.
 *
 * Primary mission: guide visitors through a structured estimate request and
 * deliver a clean lead email to the Xandrea team. The original Q&A assistant is
 * preserved as a secondary path for visitors who need quick company context.
 */

import { useEffect, useRef, useState } from "react";
import { useDialogFocus } from "@/lib/useDialogFocus";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };
type BotMode = "idle" | "lead" | "review" | "qa" | "complete";
type StepType = "text" | "email" | "tel" | "textarea" | "singleChoice" | "multiChoice";

type LeadData = {
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

type LeadStep = {
  id: keyof LeadData;
  label: string;
  prompt: string;
  helper?: string;
  type: StepType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  showWhen?: (lead: LeadData) => boolean;
};

const WELCOME: Message = {
  role: "assistant",
  content:
    "Welcome to Xandrea Services Inc. I can help prepare an estimate request, schedule a site inspection, or answer a quick question about our services.",
};

const ERROR_REPLY = "The assistant is currently unavailable. Please try again later.";

const EMPTY_LEAD: LeadData = {
  fullName: "",
  companyName: "",
  contactNumber: "",
  email: "",
  projectLocation: "",
  propertyType: "",
  propertyTypeOther: "",
  serviceRequired: [],
  serviceOther: "",
  scope: "",
  urgent: "",
  hasDocuments: "",
  startTimeline: "",
  siteInspection: "",
  contactTime: "",
};

const LEAD_STEPS: LeadStep[] = [
  {
    id: "fullName",
    label: "Full name",
    prompt: "First, what is your full name?",
    type: "text",
    placeholder: "Your full name",
    required: true,
  },
  {
    id: "companyName",
    label: "Company name",
    prompt: "What is your company name, if applicable?",
    helper: "You can skip this if the project is personal or residential.",
    type: "text",
    placeholder: "Company name",
  },
  {
    id: "contactNumber",
    label: "Contact number",
    prompt: "What phone number should our specialist use to reach you?",
    type: "tel",
    placeholder: "Phone number",
    required: true,
  },
  {
    id: "email",
    label: "Email address",
    prompt: "What email address should we use for your estimate request?",
    type: "email",
    placeholder: "Email address",
    required: true,
  },
  {
    id: "projectLocation",
    label: "Project location",
    prompt: "What is the property address or project location?",
    type: "textarea",
    placeholder: "Property address or project location",
    required: true,
  },
  {
    id: "propertyType",
    label: "Property type",
    prompt: "What type of property is involved?",
    type: "singleChoice",
    required: true,
    options: ["Residential", "Commercial", "Apartment Complex", "Condominium", "Industrial", "Other"],
  },
  {
    id: "propertyTypeOther",
    label: "Other property type",
    prompt: "Please specify the property type.",
    type: "text",
    placeholder: "Property type",
    required: true,
    showWhen: (lead) => lead.propertyType === "Other",
  },
  {
    id: "serviceRequired",
    label: "Service required",
    prompt: "What service do you require?",
    helper: "Select all that apply.",
    type: "multiChoice",
    required: true,
    options: [
      "Roofing",
      "Exterior Repair",
      "Waterproofing",
      "Painting",
      "Flooring",
      "Renovation",
      "Construction",
      "Cleaning Services",
      "Other",
    ],
  },
  {
    id: "serviceOther",
    label: "Other service",
    prompt: "Please specify the other service you require.",
    type: "text",
    placeholder: "Service required",
    required: true,
    showWhen: (lead) => lead.serviceRequired.includes("Other"),
  },
  {
    id: "scope",
    label: "Scope of work",
    prompt: "Please describe the scope of work or issue you would like us to assess.",
    type: "textarea",
    placeholder: "Briefly describe what needs to be assessed",
    required: true,
  },
  {
    id: "urgent",
    label: "Urgency",
    prompt: "Is this project urgent?",
    type: "singleChoice",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "hasDocuments",
    label: "Photos or documents",
    prompt: "Do you have photos, drawings, or documents related to the project?",
    type: "singleChoice",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "startTimeline",
    label: "Preferred start",
    prompt: "When would you like the work to begin?",
    type: "singleChoice",
    required: true,
    options: ["As soon as possible", "Within 1 month", "1-3 months", "Flexible", "Specific date"],
  },
  {
    id: "siteInspection",
    label: "Site inspection",
    prompt: "Would you like to schedule a site inspection?",
    type: "singleChoice",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "contactTime",
    label: "Best contact time",
    prompt: "What is the best time for our team to contact you?",
    type: "singleChoice",
    required: true,
    options: ["Morning", "Afternoon", "Evening", "Anytime"],
  },
];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isStepVisible(step: LeadStep, lead: LeadData) {
  return !step.showWhen || step.showWhen(lead);
}

function findNextStepIndex(fromIndex: number, lead: LeadData) {
  for (let index = fromIndex + 1; index < LEAD_STEPS.length; index += 1) {
    if (isStepVisible(LEAD_STEPS[index], lead)) return index;
  }
  return -1;
}

function findPreviousStepIndex(fromIndex: number, lead: LeadData) {
  for (let index = fromIndex - 1; index >= 0; index -= 1) {
    if (isStepVisible(LEAD_STEPS[index], lead)) return index;
  }
  return -1;
}

function formatPropertyType(lead: LeadData) {
  if (lead.propertyType === "Other" && lead.propertyTypeOther) {
    return `Other: ${lead.propertyTypeOther}`;
  }
  return lead.propertyType;
}

function formatServices(lead: LeadData) {
  return lead.serviceRequired
    .map((service) => (service === "Other" && lead.serviceOther ? `Other: ${lead.serviceOther}` : service))
    .join(", ");
}

export default function XandreaChatBot() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<BotMode>("idle");
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [lead, setLead] = useState<LeadData>(EMPTY_LEAD);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const currentStep = LEAD_STEPS[stepIndex];
  const visibleStepCount = LEAD_STEPS.filter((step) => isStepVisible(step, lead)).length;
  const visibleStepPosition =
    LEAD_STEPS.slice(0, stepIndex + 1).filter((step) => isStepVisible(step, lead)).length || 1;
  const qaActive = mode === "qa";
  const leadInputActive =
    mode === "lead" &&
    currentStep &&
    ["text", "email", "tel", "textarea"].includes(currentStep.type);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open, mode, fieldError]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, mode, stepIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useDialogFocus(panelRef, open, () => setOpen(false));

  function appendMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  function askStep(index: number) {
    const step = LEAD_STEPS[index];
    if (!step) return;
    setFieldError("");
    setInput("");
    appendMessage({
      role: "assistant",
      content: step.helper ? `${step.prompt}\n${step.helper}` : step.prompt,
    });
  }

  function startLeadFlow(siteInspection = false) {
    const nextLead = siteInspection
      ? { ...EMPTY_LEAD, siteInspection: "Yes" }
      : EMPTY_LEAD;
    setLead(nextLead);
    setStepIndex(0);
    setInput("");
    setFieldError("");
    setMode("lead");
    setMessages([
      WELCOME,
      {
        role: "user",
        content: siteInspection ? "Schedule a site inspection" : "Get an estimate",
      },
      {
        role: "assistant",
        content:
          "Thank you for contacting Xandrea Services Inc. I will collect the key details so our team can prepare an accurate assessment and quotation.",
      },
    ]);
    window.setTimeout(() => askStep(0), 0);
  }

  function startQaMode() {
    setMode("qa");
    setInput("");
    setFieldError("");
    setMessages([
      WELCOME,
      { role: "user", content: "Ask a question" },
      {
        role: "assistant",
        content:
          "Of course. Ask me about Xandrea's companies, services, or how to route your inquiry. If your question is project-related, I can also help send the details to our team for a quote.",
      },
    ]);
  }

  function validateStep(step: LeadStep, value: string | string[]) {
    if (Array.isArray(value)) {
      if (step.required && value.length === 0) return "Please select at least one option.";
      return "";
    }

    const trimmed = value.trim();
    if (step.required && !trimmed) return "Please provide this detail to continue.";
    if (step.type === "email" && !emailRe.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    if (step.type === "tel" && trimmed.replace(/\D/g, "").length < 7) {
      return "Please enter a valid contact number.";
    }
    return "";
  }

  function commitStep(value: string | string[]) {
    if (!currentStep || loading) return;
    const error = validateStep(currentStep, value);
    if (error) {
      setFieldError(error);
      return;
    }

    const displayValue = Array.isArray(value) ? value.join(", ") : value.trim() || "Skipped";
    const nextLead = { ...lead, [currentStep.id]: Array.isArray(value) ? value : value.trim() };
    setLead(nextLead);
    setFieldError("");
    setInput("");
    appendMessage({ role: "user", content: displayValue });

    const nextIndex = findNextStepIndex(stepIndex, nextLead);
    if (nextIndex === -1) {
      setMode("review");
      appendMessage({
        role: "assistant",
        content:
          "Thank you. Please review the request below, then send it to our project team.",
      });
      return;
    }

    setStepIndex(nextIndex);
    window.setTimeout(() => askStep(nextIndex), 0);
  }

  function skipCurrentStep() {
    if (!currentStep || currentStep.required) return;
    commitStep("");
  }

  function goBack() {
    if (mode === "review") {
      const previousIndex = findPreviousStepIndex(LEAD_STEPS.length, lead);
      if (previousIndex === -1) return;
      setMode("lead");
      setStepIndex(previousIndex);
      askStep(previousIndex);
      return;
    }
    if (mode !== "lead" || stepIndex === 0) return;
    const previousIndex = findPreviousStepIndex(stepIndex, lead);
    if (previousIndex === -1) return;
    setStepIndex(previousIndex);
    askStep(previousIndex);
  }

  async function submitLead() {
    if (loading) return;
    setLoading(true);
    setFieldError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, website: "" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Lead submission failed.");
      }

      setMode("complete");
      appendMessage({
        role: "assistant",
        content:
          "Your estimate request has been sent to Xandrea Services Inc. A project specialist will contact you to discuss your requirements and provide the next step.",
      });
    } catch (error) {
      setFieldError(
        error instanceof Error
          ? error.message
          : "We could not send your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendQaMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter((message) => message !== WELCOME),
        }),
      });

      if (!res.ok || !res.body) throw new Error(`Request failed: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      if (!acc.trim()) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: ERROR_REPLY };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: ERROR_REPLY };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  function sendMessage() {
    if (qaActive) {
      void sendQaMessage();
      return;
    }
    if (leadInputActive) commitStep(input);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const lastMsg = messages[messages.length - 1];
  const showThinking = loading && lastMsg?.role === "assistant" && lastMsg.content === "";

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[250] flex flex-col items-end font-sans md:bottom-6 md:right-6">
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`mb-3 w-[min(420px,calc(100vw-24px))] origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
        role="dialog"
        aria-label="Xandrea estimate assistant"
        aria-hidden={!open}
      >
        <div className="flex h-[min(640px,calc(100vh-112px))] flex-col overflow-hidden rounded-2xl border border-navy/10 bg-paper shadow-[0_10px_30px_-16px_rgba(14,26,43,0.6)]">
          <div className="relative flex items-start justify-between gap-3 bg-navy px-5 py-4 text-cream">
            <div className="min-w-0">
              <p className="truncate text-[0.95rem] font-medium tracking-normal">
                Xandrea Estimate Assistant
              </p>
              <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.18em] text-gold-light">
                Lead requests and site inspections
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close estimate assistant"
              className="-mr-1 -mt-1 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-1.5 text-cream/80 transition-colors hover:bg-white/10 hover:text-cream"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {mode === "lead" && (
            <div className="border-b border-navy/10 bg-cream/60 px-5 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy/10">
                  <div
                    className="h-full rounded-full bg-gold-deep transition-all duration-300"
                    style={{ width: `${((stepIndex + 1) / LEAD_STEPS.length) * 100}%` }}
                  />
                </div>
                <span className="shrink-0 text-[0.72rem] font-medium text-navy/70">
                  {visibleStepPosition}/{visibleStepCount}
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => {
              const isThinkingBubble = showThinking && index === messages.length - 1;
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[0.86rem] leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-md bg-navy text-cream"
                        : "rounded-bl-md border border-navy/10 bg-cream/70 text-ink"
                    }`}
                  >
                    {isThinkingBubble ? (
                      <span className="inline-flex items-center gap-1 text-ink/65">
                        Thinking
                        <span className="inline-flex gap-0.5">
                          <Dot delay="0ms" />
                          <Dot delay="150ms" />
                          <Dot delay="300ms" />
                        </span>
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              );
            })}

            {mode === "idle" && (
              <div className="grid gap-2 pt-1">
                <ActionButton label="Get your estimate" onClick={() => startLeadFlow()} />
                <ActionButton
                  label="Schedule a site inspection"
                  onClick={() => startLeadFlow(true)}
                />
                <ActionButton label="Ask a question" onClick={startQaMode} variant="secondary" />
              </div>
            )}

            {mode === "lead" && currentStep && (
              <LeadStepControls
                lead={lead}
                step={currentStep}
                canGoBack={stepIndex > 0}
                disabled={loading}
                onBack={goBack}
                onCommit={commitStep}
                onSkip={skipCurrentStep}
              />
            )}

            {mode === "review" && (
              <ReviewPanel
                lead={lead}
                disabled={loading}
                onBack={goBack}
                onSubmit={submitLead}
              />
            )}

            {mode === "complete" && (
              <div className="grid gap-2 pt-1">
                <ActionButton label="Start another request" onClick={() => startLeadFlow()} />
                <ActionButton label="Ask a question" onClick={startQaMode} variant="secondary" />
              </div>
            )}

            {mode === "qa" && (
              <QuotePrompt
                onEstimate={() => startLeadFlow()}
                onInspection={() => startLeadFlow(true)}
              />
            )}

            {fieldError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[0.78rem] leading-relaxed text-red-700">
                {fieldError}
              </p>
            )}
          </div>

          {(qaActive || leadInputActive) && (
            <div className="border-t border-navy/10 bg-cream/50 px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={currentStep?.type === "textarea" ? 2 : 1}
                  placeholder={
                    qaActive
                      ? "Ask a question..."
                      : currentStep?.placeholder || "Type your answer..."
                  }
                  className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-[0.86rem] text-ink outline-none transition-colors placeholder:text-ink/60 focus:border-gold-deep"
                />
                {mode === "lead" && currentStep && !currentStep.required && (
                  <button
                    type="button"
                    onClick={skipCurrentStep}
                    disabled={loading}
                    className="min-h-11 rounded-xl border border-navy/15 bg-white px-3 text-[0.78rem] font-medium text-navy transition-colors hover:border-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Skip
                  </button>
                )}
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label={qaActive ? "Send message" : "Send answer"}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-cream transition-all duration-300 hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 12l16-8-6 16-3-7-7-1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-hidden={open}
          tabIndex={open ? -1 : 0}
          className={`group/label flex min-h-11 items-center gap-2 rounded-full border border-gold/30 bg-white/90 py-2 pl-3.5 pr-4 shadow-[0_8px_18px_-12px_rgba(14,26,43,0.5)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold-deep ${
            open
              ? "pointer-events-none translate-x-2 scale-95 opacity-0"
              : "pointer-events-auto opacity-100 motion-safe:animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="chat-beacon absolute inline-flex h-full w-full rounded-full bg-gold" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="whitespace-nowrap text-[0.8rem] font-medium text-navy">
            Get your estimate
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close Xandrea estimate assistant" : "Open Xandrea estimate assistant"}
          aria-expanded={open}
          className={`group pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full bg-navy text-cream shadow-[0_14px_32px_-14px_rgba(14,26,43,0.8)] ring-2 ring-gold/50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:ring-gold ${
            open ? "" : "chat-heartbeat"
          }`}
        >
          {!open && (
            <span className="chat-beacon pointer-events-none absolute inset-0 rounded-full bg-gold/30" />
          )}
          <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4.5 5.5h15a1 1 0 011 1v8a1 1 0 01-1 1H9l-4 3.2V6.5a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 10.8h7M8.5 13.2h4.8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl px-4 py-2.5 text-left text-[0.84rem] font-medium transition-colors ${
        variant === "primary"
          ? "bg-navy text-cream hover:bg-navy-deep"
          : "border border-navy/15 bg-white text-navy hover:border-gold-deep"
      }`}
    >
      {label}
    </button>
  );
}

function QuotePrompt({
  onEstimate,
  onInspection,
}: {
  onEstimate: () => void;
  onInspection: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <button
        type="button"
        onClick={onEstimate}
        className="min-h-10 rounded-full bg-navy px-4 py-2 text-[0.76rem] font-medium text-cream transition-colors hover:bg-navy-deep"
      >
        Get a quote
      </button>
      <button
        type="button"
        onClick={onInspection}
        className="min-h-10 rounded-full border border-navy/15 bg-white px-4 py-2 text-[0.76rem] font-medium text-navy transition-colors hover:border-gold-deep"
      >
        Site inspection
      </button>
    </div>
  );
}

function LeadStepControls({
  lead,
  step,
  canGoBack,
  disabled,
  onBack,
  onCommit,
  onSkip,
}: {
  lead: LeadData;
  step: LeadStep;
  canGoBack: boolean;
  disabled: boolean;
  onBack: () => void;
  onCommit: (value: string | string[]) => void;
  onSkip: () => void;
}) {
  const existingValue = lead[step.id];
  const selectedValues = Array.isArray(existingValue) ? existingValue : [];
  const selectedKey = JSON.stringify(selectedValues);
  const [draftValues, setDraftValues] = useState<string[]>(selectedValues);

  useEffect(() => {
    setDraftValues(JSON.parse(selectedKey) as string[]);
  }, [selectedKey, step.id]);

  if (step.type !== "singleChoice" && step.type !== "multiChoice") {
    return canGoBack ? <BackButton onBack={onBack} disabled={disabled} /> : null;
  }

  return (
    <div className="space-y-3 pt-1">
      <div className="flex flex-wrap gap-2">
        {step.options?.map((option) => {
          const selected =
            step.type === "multiChoice"
              ? draftValues.includes(option)
              : existingValue === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (step.type === "singleChoice") {
                  onCommit(option);
                  return;
                }
                const next = selected
                  ? draftValues.filter((item) => item !== option)
                  : [...draftValues, option];
                setDraftValues(next);
              }}
              className={`min-h-11 rounded-full border px-3.5 py-2 text-[0.78rem] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                selected
                  ? "border-navy bg-navy text-cream"
                  : "border-navy/15 bg-white text-navy hover:border-gold-deep"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {step.type === "multiChoice" && (
        <button
          type="button"
          disabled={disabled || draftValues.length === 0}
          onClick={() => onCommit(draftValues)}
          className="min-h-11 w-full rounded-xl bg-navy px-4 py-2.5 text-[0.84rem] font-medium text-cream transition-colors hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue with selected services
        </button>
      )}
      <div className="flex items-center justify-between gap-3">
        {canGoBack ? <BackButton onBack={onBack} disabled={disabled} /> : <span />}
        {!step.required && (
          <button
            type="button"
            onClick={onSkip}
            disabled={disabled}
            className="text-[0.78rem] font-medium text-navy/65 transition-colors hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

function BackButton({ onBack, disabled }: { onBack: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onBack}
      disabled={disabled}
      className="text-[0.78rem] font-medium text-navy/65 transition-colors hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
    >
      Back
    </button>
  );
}

function ReviewPanel({
  lead,
  disabled,
  onBack,
  onSubmit,
}: {
  lead: LeadData;
  disabled: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const rows = [
    ["Name", lead.fullName],
    ["Company", lead.companyName || "Not applicable"],
    ["Phone", lead.contactNumber],
    ["Email", lead.email],
    ["Location", lead.projectLocation],
    ["Property", formatPropertyType(lead)],
    ["Service", formatServices(lead)],
    ["Urgent", lead.urgent],
    ["Photos/documents", lead.hasDocuments],
    ["Start", lead.startTimeline],
    ["Inspection", lead.siteInspection],
    ["Contact time", lead.contactTime],
    ["Scope", lead.scope],
  ];

  return (
    <div className="space-y-3 rounded-xl border border-navy/10 bg-white p-3">
      <dl className="grid gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-0.5">
            <dt className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-navy/50">
              {label}
            </dt>
            <dd className="text-[0.84rem] leading-relaxed text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="min-h-11 flex-1 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[0.84rem] font-medium text-navy transition-colors hover:border-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Edit last answer
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="min-h-11 flex-1 rounded-xl bg-navy px-4 py-2.5 text-[0.84rem] font-medium text-cream transition-colors hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? "Sending..." : "Send request"}
        </button>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-ink/65"
      style={{ animationDelay: delay }}
    />
  );
}
