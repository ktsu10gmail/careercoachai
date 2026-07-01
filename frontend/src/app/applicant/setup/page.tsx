"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/lib/api";
import { APPLICANT_TOKEN_KEY, saveToken } from "@/lib/auth";
import { detailMessage } from "@/lib/format";
import { useCurrentLocale } from "@/lib/market";

const setupCopy = {
  en: {
    eyebrow: "Applicant setup",
    title: "Create an applicant account.",
    description: "After signup, you will be signed in and sent to the applicant portal.",
    guide: "Applicant guide",
    login: "Log in",
    panel: "Profile",
    name: "Name",
    email: "Email",
    password: "Password",
    creating: "Creating...",
    create: "Create account",
    creatingMessage: "Creating account...",
  },
  "zh-TW": {
    eyebrow: "求職者帳號設定",
    title: "建立求職者帳號。",
    description: "註冊後會自動登入，並前往求職者入口。",
    guide: "求職者指南",
    login: "登入",
    panel: "個人資料",
    name: "姓名",
    email: "Email",
    password: "密碼",
    creating: "建立中...",
    create: "建立帳號",
    creatingMessage: "正在建立帳號...",
  },
} as const;

export default function ApplicantSetupPage() {
  const { locale } = useCurrentLocale();
  const t = setupCopy[locale];
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    setLoading(true);
    setMessage(t.creatingMessage);

    try {
      await signup({
        name: String(form.get("name") || "").trim(),
        email,
        password,
        role: "Applicant",
      });
      const token = await login(email, password);
      saveToken(APPLICANT_TOKEN_KEY, token.access_token);
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
            href="/applicant/login"
            onClick={(event) => {
              event.preventDefault();
              window.location.href = `/applicant/login?next=${encodeURIComponent(
                getNextPath(),
              )}`;
            }}
          >
            {t.login}
          </Link>
        </>
      }
    >
      <Panel title={t.panel}>
        <form autoComplete="on" className="grid max-w-xl gap-4" method="post" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">{t.name}</Label>
            <Input autoComplete="name" id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input autoComplete="email" id="email" name="email" required type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              minLength={8}
              name="password"
              required
              type="password"
              autoComplete="new-password"
            />
          </div>
          <Button className="w-fit" disabled={loading} type="submit">
            {loading ? t.creating : t.create}
          </Button>
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
