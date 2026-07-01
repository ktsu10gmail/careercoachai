"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AppShell, Message, Panel } from "@/components/AppShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/api";
import { detailMessage } from "@/lib/format";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("Sending reset link...");

    try {
      const result = await requestPasswordReset(String(form.get("email") || "").trim());
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
      title="Reset your password."
      description="Enter your account email and we will send a secure reset link if the account exists."
      actions={
        <Link className={buttonVariants({ variant: "outline" })} href="/employer/login">
          Back to login
        </Link>
      }
      contentClassName="max-w-3xl"
    >
      <Panel title="Account email">
        <form autoComplete="on" className="grid max-w-xl gap-4" method="post" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input autoComplete="email" id="email" name="email" required type="email" />
          </div>
          <Button className="w-fit" disabled={loading} type="submit">
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
        <Message>{message}</Message>
      </Panel>
    </AppShell>
  );
}
