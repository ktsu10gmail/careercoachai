"use client";

import Link from "next/link";
import { Building2Icon, CheckCircle2Icon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { detailMessage } from "@/lib/format";

const companySizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

export default function EmployerSetupPage() {
  const [companySize, setCompanySize] = useState("not_set");
  const [organizationType, setOrganizationType] = useState<"Employer" | "Recruiting_Agency">("Employer");
  const [accessModel, setAccessModel] = useState<"Collaborative" | "Role_Based">("Collaborative");
  const [setupSource, setSetupSource] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void Promise.resolve().then(() => {
      const requestedType = new URLSearchParams(window.location.search).get("type");
      if (requestedType === "agency") {
        setOrganizationType("Recruiting_Agency");
        setAccessModel("Collaborative");
      }
      if (requestedType === "employer") {
        setOrganizationType("Employer");
        setAccessModel("Collaborative");
      }
      setSetupSource(new URLSearchParams(window.location.search).get("source") || "");
    });
  }, []);

  const isHiringManagerSetup = setupSource === "hm" && organizationType === "Employer";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("Creating company workspace...");

    const payload = {
      company: {
        name: String(form.get("company_name") || "").trim(),
        industry: String(form.get("industry") || "").trim() || null,
        website: String(form.get("website") || "").trim() || null,
        size: companySize === "not_set" ? null : companySize,
        organization_type: organizationType,
        access_model: accessModel,
      },
      admin: {
        name: String(form.get("admin_name") || "").trim(),
        email: String(form.get("admin_email") || "").trim(),
        password: String(form.get("admin_password") || ""),
      },
      hr_members: [],
      recruiters: [],
      hiring_managers: [],
    };

    try {
      const data = await apiFetch("/employer/setup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Organization setup"
      title={
        isHiringManagerSetup
          ? "Set up your company hiring workspace."
          : "Create an employer or agency workspace."
      }
      description={
        isHiringManagerSetup
          ? "Create this workspace on behalf of your company so you can send job links, collect applicant answer scores, and add teammates later."
          : "Choose Direct employer for in-house hiring, or Recruiting agency for client-company and recruiter workflows."
      }
      actions={
        <>
          <GuideLink href="/guides/company-admin" label="Setup guide" />
          <Link className={buttonVariants({ variant: "outline" })} href="/employer/login">
            Log in
          </Link>
        </>
      }
    >
      {isHiringManagerSetup ? (
        <Panel className="border-emerald-200 bg-emerald-50" title="Hiring manager starter setup">
          <div className="grid gap-4 md:grid-cols-[auto_1fr]">
            <span className="grid size-11 place-items-center rounded-md border border-emerald-200 bg-white text-emerald-800">
              <Building2Icon className="size-5" />
            </span>
            <div className="grid gap-3 text-sm leading-6 text-emerald-950">
              <p>
                You are setting up the account on behalf of your company. Since you
                are starting this workspace as the hiring manager, your first account
                will automatically receive Company Admin, HR, and Hiring Manager access.
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  "Create jobs and applicant links",
                  "Review answer scores",
                  "Add HR or other hiring managers later",
                ].map((item) => (
                  <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-white/80 p-3" key={item}>
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      ) : null}
      <form autoComplete="on" className="grid gap-5" method="post" onSubmit={onSubmit}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Company">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company_name">Company name</Label>
                <Input id="company_name" name="company_name" required />
              </div>
              <div className="grid gap-2">
                <Label>Workspace type</Label>
                <Select
                  value={organizationType}
                  onValueChange={(value) =>
                    setOrganizationType((value || "Employer") as "Employer" | "Recruiting_Agency")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {organizationType === "Recruiting_Agency"
                        ? "Recruiting agency"
                        : "Direct employer"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employer">Direct employer</SelectItem>
                    <SelectItem value="Recruiting_Agency">Recruiting agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Organization structure</Label>
                <div className="grid gap-3">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition ${
                      accessModel === "Collaborative"
                        ? "border-primary bg-primary/5"
                        : "bg-background hover:border-primary/40"
                    }`}
                  >
                    <Checkbox
                      checked={accessModel === "Collaborative"}
                      className="mt-1"
                      onCheckedChange={() => setAccessModel("Collaborative")}
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        Collaborative workspace
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        Default for new accounts. Best for small teams and small recruiting
                        firms where invited teammates share hiring, scheduling, review,
                        invitation, and job management access.
                      </span>
                    </span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition ${
                      accessModel === "Role_Based"
                        ? "border-primary bg-primary/5"
                        : "bg-background hover:border-primary/40"
                    }`}
                  >
                    <Checkbox
                      checked={accessModel === "Role_Based"}
                      className="mt-1"
                      onCheckedChange={() => setAccessModel("Role_Based")}
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        Role-based secure workspace
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        Choose this for security-conscious organizations that need Admin, HR,
                        Recruiter, and Hiring Manager permissions separated.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" />
              </div>
              <div className="grid gap-2">
                <Label>Size</Label>
                <Select
                  value={companySize}
                  onValueChange={(value) => setCompanySize(value || "not_set")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {companySize === "not_set" ? "Not set" : companySize}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_set">Not set</SelectItem>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Panel>

          <Panel title="Company seed user">
            <div className="grid gap-4">
              <p className="text-sm leading-6 text-muted-foreground">
                The seed user has full permissions and can invite company team members.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="admin_name">Name</Label>
                <Input autoComplete="name" id="admin_name" name="admin_name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin_email">Email</Label>
                <Input
                  autoComplete="email"
                  id="admin_email"
                  name="admin_email"
                  required
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin_password">Password</Label>
                <Input
                  id="admin_password"
                  minLength={8}
                  name="admin_password"
                  required
                  type="password"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Next step: invite teammates">
          <div className="grid gap-3 text-sm leading-6 text-muted-foreground">
            <p>
              Setup creates the company seed user with full workspace access. After
              signing in, the seed user can invite as many teammates as needed from the
              workspace invitation page.
            </p>
            <p>
              {accessModel === "Collaborative"
                ? "Collaborative teammates join with shared hiring access."
                : "Role-based teammates can be assigned Admin, HR, Recruiter, and Hiring Manager access in any combination."}
            </p>
          </div>
        </Panel>

        <Button className="w-fit" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create workspace"}
        </Button>
      </form>
      <Message>{message}</Message>
    </AppShell>
  );
}
