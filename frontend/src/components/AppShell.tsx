import Link from "next/link"
import type { ReactNode } from "react"
import { BriefcaseBusinessIcon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AppShellProps = {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  contentClassName?: string
}

const navItems = [
  ["Home", "/"],
  ["Workspace", "/workspace"],
  ["Guides", "/guides/hr"],
]

export function AppTopNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <BriefcaseBusinessIcon className="size-4" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold tracking-tight">
              Career Coaching AI
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Talent operations
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {navItems.map(([label, href]) => (
              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground"
                )}
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export function AppShell({
  eyebrow,
  title,
  description,
  children,
  actions,
  contentClassName,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppTopNav />

      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10",
          contentClassName
        )}
      >
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            {eyebrow ? (
              <Badge className="mb-4 rounded-full" variant="secondary">
                {eyebrow}
              </Badge>
            ) : null}
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        {children}
      </div>
    </main>
  )
}

export function Panel({
  title,
  description,
  children,
  action,
  className,
}: {
  title?: string
  description?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <Card className={cn("shadow-sm", className)}>
      {title || action || description ? (
        <>
          <CardHeader className="pb-3">
            <div>
              {title ? <CardTitle>{title}</CardTitle> : null}
              {description ? (
                <CardDescription className="mt-1.5">{description}</CardDescription>
              ) : null}
            </div>
            {action ? <CardAction>{action}</CardAction> : null}
          </CardHeader>
          <Separator />
        </>
      ) : null}
      <CardContent className={title || action || description ? "pt-4" : undefined}>
        {children}
      </CardContent>
    </Card>
  )
}

export function Message({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <Alert className="mt-4 bg-background/70">
      <AlertDescription>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap font-mono text-sm leading-6">
          {children}
        </pre>
      </AlertDescription>
    </Alert>
  )
}
