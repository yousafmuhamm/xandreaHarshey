"use client";

/**
 * Xandrea AI Assistant — a glassy, brand-matched floating chat widget.
 *
 * - Streams answers token-by-token from /api/chat (feels fast).
 * - Sends the running conversation so the assistant has memory.
 * - Answers strictly from the company knowledge file (enforced server-side).
 * The NVIDIA API key never reaches this component; all model calls go through
 * the server route.
 */

import { useEffect, useRef, useState } from "react";
import { useDialogFocus } from "@/lib/useDialogFocus";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hello, I'm the Xandrea AI Assistant. I can help answer questions about our companies, services, and corporate background.",
};

const ERROR_REPLY =
  "The assistant is currently unavailable. Please try again later.";

const SUGGESTIONS = [
  "What divisions do you have?",
  "Do you do commercial construction?",
  "Where are you located?",
];

export default function XandreaChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Keep the latest message in view as content streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useDialogFocus(panelRef, open, () => setOpen(false));

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    // Add an empty assistant bubble we will stream into.
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Strip the local-only welcome message before sending history.
          messages: nextMessages.filter((m) => m !== WELCOME),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed: ${res.status}`);
      }

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

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const lastMsg = messages[messages.length - 1];
  const showThinking =
    loading && lastMsg?.role === "assistant" && lastMsg.content === "";

  return (
    <div className="fixed bottom-5 right-5 z-[300] flex flex-col items-end font-sans md:bottom-6 md:right-6">
      {/* Chat panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`mb-3 w-[min(360px,calc(100vw-24px))] origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
        role="dialog"
        aria-label="Xandrea AI Assistant"
        aria-hidden={!open}
      >
        <div className="flex h-[min(560px,calc(100vh-120px))] flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/70 shadow-[0_20px_60px_-15px_rgba(14,26,43,0.45)] backdrop-blur-2xl">
          {/* Header */}
          <div className="relative flex items-start justify-between gap-3 border-b border-white/20 bg-gradient-to-br from-navy to-navy-deep px-5 py-4 text-cream">
            <div className="min-w-0">
              <p className="truncate text-[0.95rem] font-medium tracking-tight">
                Xandrea AI Assistant
              </p>
              <p className="mt-0.5 text-[0.62rem] uppercase tracking-eyebrow text-gold-light">
                Ask about our companies and services
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
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

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m, i) => {
              const isThinkingBubble =
                showThinking && i === messages.length - 1;
              return (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[0.85rem] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-navy text-cream"
                        : "rounded-bl-md border border-white/50 bg-white/80 text-ink"
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
                      m.content
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick suggestions, only before the first question */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                    className="min-h-11 rounded-full border border-navy/20 bg-white/60 px-3 py-2 text-[0.72rem] text-navy transition-colors hover:border-gold-deep hover:text-gold-deep"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-white/20 bg-white/50 px-3 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask a question..."
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-navy/15 bg-white/80 px-3.5 py-2.5 text-[0.85rem] text-ink outline-none transition-colors placeholder:text-ink/60 focus:border-gold-deep"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
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
        </div>
      </div>

      {/* Launcher + attention label */}
      <div className="flex items-center gap-2.5">
        {/* Friendly label — draws the eye to the bubble when the chat is closed */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-hidden={open}
          tabIndex={open ? -1 : 0}
          className={`group/label flex min-h-11 items-center gap-2 rounded-full border border-gold/30 bg-white/80 py-2 pl-3.5 pr-4 shadow-[0_10px_30px_-12px_rgba(14,26,43,0.5)] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold-deep ${
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
            Ask me anything
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close Xandrea AI Assistant" : "Open Xandrea AI Assistant"}
          aria-expanded={open}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-deep text-cream shadow-[0_18px_40px_-10px_rgba(14,26,43,0.75)] ring-2 ring-gold/50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_55px_-10px_rgba(14,26,43,0.85)] hover:ring-gold ${
            open ? "" : "chat-heartbeat"
          }`}
        >
          {/* Periodic beacon ring — beats, then rests (hidden when open) */}
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
              <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
              <circle cx="12.5" cy="10.5" r="1" fill="currentColor" />
              <circle cx="15.5" cy="10.5" r="1" fill="currentColor" />
            </svg>
          )}
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
