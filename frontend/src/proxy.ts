import { NextResponse, type NextRequest } from "next/server";

function publicHost(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host
  );
}

function marketFromHost(host: string) {
  return host.toLowerCase().startsWith("tw.") ? "TW" : "global";
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const host = publicHost(request);
  const market = marketFromHost(host);
  const locale = market === "TW" ? "zh-TW" : "en";

  requestHeaders.set("x-ccai-public-host", host);
  requestHeaders.set("x-ccai-market", market);
  requestHeaders.set("x-ccai-default-locale", locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set("ccai_market", market, { path: "/", sameSite: "lax" });
  response.cookies.set("ccai_default_locale", locale, { path: "/", sameSite: "lax" });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
