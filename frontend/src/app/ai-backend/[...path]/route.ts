import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 180;

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8000";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function backendUrl(request: NextRequest, path: string[]) {
  const url = new URL(request.url);
  const target = new URL(path.join("/"), `${BACKEND_URL.replace(/\/$/, "")}/`);
  target.search = url.search;
  return target;
}

function forwardedHeaders(request: NextRequest) {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const method = request.method.toUpperCase();
  const response = await fetch(backendUrl(request, path), {
    method,
    headers: forwardedHeaders(request),
    body: method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

