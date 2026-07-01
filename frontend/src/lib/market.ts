"use client";

import { useSyncExternalStore } from "react";

export type Market = "global" | "TW";
export type Locale = "en" | "zh-TW";

export const LOCALE_STORAGE_KEY = "ccai_locale";
export const MARKET_LOCALE_STORAGE_PREFIX = "ccai_locale_";

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
}

export function marketFromHost(host: string) {
  const normalized = host.toLowerCase();
  if (
    normalized.startsWith("tw.") ||
    normalized.includes(".tw.") ||
    normalized.includes(":5001-tw")
  ) {
    return "TW" as Market;
  }
  return "global" as Market;
}

export function defaultLocaleForMarket(market: Market) {
  return market === "TW" ? "zh-TW" : "en";
}

export function readMarket() {
  if (typeof window === "undefined") return "global" as Market;
  const hostMarket = marketFromHost(window.location.host);
  if (hostMarket === "TW") return hostMarket;
  const cookieMarket = readCookie("ccai_market");
  return cookieMarket === "TW" ? "TW" : hostMarket;
}

export function readLocale() {
  if (typeof window === "undefined") return "en" as Locale;
  const market = readMarket();
  const marketSaved = localStorage.getItem(`${MARKET_LOCALE_STORAGE_PREFIX}${market}`);
  if (marketSaved === "en" || marketSaved === "zh-TW") return marketSaved;

  const cookieLocale = readCookie("ccai_default_locale");
  if (market === "TW" && cookieLocale === "zh-TW") return "zh-TW";

  if (market === "global") {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "en" || saved === "zh-TW") return saved;
  }
  return defaultLocaleForMarket(market);
}

export function saveLocale(locale: Locale) {
  const market = readMarket();
  localStorage.setItem(`${MARKET_LOCALE_STORAGE_PREFIX}${market}`, locale);
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  window.dispatchEvent(new CustomEvent("ccai-locale-change", { detail: locale }));
}

export function isTaiwanLocale(locale: Locale) {
  return locale === "zh-TW";
}

function subscribeLocale(callback: () => void) {
  window.addEventListener("ccai-locale-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("ccai-locale-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLocaleSnapshot() {
  return readLocale();
}

function getMarketSnapshot() {
  return readMarket();
}

function getServerLocaleSnapshot() {
  return "en" as Locale;
}

function getServerMarketSnapshot() {
  return "global" as Market;
}

export function useCurrentLocale() {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );
  const market = useSyncExternalStore(
    subscribeLocale,
    getMarketSnapshot,
    getServerMarketSnapshot,
  );

  return { locale, market, isTaiwan: locale === "zh-TW" };
}
