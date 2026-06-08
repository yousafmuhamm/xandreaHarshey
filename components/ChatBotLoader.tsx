"use client";

/**
 * Defers the chat widget so its JS (and Framer Motion) is code-split out of the
 * initial bundle and only loaded once the browser is idle (or after a short
 * fallback delay). This keeps the chatbot off the critical path for first paint
 * and interactivity while still appearing on every page.
 */
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const XandreaChatBot = dynamic(() => import("@/components/XandreaChatBot"), {
  ssr: false,
  loading: () => null,
});

export default function ChatBotLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => setReady(true));
    } else {
      timeoutId = setTimeout(() => setReady(true), 1500);
    }

    return () => {
      if (idleId !== undefined && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return ready ? <XandreaChatBot /> : null;
}
