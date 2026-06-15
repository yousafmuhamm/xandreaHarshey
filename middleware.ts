import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveContactCategory } from "@/lib/contact-categories";

/** Legacy /contact URLs open the homepage contact popup instead of a dedicated page. */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const category = resolveContactCategory(url.searchParams.get("type"));

  url.pathname = "/";
  url.searchParams.delete("type");
  if (category) url.searchParams.set("contact", category);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/contact",
};
