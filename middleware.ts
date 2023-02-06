import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { rewrites } from "./routes-i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const decodedPathname = decodeURIComponent(pathname);

  if (decodedPathname in rewrites) {
    const { rewriteUrl, locale } = rewrites[decodedPathname];

    // Choose which page template to use
    const url = `/${locale}${rewriteUrl}`;
    return NextResponse.rewrite(new URL(url, request.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};
