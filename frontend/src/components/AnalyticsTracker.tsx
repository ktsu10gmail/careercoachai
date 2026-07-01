"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { apiFetch, type UserRole } from "@/lib/api";
import {
  APPLICANT_TOKEN_KEY,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
} from "@/lib/auth";
import { readLocale, readMarket } from "@/lib/market";

const VISITOR_KEY = "ccai_visitor_id";
const SESSION_KEY = "ccai_session_id";

function randomId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readOrCreateStorageId(key: string, prefix: string, storage: Storage) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = randomId(prefix);
  storage.setItem(key, value);
  return value;
}

async function readIdentity(): Promise<{ role: UserRole | null; token: string }> {
  const employerToken = readToken(EMPLOYER_TOKEN_KEY);
  const applicantToken = readToken(APPLICANT_TOKEN_KEY);

  for (const token of [applicantToken, employerToken]) {
    if (!token) continue;
    try {
      const user = await getCurrentUser(token);
      return { role: user.role, token };
    } catch {
      // A stale token should not prevent another valid role token from being used.
    }
  }
  return { role: null, token: "" };
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    async function trackPageView() {
      const visitorId = readOrCreateStorageId(VISITOR_KEY, "visitor", localStorage);
      const sessionId = readOrCreateStorageId(SESSION_KEY, "session", sessionStorage);
      const identity = await readIdentity();
      const market = readMarket();
      const locale = readLocale();

      await apiFetch("/api/public/usage-events", {
        method: "POST",
        token: identity.token,
        body: JSON.stringify({
          event_type: "page_view",
          path: pathname,
          visitor_id: visitorId,
          session_id: sessionId,
          role: identity.role,
          market,
          locale,
          host: window.location.host,
          metadata_json: {
            host: window.location.host,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
          },
        }),
      }).catch(() => undefined);
    }

    void trackPageView();
  }, [pathname]);

  return null;
}
