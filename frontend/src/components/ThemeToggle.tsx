"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      aria-label="Toggle color mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size="icon"
      title="Toggle color mode"
      type="button"
      variant="ghost"
    >
      <MoonIcon className="size-4 dark:hidden" />
      <SunIcon className="hidden size-4 dark:block" />
    </Button>
  );
}
