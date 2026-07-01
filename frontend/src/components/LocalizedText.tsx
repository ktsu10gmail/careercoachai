"use client";

import { useCurrentLocale } from "@/lib/market";

export function LocalizedText({ en, zh }: { en: string; zh: string }) {
  const { locale } = useCurrentLocale();
  return <>{locale === "zh-TW" ? zh : en}</>;
}
