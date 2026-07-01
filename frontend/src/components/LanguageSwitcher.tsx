"use client";

import { LanguagesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveLocale, useCurrentLocale, type Locale } from "@/lib/market";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale } = useCurrentLocale();

  function changeLocale(nextLocale: Locale) {
    saveLocale(nextLocale);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-teal-900/15 bg-white/80 p-1 shadow-sm backdrop-blur",
        className,
      )}
    >
      <span className="grid size-7 place-items-center text-teal-800">
        <LanguagesIcon className="size-4" />
      </span>
      <Button
        className="h-7 px-2 text-xs"
        onClick={() => changeLocale("en")}
        size="sm"
        type="button"
        variant={locale === "en" ? "default" : "ghost"}
      >
        EN
      </Button>
      <Button
        className="h-7 px-2 text-xs"
        onClick={() => changeLocale("zh-TW")}
        size="sm"
        type="button"
        variant={locale === "zh-TW" ? "default" : "ghost"}
      >
        繁中
      </Button>
    </div>
  );
}
