"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Building2Icon, RefreshCcwIcon } from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, type ClientCompany, type Job } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

export default function AgencyClientsPage() {
  const [token, setToken] = useState("");
  const [clients, setClients] = useState<ClientCompany[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("Checking agency login...");

  const loadClients = useCallback(async () => {
    try {
      const data = await apiFetch<ClientCompany[]>("/client-companies", { token });
      setClients(data);
      setMessage(data.length ? "" : "No client companies yet.");
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [token]);

  const loadJobs = useCallback(async () => {
    try {
      const data = await apiFetch<Job[]>("/hr/jobs", { token });
      setJobs(data);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [token]);

  useEffect(() => {
    async function init() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }
      try {
        const me = await getCurrentUser(saved);
        if (me.organization_type !== "Recruiting_Agency") {
          setAuthMessage("This page is only available to recruiting agencies.");
          return;
        }
        const roles = me.roles?.length ? me.roles : [me.role];
        if (!roles.some((role) => ["Company_Admin", "HR", "Recruiter"].includes(role))) {
          setAuthMessage("This page requires an agency admin, HR, or recruiter login.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        setAuthMessage(`Signed in as ${me.name} (${me.role.replace("_", " ")}).`);
      } catch (error) {
        clearToken(EMPLOYER_TOKEN_KEY);
        setMessage(detailMessage(error));
        window.location.href = "/employer/login";
      }
    }
    void init();
  }, []);

  useEffect(() => {
    if (token) void Promise.resolve().then(() => Promise.all([loadClients(), loadJobs()]));
  }, [loadClients, loadJobs, token]);

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const created = await apiFetch<ClientCompany>("/client-companies", {
        method: "POST",
        token,
        body: JSON.stringify({
          company_name: String(form.get("company_name") || ""),
          industry: String(form.get("industry") || "") || null,
          website: String(form.get("website") || "") || null,
          contact_name: String(form.get("contact_name") || "") || null,
          contact_email: String(form.get("contact_email") || "") || null,
          contact_phone: String(form.get("contact_phone") || "") || null,
          notes: String(form.get("notes") || "") || null,
        }),
      });
      setMessage(`Client company "${created.company_name}" was created.`);
      formElement.reset();
      await loadClients();
      await loadJobs();
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  const jobsByClient = jobs.reduce<Record<number, Job[]>>((grouped, job) => {
    if (job.client_company_id) {
      grouped[job.client_company_id] = grouped[job.client_company_id] || [];
      grouped[job.client_company_id].push(job);
    }
    return grouped;
  }, {});

  return (
    <AppShell
      eyebrow="Agency clients"
      title="Manage client companies."
      description={authMessage}
      actions={<GuideLink href="/guides/hr" label="Client guide" />}
      contentClassName="max-w-[1500px]"
    >
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel
          title="Add client"
          description="Create the client company record before opening jobs on their behalf."
        >
          <form className="grid gap-4" onSubmit={createClient}>
            <div className="grid gap-2">
              <Label htmlFor="company_name">Company name</Label>
              <Input id="company_name" name="company_name" required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact_name">Contact name</Label>
                <Input id="contact_name" name="contact_name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact_email">Contact email</Label>
                <Input id="contact_email" name="contact_email" type="email" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact_phone">Contact phone</Label>
              <Input id="contact_phone" name="contact_phone" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" />
            </div>
            <Button className="w-fit" type="submit">
              <Building2Icon className="size-4" />
              Add client
            </Button>
          </form>
        </Panel>

        <Panel
          title="Client roster"
          description="Jobs created by agency users are grouped under each client."
          action={
            <Button
              onClick={() => void Promise.all([loadClients(), loadJobs()])}
              type="button"
              variant="outline"
            >
              <RefreshCcwIcon className="size-4" />
              Refresh
            </Button>
          }
        >
          {clients.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Open jobs</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => {
                  const clientJobs = jobsByClient[client.id] || [];
                  return (
                    <TableRow key={client.id}>
                      <TableCell className="whitespace-normal">
                        <span className="font-medium">{client.company_name}</span>
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {[client.industry, client.website].filter(Boolean).join(" - ") ||
                            "No industry or website set"}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        {client.contact_name || client.contact_email ? (
                          <>
                            <span>{client.contact_name || "Contact"}</span>
                            <br />
                            <span className="text-sm text-muted-foreground">
                              {[client.contact_email, client.contact_phone].filter(Boolean).join(" - ")}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        {clientJobs.length ? (
                          <div className="grid gap-2">
                            <Badge className="w-fit" variant="secondary">
                              {clientJobs.length} open jobs
                            </Badge>
                            <div className="grid gap-1">
                              {clientJobs.map((job) => (
                                <div className="rounded-md border bg-muted/20 px-3 py-2" key={job.id}>
                                  <p className="font-medium">{job.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {job.position} · {job.job_url}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No jobs yet</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === "active" ? "secondary" : "outline"}>
                          {client.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No client companies yet.</p>
          )}
        </Panel>
      </div>
      <Message>{message}</Message>
    </AppShell>
  );
}
