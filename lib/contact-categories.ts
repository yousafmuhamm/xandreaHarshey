/** Maps legacy ?type= query keys from old /contact links to inquiry categories. */
export const contactTypeToCategory: Record<string, string> = {
  partnership: "Partnership Opportunities",
  investor: "Investor Relations",
  media: "Media Inquiries",
  careers: "Career Applications",
  construction: "Construction Projects",
  facility: "Facility Services",
};

export function resolveContactCategory(type?: string | null): string | undefined {
  if (!type) return undefined;
  return contactTypeToCategory[type] ?? type;
}
