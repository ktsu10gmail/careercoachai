"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2Icon, KeyRoundIcon } from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  acceptEmployerInvitation,
  login,
  previewEmployerInvitation,
  type EmployerInvitationPreview,
} from "@/lib/api";
import {
  APPLICANT_TOKEN_KEY,
  clearToken,
  defaultEmployerPath,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

export default function EmployerInvitePage() {
  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") || "";
  });
  const [preview, setPreview] = useState<EmployerInvitationPreview | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const roleLabel = preview
    ? preview.access_model === "Collaborative"
      ? "Shared access"
      : preview.role.replace("_", " ")
    : "Workspace role";

  useEffect(() => {
    async function loadPreview() {
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        setPreview(await previewEmployerInvitation(token));
      } catch (error) {
        setMessage(detailMessage(error));
      } finally {
        setChecking(false);
      }
    }

    void loadPreview();
  }, [token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirm_password") || "");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("Creating account...");
    try {
      const user = await acceptEmployerInvitation({ token, name, password });
      const auth = await login(user.email, password);
      clearToken(APPLICANT_TOKEN_KEY);
      saveToken(EMPLOYER_TOKEN_KEY, auth.access_token);
      const currentUser = await getCurrentUser(auth.access_token);
      const roles = currentUser.roles?.length ? currentUser.roles : [currentUser.role];
      setMessage("Account created. Opening your workspace...");
      window.location.href = defaultEmployerPath(roles);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Team invitation"
      title={preview ? `Join ${preview.company_name}` : "Join your team workspace"}
      description={
        preview
          ? `${preview.invited_by_name || "A company admin"} invited ${preview.email} as ${roleLabel}.`
          : "Use your enrollment link to create your CareerCoachAI workspace account."
      }
      actions={
        <Link className={buttonVariants({ variant: "outline" })} href="/employer/login">
          Sign in instead
        </Link>
      }
      contentClassName="max-w-4xl"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
        <Panel title="Create account">
          {checking ? (
            <p className="text-sm text-muted-foreground">Checking invitation...</p>
          ) : token && preview && !preview.accepted ? (
            <form autoComplete="on" className="grid gap-4" method="post" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input autoComplete="name" id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" readOnly type="email" value={preview.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="confirm_password">Confirm password</Label>
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
                <KeyRoundIcon className="size-4" />
                {loading ? "Creating..." : "Create account"}
              </Button>
            </form>
          ) : preview?.accepted ? (
            <div className="flex items-start gap-3 rounded-md border bg-muted/35 p-4 text-sm">
              <CheckCircle2Icon className="mt-0.5 size-5 text-primary" />
              <p>This invitation has already been accepted. Sign in with the account password.</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This invitation link is missing or invalid. Ask your company admin to send a new invite.
            </p>
          )}
          <Message>{message}</Message>
        </Panel>

        <Panel title="What happens next">
          <div className="grid gap-4">
            <Badge className="w-fit rounded-full" variant="secondary">
              {roleLabel}
            </Badge>
            <p className="leading-7 text-muted-foreground">
              {preview?.access_model === "Collaborative"
                ? "After account setup, Workspace shows shared hiring tools for inviting teammates, managing jobs, reviewing candidates, scheduling interviews, and using the public job board."
                : "After account setup, Workspace shows the tools available for your role. Admins manage team access, HR opens jobs and reviews applicants, recruiters manage agency workflows, and hiring managers review assigned interviews."}
            </p>
            <div className="rounded-md border bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              Invitation expires:{" "}
              <span className="font-medium text-foreground">
                {preview ? new Date(preview.expires_at).toLocaleString() : "Shown after invite check"}
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
