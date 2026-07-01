"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AppShell, Message, Panel } from "@/components/AppShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmPasswordReset } from "@/lib/api";
import { detailMessage } from "@/lib/format";

export default function ResetPasswordPage() {
  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") || "";
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirm_password") || "");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("Resetting password...");

    try {
      const result = await confirmPasswordReset(token, password);
      setMessage(result.message);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Password recovery"
      title="Choose a new password."
      description="Use the reset link from your email to set a new account password."
      actions={
        <Link className={buttonVariants({ variant: "outline" })} href="/employer/login">
          Back to login
        </Link>
      }
      contentClassName="max-w-3xl"
    >
      <Panel title="New password">
        {token ? (
          <form autoComplete="on" className="grid max-w-xl gap-4" method="post" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                autoComplete="new-password"
                id="password"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm new password</Label>
              <Input
                autoComplete="new-password"
                id="confirm_password"
                minLength={8}
                name="confirm_password"
                required
                type="password"
              />
            </div>
            <Button className="w-fit" disabled={loading} type="submit">
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            This reset link is missing a token. Request a new password reset link.
          </p>
        )}
        <Message>{message}</Message>
      </Panel>
    </AppShell>
  );
}
