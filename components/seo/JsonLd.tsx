/**
 * Server component that injects a JSON-LD <script>. Used per-page for
 * BreadcrumbList, Person, Service, and other structured data to strengthen
 * rich-result eligibility and entity understanding.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Helper to build a BreadcrumbList for a page. */
export function breadcrumb(
  items: { name: string; path: string }[],
  base: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}
