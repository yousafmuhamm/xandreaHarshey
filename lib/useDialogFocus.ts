"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useDialogFocus(
  ref: RefObject<HTMLElement>,
  active: boolean,
  onEscape: () => void
) {
  useEffect(() => {
    if (!active) return;

    const previous = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const focusDialog = window.setTimeout(() => {
      const dialog = ref.current;
      if (dialog?.contains(document.activeElement)) return;
      const first = dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (first ?? dialog)?.focus();
    }, 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = ref.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusDialog);
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus({ preventScroll: true });
    };
  }, [active, onEscape, ref]);
}
