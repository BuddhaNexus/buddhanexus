import type { NextPageContext } from "next";
import cookie from "cookie";

export function parseCookies({ req }: NextPageContext) {
  return cookie.parse(req ? req.headers.cookie ?? "" : document.cookie);
}
