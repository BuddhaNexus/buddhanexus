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

  if (pathname in rewrites) {
    const { rewriteUrl, locale } = rewrites[pathname as keyof typeof rewrites];

    // Choose which page template to use
    return NextResponse.rewrite(
      new URL(`/${locale}${rewriteUrl}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/:path*"],
};
