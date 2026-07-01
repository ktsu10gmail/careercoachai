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

export default function EmployerLoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearToken(EMPLOYER_TOKEN_KEY);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("Signing in...");

    try {
      const token = await login(
        String(form.get("email") || "").trim(),
        String(form.get("password") || ""),
      );
      clearToken(APPLICANT_TOKEN_KEY);
      saveToken(EMPLOYER_TOKEN_KEY, token.access_token);
      const user = await getCurrentUser(token.access_token);
      setMessage("Signed in. Opening workspace...");
      const roles = user.roles?.length ? user.roles : [user.role];
      window.location.href = getNextPath() || defaultEmployerPath(roles);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Workspace login"
      title="Sign in to your employer or agency workspace."
      description="Company admins, HR users, recruiters, and hiring managers use this shared operations entry point."
      actions={
        <>
          <GuideLink href="/guides/company-admin" label="Account guide" />
          <Link className={buttonVariants({ variant: "outline" })} href="/employer/setup">
            Create workspace
          </Link>
        </>
      }
    >
      <Panel title="Account">
        <form autoComplete="on" className="grid max-w-xl gap-4" method="post" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input autoComplete="username" id="email" name="email" required type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>
          <Button className="w-fit" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
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
  if (typeof window === "undefined") return "";
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/") ? next : "";
}
