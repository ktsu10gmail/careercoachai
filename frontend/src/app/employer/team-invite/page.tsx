"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  MailPlusIcon,
  SendIcon,
} from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createEmployerInvitation,
  listEmployerInvitations,
  listEmployerUsers,
  type EmployerInvitation,
  type User,
  type UserRole,
} from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

type InviteRole = {
  label: string;
  value: UserRole;
  description: string;
  agencyOnly?: boolean;
};

const inviteRoles: InviteRole[] = [
  {
    label: "Company Admin",
    value: "Company_Admin",
    description: "Can invite users, manage roles, and update workspace settings.",
  },
  {
    label: "HR",
    value: "HR",
    description: "Can create jobs, review applicants, and operate the hiring dashboard.",
  },
  {
    label: "Hiring Manager",
    value: "Hiring_Manager",
    description: "Can review assigned interviews and submit hiring decisions.",
  },
  {
    label: "Recruiter",
    value: "Recruiter",
    description: "Can manage agency candidates, matching, submissions, and job links.",
    agencyOnly: true,
  },
];

export default function EmployerTeamInvitePage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(["HR"]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [invitations, setInvitations] = useState<EmployerInvitation[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  useEffect(() => {
    async function init() {
      const savedToken = readToken(EMPLOYER_TOKEN_KEY);
      if (!savedToken) {
        window.location.href = "/employer/login";
        return;
      }

      try {
        const currentUser = await getCurrentUser(savedToken);
        const roles = currentUser.roles?.length ? currentUser.roles : [currentUser.role];
        if (roles.includes("Applicant")) {
          clearToken(EMPLOYER_TOKEN_KEY);
          window.location.href = "/employer/login";
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, savedToken);
        setToken(savedToken);
        setUser(currentUser);
        if (roles.includes("Company_Admin")) {
          const [pending, members] = await Promise.all([
            listEmployerInvitations(savedToken),
            listEmployerUsers(savedToken),
          ]);
          setInvitations(pending.slice(0, 5));
          setTeamMembers(members);
        }
      } catch (error) {
        clearToken(EMPLOYER_TOKEN_KEY);
        setMessage(detailMessage(error));
        window.location.href = "/employer/login";
      }
    }

    void init();
  }, []);

  const userRoles = useMemo(() => {
    if (!user) return [];
    return user.roles?.length ? user.roles : [user.role];
  }, [user]);
  const boardHref = user?.company_slug ? `/${user.company_slug}` : "";
  const canInvite = userRoles.includes("Company_Admin");
  const isCollaborative = user?.access_model === "Collaborative";
  const visibleInviteRoles = inviteRoles.filter(
    (option) => !option.agencyOnly || user?.organization_type === "Recruiting_Agency",
  );
  const selectedRoleSummary = isCollaborative
    ? {
        label: "Shared access",
        description:
          "Collaborative workspace teammates can invite others, manage jobs, review candidates, schedule interviews, and use shared hiring tools.",
      }
    : {
        label:
          selectedRoles
            .map((selectedRole) => inviteRoles.find((option) => option.value === selectedRole)?.label)
            .filter(Boolean)
            .join(", ") || "Select at least one role",
        description:
          "The teammate will receive the combined permissions for every selected role.",
      };

  const guideHref =
    userRoles.includes("Platform_Admin")
      ? "/platform/performance"
      : userRoles.includes("Company_Admin")
      ? "/guides/company-admin"
      : userRoles.includes("Hiring_Manager")
        ? "/guides/hiring-manager"
        : "/guides/hr";

  async function onInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !canInvite) return;
    const rolesToSend = isCollaborative ? (["HR"] as UserRole[]) : selectedRoles;
    if (!rolesToSend.length) {
      setMessage("Select at least one role.");
      return;
    }
    setSending(true);
    setMessage("Sending invitation...");
    try {
      const invitation = await createEmployerInvitation(token, {
        email: email.trim(),
        role: rolesToSend[0],
        roles: rolesToSend,
      });
      setTeamMembers(await listEmployerUsers(token));
      setInvitations((current) => [invitation, ...current].slice(0, 5));
      setEmail("");
      setMessage(`Invitation sent to ${invitation.email}.`);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setSending(false);
    }
  }

  function toggleSelectedRole(roleToToggle: UserRole) {
    setSelectedRoles((current) => {
      if (current.includes(roleToToggle)) {
        return current.filter((selectedRole) => selectedRole !== roleToToggle);
      }
      return [...current, roleToToggle];
    });
  }

  return (
    <AppShell
      eyebrow={user?.organization_type === "Recruiting_Agency" ? "Agency workspace" : "Employer workspace"}
      title={user?.company_name ? `${user.company_name} team invitation` : "Team invitation"}
      description={
        user
          ? isCollaborative
            ? `Signed in as ${user.name}. Invite coworkers into shared hiring access.`
            : `Signed in as ${user.name}. Invite coworkers and assign the right role.`
          : "Checking employer login..."
      }
      actions={
        <>
          <Link className={buttonVariants({ variant: "secondary" })} href="/employer/workspace">
            Back to workspace
          </Link>
          <GuideLink href={guideHref} />
          {boardHref ? (
            <Link className={buttonVariants({ variant: "outline" })} href={boardHref}>
              View public job board
            </Link>
          ) : null}
        </>
      }
    >
      <div className="grid gap-5">
        <Panel className="overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-md border bg-primary text-primary-foreground">
                <MailPlusIcon className="size-6" />
              </span>
              <div>
                <Badge className="mb-3 rounded-full" variant="secondary">
                  Coworker referral
                </Badge>
                <h2 className="text-2xl font-semibold tracking-tight">Invite a teammate</h2>
                <p className="mt-2 max-w-4xl leading-7 text-muted-foreground">
                  {isCollaborative
                    ? "Send an enrollment link with shared hiring access and a short tour of where to start after account setup."
                    : "Send an enrollment link with the coworker's role, who invited them, and a short tour of where to start after account setup."}
                </p>
              </div>
            </div>

            {canInvite ? (
              <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)_auto]" onSubmit={onInvite}>
                <div className="grid gap-2">
                  <Label htmlFor="invite-email">Coworker email</Label>
                  <Input
                    autoComplete="email"
                    id="invite-email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="teammate@company.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
                {isCollaborative ? (
                  <div className="grid gap-2">
                    <Label>Access</Label>
                    <div className="flex h-9 items-center rounded-md border bg-muted/35 px-3 text-sm font-medium">
                      Shared access
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label>Roles</Label>
                    <div className="grid gap-2 rounded-md border bg-muted/20 p-3">
                      {visibleInviteRoles.map((option) => (
                        <label
                          className="flex cursor-pointer items-start gap-3 rounded-md bg-background px-3 py-2 text-sm"
                          key={option.value}
                        >
                          <Checkbox
                            checked={selectedRoles.includes(option.value)}
                            className="mt-0.5"
                            onCheckedChange={() => toggleSelectedRole(option.value)}
                          />
                          <span>
                            <span className="block font-medium">{option.label}</span>
                            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <Button className="self-end" disabled={sending} type="submit">
                  <SendIcon className="size-4" />
                  {sending ? "Sending" : "Send invite"}
                </Button>
              </form>
            ) : (
              <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
                Company Admin access is required to invite coworkers or change roles.
              </div>
            )}

            <div className="rounded-md border bg-muted/35 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Email preview
              </p>
              <div className="mt-4 grid gap-4 text-sm leading-6 md:grid-cols-3">
                <p>
                  <span className="font-medium">{user?.name || "Your admin"}</span> invited
                  them to join <span className="font-medium">{user?.company_name || "your company"}</span>.
                </p>
                <p>
                  Assigned roles: <span className="font-medium">{selectedRoleSummary.label}</span>
                </p>
                <p className="text-muted-foreground">{selectedRoleSummary.description}</p>
                <ol className="grid gap-2 text-muted-foreground">
                  <li>1. Create account from the enrollment link.</li>
                  <li>
                    2.{" "}
                    {isCollaborative
                      ? "Open Workspace for shared hiring tools."
                      : "Open Workspace for role-specific tools."}
                  </li>
                  <li>
                    3.{" "}
                    {isCollaborative
                      ? "Use the public job board button or shared workflow dashboard."
                      : "Use the public job board button or assigned dashboards."}
                  </li>
                </ol>
              </div>
            </div>

              {invitations.length ? (
                <div className="rounded-md border bg-muted/35 p-4">
                  <p className="mb-3 text-sm font-medium">Recent invitations</p>
                  <div className="grid gap-2">
                    {invitations.map((invitation) => (
                      <div
                        className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm"
                        key={invitation.id}
                      >
                        <span className="min-w-0 truncate">{invitation.email}</span>
                        <Badge variant={invitation.accepted_at ? "default" : "outline"}>
                          {invitation.accepted_at
                            ? "Accepted"
                            : isCollaborative
                              ? "Shared access"
                              : (invitation.roles?.length ? invitation.roles : [invitation.role])
                                  .map((invitationRole) => invitationRole.replace("_", " "))
                                  .join(", ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
          </div>
        </Panel>
        <Panel title="Team members">
          <div className="grid gap-3">
            {teamMembers.length ? (
              teamMembers.map((member) => {
                const memberRoles = member.roles?.length ? member.roles : [member.role];
                return (
                  <div
                    className="grid gap-3 rounded-md border bg-muted/20 p-4 md:grid-cols-[1fr_auto]"
                    key={member.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{member.name}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      {isCollaborative ? (
                        <Badge className="rounded-full" variant="secondary">
                          Shared access
                        </Badge>
                      ) : (
                        memberRoles
                          .filter((role) => role !== "Applicant" && role !== "Platform_Admin")
                          .map((role) => (
                            <Badge className="rounded-full" key={role} variant="outline">
                              {role.replace("_", " ")}
                            </Badge>
                          ))
                      )}
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(member.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                No team members loaded yet.
              </div>
            )}
          </div>
        </Panel>
      </div>

      <Message>{message}</Message>
    </AppShell>
  );
}
