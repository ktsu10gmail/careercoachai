"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Button } from "@/components/ui/button";
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
import { apiFetch, type OrganizationType, type User, type UserRole } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

const roles: Array<{ label: string; value: UserRole }> = [
  { label: "Company Admin", value: "Company_Admin" },
  { label: "HR", value: "HR" },
  { label: "Recruiter", value: "Recruiter" },
  { label: "Hiring Manager", value: "Hiring_Manager" },
];

export default function EmployerAdminPage() {
  const [token] = useState(() => readToken(EMPLOYER_TOKEN_KEY));
  const [users, setUsers] = useState<User[]>([]);
  const [organizationType, setOrganizationType] =
    useState<OrganizationType>("Employer");
  const [canManageCompany, setCanManageCompany] = useState(false);
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "changeme123",
    role: "HR" as UserRole,
    roles: ["HR"] as UserRole[],
  });

  useEffect(() => {
    if (!token) {
      window.location.href = "/employer/login";
      return;
    }
    saveToken(EMPLOYER_TOKEN_KEY, token);
    getCurrentUser(token)
      .then((user) => {
        const assignedRoles = user.roles?.length ? user.roles : [user.role];
        if (!assignedRoles.includes("Company_Admin")) {
          setMessage(
            `Company Admin access is required for this page. You are signed in as ${user.email} with ${assignedRoles
              .map((role) => role.replace("_", " "))
              .join(", ")} access.`,
          );
          setCanManageCompany(false);
          return;
        }
        if (!user.company_id) {
          setMessage("This Company Admin account is not assigned to a company workspace.");
          setCanManageCompany(false);
          return;
        }
        setOrganizationType(user.organization_type || "Employer");
        setCanManageCompany(true);
      })
      .catch((error) => {
        setMessage(detailMessage(error));
        clearToken(EMPLOYER_TOKEN_KEY);
        window.location.href = "/employer/login";
      });
  }, [token]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await apiFetch<User[]>("/employer/users", { token });
      setUsers(data);
      setMessage("");
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [token]);

  useEffect(() => {
    if (token && canManageCompany) void Promise.resolve().then(loadUsers);
  }, [canManageCompany, loadUsers, token]);

  async function createUser() {
    try {
      const created = await apiFetch<User>("/employer/users", {
        method: "POST",
        token,
        body: JSON.stringify(newUser),
      });
      setMessage(JSON.stringify(created, null, 2));
      setNewUser({ name: "", email: "", password: "changeme123", role: "HR", roles: ["HR"] });
      await loadUsers();
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  async function updateUser(user: User, password: string) {
    try {
      const payload: {
        name: string;
        email: string;
        role: UserRole;
        roles: UserRole[];
        password?: string;
      } = {
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles?.length ? user.roles : [user.role],
      };
      if (password) payload.password = password;
      const updated = await apiFetch<User>(`/employer/users/${user.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
      });
      setMessage(JSON.stringify(updated, null, 2));
      await loadUsers();
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  return (
    <AppShell
      eyebrow="Company admin"
      title="Manage users in your company workspace."
      description="Create HR users and hiring managers, update emails, change roles, or reset passwords."
      actions={<GuideLink href="/guides/company-admin" />}
    >
      <div className="grid gap-5">
        {!canManageCompany ? (
          <Panel title="Company Admin access required">
            <p className="text-sm text-muted-foreground">
              Sign in with a company account that has the Company Admin role to manage company
              settings, users, and role access.
            </p>
          </Panel>
        ) : null}
        {canManageCompany ? (
          <>
        <Panel title="Add user">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="grid gap-2">
              <Label htmlFor="new-user-name">Name</Label>
              <Input
                autoComplete="name"
                id="new-user-name"
                onChange={(event) => setNewUser({ ...newUser, name: event.target.value })}
                value={newUser.name}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-user-email">Email</Label>
              <Input
                autoComplete="email"
                id="new-user-email"
                onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
                type="email"
                value={newUser.email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-user-password">Password</Label>
              <Input
                autoComplete="new-password"
                id="new-user-password"
                minLength={8}
                onChange={(event) => setNewUser({ ...newUser, password: event.target.value })}
                type="password"
                value={newUser.password}
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({
                    ...newUser,
                    role: (value || "HR") as UserRole,
                    roles: ensureRole(newUser.roles, (value || "HR") as UserRole),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {roles.find((role) => role.value === newUser.role)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                {visibleRoles(organizationType).map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
              <RoleCheckboxes
                onChange={(roles) => setNewUser({ ...newUser, roles })}
                organizationType={organizationType}
                primaryRole={newUser.role}
                roles={newUser.roles}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={createUser} type="button">
                Add user
              </Button>
            </div>
          </div>
        </Panel>

        <Panel title="Team">
          <div className="grid gap-4">
            {users.map((user) => (
              <UserRow
                key={user.id}
                onChange={(updated) =>
                  setUsers(users.map((item) => (item.id === updated.id ? updated : item)))
                }
                onSave={updateUser}
                organizationType={organizationType}
                user={user}
              />
            ))}
            {!users.length ? (
              <p className="text-muted-foreground">No users loaded yet.</p>
            ) : null}
          </div>
        </Panel>
          </>
        ) : null}
        <Message>{message}</Message>
      </div>
    </AppShell>
  );
}

function visibleRoles(organizationType: OrganizationType) {
  return roles.filter(
    (role) =>
      role.value !== "Recruiter" || organizationType === "Recruiting_Agency",
  );
}

function ensureRole(assignedRoles: UserRole[], role: UserRole) {
  return assignedRoles.includes(role) ? assignedRoles : [...assignedRoles, role];
}

function RoleCheckboxes({
  roles: selectedRoles,
  primaryRole,
  organizationType,
  onChange,
}: {
  roles: UserRole[];
  primaryRole: UserRole;
  organizationType: OrganizationType;
  onChange: (roles: UserRole[]) => void;
}) {
  const normalizedRoles = ensureRole(selectedRoles.length ? selectedRoles : [primaryRole], primaryRole);

  return (
    <div className="grid gap-2 rounded-md border bg-background/70 p-3">
      <p className="text-xs font-medium text-muted-foreground">Workspace access</p>
      {visibleRoles(organizationType).map((role) => (
        <label className="flex items-center gap-2 text-sm" key={role.value}>
          <Checkbox
            checked={normalizedRoles.includes(role.value)}
            disabled={role.value === primaryRole}
            onCheckedChange={(checked) => {
              const nextRoles = checked
                ? ensureRole(normalizedRoles, role.value)
                : normalizedRoles.filter((value) => value !== role.value);
              onChange(ensureRole(nextRoles, primaryRole));
            }}
          />
          {role.label}
        </label>
      ))}
    </div>
  );
}

function UserRow({
  user,
  onChange,
  onSave,
  organizationType,
}: {
  user: User;
  onChange: (user: User) => void;
  onSave: (user: User, password: string) => void;
  organizationType: OrganizationType;
}) {
  const [password, setPassword] = useState("");

  return (
    <div className="grid gap-3 rounded-lg border bg-muted/20 p-4 md:grid-cols-[80px_1fr_1fr_1.2fr_160px]">
      <div className="text-sm font-semibold text-muted-foreground">#{user.id}</div>
      <div className="grid gap-2">
        <Label htmlFor={`user-${user.id}-name`}>Name</Label>
        <Input
          autoComplete="name"
          id={`user-${user.id}-name`}
          onChange={(event) => onChange({ ...user, name: event.target.value })}
          value={user.name}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`user-${user.id}-email`}>Email</Label>
        <Input
          autoComplete="email"
          id={`user-${user.id}-email`}
          onChange={(event) => onChange({ ...user, email: event.target.value })}
          type="email"
          value={user.email}
        />
      </div>
      <div className="grid gap-2">
        <Label>Role</Label>
        <Select
          value={user.role}
          onValueChange={(value) => {
            const role = (value || "HR") as UserRole;
            onChange({ ...user, role, roles: ensureRole(user.roles || [], role) });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue>{roles.find((role) => role.value === user.role)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
          {visibleRoles(organizationType).map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
        <RoleCheckboxes
          onChange={(assignedRoles) => onChange({ ...user, roles: assignedRoles })}
          organizationType={organizationType}
          primaryRole={user.role}
          roles={user.roles?.length ? user.roles : [user.role]}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`user-${user.id}-password`}>New password</Label>
        <Input
          autoComplete="new-password"
          id={`user-${user.id}-password`}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Leave blank"
          type="password"
          value={password}
        />
      </div>
      <div className="md:col-start-5">
        <Button className="w-full" onClick={() => onSave(user, password)} type="button">
          Save
        </Button>
      </div>
    </div>
  );
}
