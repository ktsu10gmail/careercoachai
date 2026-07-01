"use client";

import { Search, ShieldCheck, UsersRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppShell, Message, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch, type Candidate } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

type ProfileStatus = "OPTED_IN" | "REGISTERED" | "ARCHIVED";

const statusLabels: Record<ProfileStatus, string> = {
  OPTED_IN: "Visible",
  REGISTERED: "Hidden",
  ARCHIVED: "Archived",
};

export default function PlatformTalentNetworkPage() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>("OPTED_IN");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const visibleCount = useMemo(
    () => candidates.filter((candidate) => candidate.profile_status === "OPTED_IN").length,
    [candidates],
  );

  const loadCandidates = useCallback(
    async (savedToken = token) => {
      if (!savedToken) return;
      setLoading(true);
      try {
        const data = await apiFetch<Candidate[]>(
          `/platform/talent-candidates?q=${encodeURIComponent(query.trim())}&profile_status=${profileStatus}`,
          { token: savedToken },
        );
        setCandidates(data);
        setMessage(data.length ? "" : "No Talent Network profiles match this view.");
      } catch (error) {
        setMessage(detailMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [profileStatus, query, token],
  );

  useEffect(() => {
    async function checkPlatformAdmin() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }

      try {
        const user = await getCurrentUser(saved);
        if (!(user.roles?.length ? user.roles : [user.role]).includes("Platform_Admin")) {
          setMessage("Platform admin access is required.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        await loadCandidates(saved);
      } catch {
        clearToken(EMPLOYER_TOKEN_KEY);
        window.location.href = "/employer/login";
      }
    }
    void checkPlatformAdmin();
  }, [loadCandidates]);

  return (
    <AppShell
      eyebrow="Platform"
      title="Review Talent Network profiles."
      description="A platform-only review console for candidate opt-in records. This is not exposed to employers, agencies, or recruiter marketplace search."
    >
      <div className="grid gap-5">
        <Panel className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-background to-background dark:border-emerald-900 dark:from-emerald-950/25">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border bg-background/75 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-emerald-700 text-white">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Current view</p>
                  <p className="text-lg font-semibold">{statusLabels[profileStatus]}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-muted-foreground">Loaded</p>
                  <p className="mt-1 text-2xl font-semibold">{candidates.length}</p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-muted-foreground">Visible</p>
                  <p className="mt-1 text-2xl font-semibold">{visibleCount}</p>
                </div>
              </div>
            </div>

            <div className="grid content-center gap-3 sm:grid-cols-[1fr_180px_auto]">
              <div className="grid gap-2">
                <Label htmlFor="talent-query">Search</Label>
                <Input
                  id="talent-query"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Name, email, title, location"
                  value={query}
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={profileStatus}
                  onValueChange={(value) => setProfileStatus(value as ProfileStatus)}
                >
                  <SelectTrigger>
                    <SelectValue>{statusLabels[profileStatus]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPTED_IN">Visible</SelectItem>
                    <SelectItem value="REGISTERED">Hidden</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="self-end"
                disabled={loading}
                onClick={() => void loadCandidates()}
                type="button"
              >
                <Search className="size-4" />
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>
          </div>
        </Panel>

        <Panel title="Profiles" action={<Badge variant="secondary">{candidates.length} loaded</Badge>}>
          <div className="grid gap-3">
            {candidates.map((candidate) => (
              <div
                className="grid gap-3 rounded-lg border bg-muted/15 p-4 lg:grid-cols-[1fr_1fr_160px]"
                key={candidate.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{candidate.name}</h2>
                    <Badge>{statusLabels[candidate.profile_status as ProfileStatus]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{candidate.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {candidate.phone || "No phone"} · {candidate.location || "No location"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{candidate.searchable_title || "No target title"}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {candidate.searchable_skills.length ? (
                      candidate.searchable_skills.slice(0, 8).map((skill) => (
                        <span
                          className="rounded-md border bg-background px-2 py-1 text-xs"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No skills listed</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground lg:justify-end">
                  <UsersRound className="mt-0.5 size-4" />
                  Candidate #{candidate.id}
                </div>
              </div>
            ))}
            {!candidates.length ? (
              <p className="text-muted-foreground">No profiles loaded.</p>
            ) : null}
          </div>
        </Panel>

        <Message>{message}</Message>
      </div>
    </AppShell>
  );
}
