"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import {
  APPLICANT_TOKEN_KEY,
  clearToken,
  defaultEmployerPath,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";
import { useCurrentLocale } from "@/lib/market";

const loginCopy = {
  en: {
    eyebrow: "Applicant login",
    title: "Sign in to continue your application.",
    description: "Use your applicant account to search roles, answer questions, and upload a resume.",
    guide: "Applicant guide",
    create: "Create account",
    panel: "Account",
    email: "Email",
    password: "Password",
    signingIn: "Signing in...",
    signedIn: "Signed in. Opening applicant portal...",
    signIn: "Sign in",
  },
  "zh-TW": {
    eyebrow: "求職者登入",
    title: "登入後繼續使用求職工具。",
    description: "使用你的求職者帳號搜尋職缺、練習問題並管理履歷。",
    guide: "求職者指南",
    create: "建立帳號",
    panel: "帳號",
    email: "Email",
    password: "密碼",
    signingIn: "登入中...",
    signedIn: "已登入，正在前往求職者入口...",
    signIn: "登入",
  },
} as const;

export default function ApplicantLoginPage() {
  const { locale } = useCurrentLocale();
  const t = loginCopy[locale];
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearToken(APPLICANT_TOKEN_KEY);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(t.signingIn);

    try {
      const token = await login(
        String(form.get("email") || "").trim(),
        String(form.get("password") || ""),
      );
      const user = await getCurrentUser(token.access_token);
      const roles = user.roles?.length ? user.roles : [user.role];
      if (!roles.includes("Applicant")) {
        saveToken(EMPLOYER_TOKEN_KEY, token.access_token);
        window.location.href = defaultEmployerPath(roles);
        return;
      }
      clearToken(EMPLOYER_TOKEN_KEY);
      saveToken(APPLICANT_TOKEN_KEY, token.access_token);
      setMessage(t.signedIn);
      window.location.href = getNextPath();
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
      actions={
        <>
          <GuideLink href="/guides/applicant" label={t.guide} />
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/applicant/setup"
            onClick={(event) => {
              event.preventDefault();
              window.location.href = `/applicant/setup?next=${encodeURIComponent(
                getNextPath(),
              )}`;
            }}
          >
            {t.create}
          </Link>
        </>
      }
    >
      <Panel title={t.panel}>
        <form autoComplete="on" className="grid max-w-xl gap-4" method="post" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input autoComplete="username" id="email" name="email" required type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>
          <Button className="w-fit" disabled={loading} type="submit">
            {loading ? t.signingIn : t.signIn}
          </Button>
          <Link className="w-fit text-sm font-medium text-primary hover:underline" href="/forgot-password">
            Forgot password?
          </Link>
        </form>
        <Message>{message}</Message>
      </Panel>
    </AppShell>
  );
}

function getNextPath() {
  if (typeof window === "undefined") return "/applicant/portal";
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/") ? next : "/applicant/portal";
}
