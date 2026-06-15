"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useContactModal } from "./ContactModalProvider";

function ContactDeepLinkInner() {
  const searchParams = useSearchParams();
  const { open } = useContactModal();

  useEffect(() => {
    const category = searchParams.get("contact");
    if (!category) return;

    open(category);

    const url = new URL(window.location.href);
    url.searchParams.delete("contact");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [searchParams, open]);

  return null;
}

/** Opens the contact popup when the URL includes ?contact=Category (from legacy /contact redirects). */
export default function ContactDeepLink() {
  return (
    <Suspense fallback={null}>
      <ContactDeepLinkInner />
    </Suspense>
  );
}
