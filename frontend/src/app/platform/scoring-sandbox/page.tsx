"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  BeakerIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  CheckSquareIcon,
  ClipboardPasteIcon,
  ClockIcon,
  FolderKanbanIcon,
  ListChecksIcon,
  LoaderCircleIcon,
  PlayIcon,
  RefreshCcwIcon,
  SaveIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react";

import { AppShell, Message, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  apiFetch,
  type ScoringSandboxIgnoreResult,
  type ScoringSandboxLessonType,
  type ScoringSandboxPromoteResult,
  type ScoringSandboxPromotionCandidate,
  type ScoringSandboxPromotionReport,
  type ScoringSandboxRealJdResult,
  type ScoringSandboxRunResult,
  type ScoringSandboxRunStage,
  type ScoringSandboxStatus,
} from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

const stages: Array<{
  stage: ScoringSandboxRunStage;
  title: string;
  body: string;
  icon: typeof SparklesIcon;
}> = [
  {
    stage: "generate",
    title: "Generate",
    body: "Use local Ollama to create JDs and strong, weak, and contra-evidence resumes.",
    icon: SparklesIcon,
  },
  {
    stage: "score",
    title: "Score",
    body: "Run CareerCoachAI's deterministic resume/JD scorer against staged inputs.",
    icon: BeakerIcon,
  },
  {
    stage: "judge",
    title: "Judge",
    body: "Ask local Ollama to audit analysis JSON for known scoring failure modes.",
    icon: BrainCircuitIcon,
  },
  {
    stage: "all",
    title: "Run all",
    body: "Execute generation, scoring, and judge review in one controlled sandbox pass.",
    icon: PlayIcon,
  },
];

type StageStatus = "idle" | "running" | "completed" | "failed";

type StageRunState = {
  status: StageStatus;
  detail: string;
  updatedAt: string | null;
};

const lessonOptions: Array<{
  value: ScoringSandboxLessonType;
  label: string;
  description: string;
}> = [
  {
    value: "regression_bug",
    label: "Bug / regression",
    description: "Hard guardrail. The scorer should fail if this mistake returns.",
  },
  {
    value: "adjacent_partial",
    label: "Adjacent / partial",
    description: "Useful calibration example. Related evidence, but not a full match.",
  },
  {
    value: "correct_match",
    label: "Correct match",
    description: "Positive calibration example. The scorer handled this correctly.",
  },
];

const initialStageRuns: Record<ScoringSandboxRunStage, StageRunState> = {
  generate: {
    status: "idle",
    detail: "Not run in this browser session.",
    updatedAt: null,
  },
  score: {
    status: "idle",
    detail: "Not run in this browser session.",
    updatedAt: null,
  },
  judge: {
    status: "idle",
    detail: "Not run in this browser session.",
    updatedAt: null,
  },
  all: {
    status: "idle",
    detail: "Not run in this browser session.",
    updatedAt: null,
  },
};

const guideItems = [
  {
    title: "Sandbox base",
    body: "Shows where test artifacts are stored and gives quick totals for saved titles, generated cases, scoring JSON, and judge reports.",
  },
  {
    title: "Knowledgebase coverage",
    body: "Counts the guardrail lessons that are already active regression tests, plus planned lessons that still need implementation.",
  },
  {
    title: "Job title input",
    body: "Your seed list. Each title becomes a synthetic job description plus strong, weak, and contra-evidence resumes.",
  },
  {
    title: "Execute stages",
    body: "Generate creates test data, Score runs the matching engine, Judge reviews the outputs, and Run all executes the full loop.",
  },
  {
    title: "Sandbox activity",
    body: "Shows useful stage health: how many artifacts exist, whether each stage has output, and when that stage last changed.",
  },
];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function stageRunsFromStatus(
  data: ScoringSandboxStatus,
  current: Record<ScoringSandboxRunStage, StageRunState>,
) {
  return {
    ...current,
    generate:
      current.generate.status === "running"
        ? current.generate
        : data.input_files
          ? {
              status: "completed" as StageStatus,
              detail: `${data.input_cases} generated case${data.input_cases === 1 ? "" : "s"} detected in the sandbox.`,
              updatedAt: data.recent_inputs?.[0]?.updated_at ?? current.generate.updatedAt,
            }
          : current.generate,
    score:
      current.score.status === "running"
        ? current.score
        : data.analysis_outputs
          ? {
              status: "completed" as StageStatus,
              detail: `${data.analysis_outputs} scoring output${data.analysis_outputs === 1 ? "" : "s"} detected in the sandbox.`,
              updatedAt: data.recent_outputs?.[0]?.updated_at ?? current.score.updatedAt,
            }
          : current.score,
    judge:
      current.judge.status === "running"
        ? current.judge
        : data.evaluation_reports
          ? {
              status: "completed" as StageStatus,
              detail: `${data.evaluation_reports} judge report${data.evaluation_reports === 1 ? "" : "s"} detected in the sandbox.`,
              updatedAt: data.recent_evaluations?.[0]?.updated_at ?? current.judge.updatedAt,
            }
          : current.judge,
  };
}

export default function PlatformScoringSandboxPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<ScoringSandboxStatus | null>(null);
  const [promotionReport, setPromotionReport] = useState<ScoringSandboxPromotionReport | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());
  const [lessonTypes, setLessonTypes] = useState<Record<string, ScoringSandboxLessonType>>({});
  const [titlesText, setTitlesText] = useState("");
  const [realJdTitle, setRealJdTitle] = useState("");
  const [realJdText, setRealJdText] = useState("");
  const [message, setMessage] = useState("Checking Platform Admin access...");
  const [busyStage, setBusyStage] = useState<ScoringSandboxRunStage | "save" | "refresh" | "realJd" | "">("");
  const [stageRuns, setStageRuns] = useState<Record<ScoringSandboxRunStage, StageRunState>>(initialStageRuns);
  const [promotionBusy, setPromotionBusy] = useState(false);
  const [ignoreBusy, setIgnoreBusy] = useState(false);

  const titleCount = useMemo(
    () => titlesText.split(/\n+/).map((item) => item.trim()).filter(Boolean).length,
    [titlesText],
  );

  const loadStatus = useCallback(async (savedToken: string) => {
    if (!savedToken) return;
    setBusyStage((current) => current || "refresh");
    try {
      const data = await apiFetch<ScoringSandboxStatus>("/platform/scoring-sandbox/status", {
        token: savedToken,
      });
      setStatus(data);
      setTitlesText(data.job_titles.join("\n"));
      setRealJdTitle((current) => current || data.job_titles[0] || "");
      setStageRuns((current) => stageRunsFromStatus(data, current));
      setMessage(`Loaded ${data.job_titles.length} saved job title${data.job_titles.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusyStage((current) => (current === "refresh" ? "" : current));
    }
  }, []);

  const loadPromotionReport = useCallback(async (savedToken: string) => {
    if (!savedToken) return;
    try {
      const data = await apiFetch<ScoringSandboxPromotionReport>("/platform/scoring-sandbox/pre-promote", {
        token: savedToken,
      });
      setPromotionReport(data);
      setSelectedCandidateIds((current) => {
        const validIds = new Set(data.candidates.map((candidate) => candidate.id));
        return new Set([...current].filter((id) => validIds.has(id)));
      });
      setLessonTypes((current) => {
        const validIds = new Set(data.candidates.map((candidate) => candidate.id));
        const next: Record<string, ScoringSandboxLessonType> = {};
        data.candidates.forEach((candidate) => {
          next[candidate.id] = validIds.has(candidate.id)
            ? current[candidate.id] ?? "regression_bug"
            : "regression_bug";
        });
        return next;
      });
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, []);

  const refreshPageData = useCallback(async (savedToken: string) => {
    await loadStatus(savedToken);
    await loadPromotionReport(savedToken);
  }, [loadPromotionReport, loadStatus]);

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
          setMessage("Platform Admin access is required.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        await refreshPageData(saved);
      } catch {
        clearToken(EMPLOYER_TOKEN_KEY);
        window.location.href = "/employer/login";
      }
    }
    void checkPlatformAdmin();
  }, [refreshPageData]);

  async function saveTitles() {
    if (!token) return;
    setBusyStage("save");
    try {
      const titles = titlesText.split(/\n+/).map((item) => item.trim()).filter(Boolean);
      const data = await apiFetch<ScoringSandboxStatus>("/platform/scoring-sandbox/job-titles", {
        method: "PUT",
        token,
        body: JSON.stringify({ titles }),
      });
      setStatus(data);
      setTitlesText(data.job_titles.join("\n"));
      setMessage(`Saved ${data.job_titles.length} job title${data.job_titles.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusyStage("");
    }
  }

  async function runStage(stage: ScoringSandboxRunStage) {
    if (!token) return;
    setBusyStage(stage);
    setStageRuns((current) => ({
      ...current,
      [stage]: {
        status: "running",
        detail: "Running now. Large title lists can take several minutes.",
        updatedAt: new Date().toISOString(),
      },
    }));
    setMessage(`Running sandbox stage: ${stage}. This can take a while when Ollama is generating text.`);
    try {
      const result = await apiFetch<ScoringSandboxRunResult>("/platform/scoring-sandbox/run", {
        method: "POST",
        token,
        body: JSON.stringify({ stage }),
      });
      setStatus(result.status);
      setTitlesText(result.status.job_titles.join("\n"));
      await loadPromotionReport(token);
      const completedAt = new Date().toISOString();
      setStageRuns((current) => ({
        ...current,
        [stage]: {
          status: "completed",
          detail: result.message,
          updatedAt: completedAt,
        },
        ...(stage === "all"
          ? {
              generate: {
                status: "completed" as StageStatus,
                detail: `Run all completed. Generated ${result.generated_cases} case${result.generated_cases === 1 ? "" : "s"}.`,
                updatedAt: completedAt,
              },
              score: {
                status: "completed" as StageStatus,
                detail: `Run all completed. Scored ${result.scored_outputs} output${result.scored_outputs === 1 ? "" : "s"}.`,
                updatedAt: completedAt,
              },
              judge: {
                status: "completed" as StageStatus,
                detail: `Run all completed. Judged ${result.judged_reports} report${result.judged_reports === 1 ? "" : "s"}.`,
                updatedAt: completedAt,
              },
            }
          : {}),
      }));
      setMessage(result.message);
    } catch (error) {
      const errorMessage = detailMessage(error);
      setStageRuns((current) => ({
        ...current,
        [stage]: {
          status: "failed",
          detail: errorMessage,
          updatedAt: new Date().toISOString(),
        },
      }));
      setMessage(errorMessage);
    } finally {
      setBusyStage("");
    }
  }

  async function importRealJd() {
    if (!token) return;
    const selectedTitle = realJdTitle.trim();
    const pastedJd = realJdText.trim();
    if (!selectedTitle || pastedJd.length < 120) {
      setMessage("Pick a saved title and paste a full real JD before importing.");
      return;
    }
    setBusyStage("realJd");
    setMessage("Importing real JD, generating synthetic resumes, scoring, and judging this case.");
    try {
      const result = await apiFetch<ScoringSandboxRealJdResult>("/platform/scoring-sandbox/real-jd", {
        method: "POST",
        token,
        body: JSON.stringify({
          job_title: selectedTitle,
          job_description: pastedJd,
        }),
      });
      setStatus(result.status);
      setTitlesText(result.status.job_titles.join("\n"));
      setPromotionReport(result.report);
      setRealJdText("");
      setStageRuns((current) =>
        stageRunsFromStatus(result.status, {
          ...current,
          score: {
            status: "completed",
            detail: `Real JD import scored ${result.scored_outputs} resume${result.scored_outputs === 1 ? "" : "s"}.`,
            updatedAt: new Date().toISOString(),
          },
          judge: {
            status: "completed",
            detail: `Real JD import judged ${result.judged_reports} report${result.judged_reports === 1 ? "" : "s"}.`,
            updatedAt: new Date().toISOString(),
          },
        }),
      );
      setMessage(`${result.message} Check Pre-promote review for new candidate lessons.`);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusyStage("");
    }
  }

  function toggleCandidate(candidateId: string, checked: boolean) {
    setSelectedCandidateIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(candidateId);
      } else {
        next.delete(candidateId);
      }
      return next;
    });
  }

  function updateLessonType(candidateId: string, lessonType: ScoringSandboxLessonType) {
    setLessonTypes((current) => ({
      ...current,
      [candidateId]: lessonType,
    }));
  }

  function selectAllUnpromoted() {
    setSelectedCandidateIds(
      new Set((promotionReport?.candidates ?? []).filter((candidate) => !candidate.already_promoted).map((candidate) => candidate.id)),
    );
  }

  async function promoteSelectedCandidates() {
    if (!token || !selectedCandidateIds.size) return;
    setPromotionBusy(true);
    try {
      const result = await apiFetch<ScoringSandboxPromoteResult>("/platform/scoring-sandbox/promote", {
        method: "POST",
        token,
        body: JSON.stringify({
          lessons: [...selectedCandidateIds].map((candidateId) => ({
            candidate_id: candidateId,
            lesson_type: lessonTypes[candidateId] ?? "regression_bug",
          })),
        }),
      });
      setStatus(result.status);
      setPromotionReport(result.report);
      setSelectedCandidateIds(new Set());
      setMessage(`Saved ${result.promoted.length} lesson${result.promoted.length === 1 ? "" : "s"}; skipped ${result.skipped.length}.`);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setPromotionBusy(false);
    }
  }

  async function ignoreSelectedCandidates() {
    if (!token || !selectedCandidateIds.size) return;
    setIgnoreBusy(true);
    try {
      const result = await apiFetch<ScoringSandboxIgnoreResult>("/platform/scoring-sandbox/ignore", {
        method: "POST",
        token,
        body: JSON.stringify({ candidate_ids: [...selectedCandidateIds] }),
      });
      setPromotionReport(result.report);
      setSelectedCandidateIds(new Set());
      setMessage(`Ignored ${result.ignored.length} candidate${result.ignored.length === 1 ? "" : "s"}; skipped ${result.skipped.length}.`);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setIgnoreBusy(false);
    }
  }

  return (
    <AppShell
      eyebrow="Platform Admin"
      title="Scoring sandbox control room."
      description="Generate synthetic JDs and resumes, run CareerCoachAI scoring, and review judge reports before promoting lessons into the scoring knowledgebase."
      actions={
        <Button
          className="gap-2"
          disabled={Boolean(busyStage)}
          onClick={() => void refreshPageData(token)}
          type="button"
          variant="outline"
        >
          <RefreshCcwIcon className={cn("size-4", busyStage === "refresh" && "animate-spin")} />
          Refresh
        </Button>
      }
      contentClassName="max-w-[1800px]"
    >
      <div className="grid gap-5">
        <Panel className="overflow-hidden border-cyan-200 bg-gradient-to-br from-cyan-50 via-background to-background dark:border-cyan-900 dark:from-cyan-950/25">
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-md bg-cyan-700 text-white shadow-sm">
                  <FolderKanbanIcon className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Sandbox base</p>
                  <p className="break-all font-mono text-sm font-semibold">
                    {status?.base_dir || "Loading..."}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Job titles" value={status?.job_titles.length ?? 0} />
                <Metric label="Input cases" value={status?.input_cases ?? 0} />
                <Metric label="Analysis JSON" value={status?.analysis_outputs ?? 0} />
                <Metric label="Judge reports" value={status?.evaluation_reports ?? 0} />
              </div>
            </div>

            <div className="grid gap-3 rounded-md border bg-background/75 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Knowledgebase coverage</h2>
                  <p className="text-sm text-muted-foreground">
                    Active guardrail cases plus planned lessons waiting for implementation.
                  </p>
                </div>
                <ShieldCheckIcon className="size-5 text-cyan-700" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Active cases" value={status?.active_regression_cases ?? 0} />
                <Metric label="Planned cases" value={status?.planned_regression_cases ?? 0} />
              </div>
            </div>
          </div>
        </Panel>

        <Panel
          title="How to read this page"
          description="This sandbox is a safe place to create scoring examples, test the matching engine, and promote real failures into permanent guardrails."
          action={
            <Badge className="rounded-full" variant="outline">
              Guide
            </Badge>
          }
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {guideItems.map((item, index) => (
              <div className="rounded-md border bg-muted/15 p-4" key={item.title}>
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-md bg-cyan-700 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
          <Panel
            title="Job title input"
            description="One title per line. These titles seed synthetic JD and resume generation."
            action={
              <Badge className="rounded-full" variant="secondary">
                {titleCount} title{titleCount === 1 ? "" : "s"}
              </Badge>
            }
          >
            <div className="grid gap-3">
              <Textarea
                className="h-72 resize-y overflow-y-auto font-mono text-sm"
                onChange={(event) => setTitlesText(event.target.value)}
                placeholder={"Senior Accounting Manager\nAI Systems Engineer\nInfrastructure Architect"}
                value={titlesText}
              />
              <div className="flex flex-wrap gap-2">
                <Button className="gap-2" disabled={Boolean(busyStage)} onClick={saveTitles} type="button">
                  <SaveIcon className="size-4" />
                  {busyStage === "save" ? "Saving..." : "Save titles"}
                </Button>
                <Button
                  className="gap-2"
                  disabled={Boolean(busyStage)}
                  onClick={() => void runStage("generate")}
                  type="button"
                  variant="secondary"
                >
                  <SparklesIcon className="size-4" />
                  Generate inputs
                </Button>
              </div>
            </div>
          </Panel>

          <Panel
            title="Saved titles"
            description="This is the list currently stored in the backend sandbox file."
            action={
              <Badge className="rounded-full" variant="outline">
                {status?.job_titles.length ?? 0} saved
              </Badge>
            }
          >
            <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
              {(status?.job_titles ?? []).map((title) => (
                <div className="rounded-md border bg-muted/15 px-3 py-2 text-sm font-medium" key={title}>
                  {title}
                </div>
              ))}
              {!status?.job_titles.length ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  No saved titles yet. Add one title per line, then save.
                </p>
              ) : null}
            </div>
          </Panel>
        </div>

        <Panel
          title="Real JD paste bench"
          description="Pick one saved title, paste a real LinkedIn or job-board description for that title, then run it through synthetic resumes, scoring, judge review, and the promotion queue."
          action={
            <Badge className="rounded-full" variant="outline">
              Real-world noise
            </Badge>
          }
        >
          <div className="grid gap-4 xl:grid-cols-[0.42fr_0.58fr]">
            <div className="rounded-md border bg-muted/15 p-4">
              <div className="flex items-center gap-2">
                <ClipboardPasteIcon className="size-4 text-cyan-700" />
                <h2 className="text-sm font-semibold">Title queue</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Open LinkedIn or another job board in a separate tab, search for the selected title, then paste the full JD on the right.
              </p>
              <div className="mt-4 grid max-h-80 gap-2 overflow-y-auto pr-1">
                {(status?.job_titles ?? []).map((title) => (
                  <button
                    className={cn(
                      "rounded-md border px-3 py-2 text-left text-sm transition hover:border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/25",
                      realJdTitle === title ? "border-cyan-500 bg-cyan-50 font-semibold dark:bg-cyan-950/25" : "bg-background",
                    )}
                    key={title}
                    onClick={() => setRealJdTitle(title)}
                    type="button"
                  >
                    {title}
                  </button>
                ))}
                {!status?.job_titles.length ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Save job titles first, then use this queue to paste real JDs by title.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-md border bg-background p-4">
                <p className="text-sm font-semibold">Selected title</p>
                <p className="mt-1 text-lg font-semibold tracking-tight">
                  {realJdTitle || "Choose a title from the queue"}
                </p>
              </div>
              <Textarea
                className="min-h-80 resize-y overflow-y-auto font-mono text-sm"
                onChange={(event) => setRealJdText(event.target.value)}
                placeholder="Paste the full real JD here, including About the job, benefits, EEO, compensation, and other noisy sections. The scorer will preserve the raw JD for testing and still apply the cleaning layer during analysis."
                value={realJdText}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {realJdText.trim().length.toLocaleString()} characters pasted
                </p>
                <Button
                  className="gap-2"
                  disabled={Boolean(busyStage) || !realJdTitle || realJdText.trim().length < 120}
                  onClick={importRealJd}
                  type="button"
                >
                  <BeakerIcon className={cn("size-4", busyStage === "realJd" && "animate-pulse")} />
                  {busyStage === "realJd" ? "Running real JD..." : "Import, score, judge"}
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Execute sandbox stages" description="Run one stage at a time, or run the full local loop.">
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {stages.map((item) => {
                const Icon = item.icon;
                const running = busyStage === item.stage;
                return (
                  <button
                    className="group rounded-md border bg-background p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={Boolean(busyStage)}
                    key={item.stage}
                    onClick={() => void runStage(item.stage)}
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 place-items-center rounded-md bg-cyan-700 text-white">
                        <Icon className={cn("size-5", running && "animate-pulse")} />
                      </span>
                      <div>
                        <p className="font-semibold">{running ? `Running ${item.title}` : item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 rounded-md border bg-muted/15 p-4 xl:grid-cols-4">
              {stages.map((item) => (
                <StageStatusCard
                  key={item.stage}
                  runState={stageRuns[item.stage]}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Sandbox activity" description="High-level output status for each stage.">
          <div className="grid gap-3 xl:grid-cols-3">
            <ActivityCard
              count={status?.input_files ?? 0}
              detail={`${status?.input_cases ?? 0} generated case${(status?.input_cases ?? 0) === 1 ? "" : "s"}`}
              icon={ListChecksIcon}
              latestAt={status?.recent_inputs?.[0]?.updated_at}
              title="Generated inputs"
            />
            <ActivityCard
              count={status?.analysis_outputs ?? 0}
              detail="Resume/JD scoring JSON files"
              icon={BeakerIcon}
              latestAt={status?.recent_outputs?.[0]?.updated_at}
              title="Scoring outputs"
            />
            <ActivityCard
              count={status?.evaluation_reports ?? 0}
              detail="Judge reports ready for review"
              icon={BrainCircuitIcon}
              latestAt={status?.recent_evaluations?.[0]?.updated_at}
              title="Judge reviews"
            />
          </div>
        </Panel>

        <Panel
          title="Pre-promote review"
          description="Candidate lessons detected from sandbox scoring outputs. Classify each selected item before saving it as a hard regression or calibration example."
          action={
            <Badge className="rounded-full" variant="outline">
              {promotionReport?.unpromoted_candidates ?? 0} open
            </Badge>
          }
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/15 p-4">
              <div>
                <p className="font-semibold">Lesson queue</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {promotionReport?.unpromoted_candidates
                    ? `Showing ${promotionReport.shown_candidates} of ${promotionReport.total_candidates} open candidate lessons.`
                    : promotionReport?.raw_candidates
                      ? "No open candidate lessons. Every suspicious item found so far is already saved, in regression/planned cases, or ignored."
                      : "No suspicious candidate lessons were found in the current scoring outputs."}
                  {" "}
                  {promotionReport?.ignored_candidates ? `${promotionReport.ignored_candidates} ignored.` : "No ignored cases yet."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button disabled={promotionBusy || ignoreBusy || !promotionReport?.unpromoted_candidates} onClick={selectAllUnpromoted} type="button" variant="outline">
                  Select open cases
                </Button>
                <Button
                  disabled={promotionBusy || ignoreBusy || !selectedCandidateIds.size}
                  onClick={ignoreSelectedCandidates}
                  type="button"
                  variant="outline"
                >
                  {ignoreBusy ? "Ignoring..." : `Ignore selected (${selectedCandidateIds.size})`}
                </Button>
                <Button
                  className="gap-2"
                  disabled={promotionBusy || ignoreBusy || !selectedCandidateIds.size}
                  onClick={promoteSelectedCandidates}
                  type="button"
                >
                  <CheckSquareIcon className="size-4" />
                  {promotionBusy ? "Saving..." : `Save selected lessons (${selectedCandidateIds.size})`}
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <Metric label="Detected" value={promotionReport?.raw_candidates ?? 0} />
              <Metric label="Open" value={promotionReport?.unpromoted_candidates ?? 0} />
              <Metric label="Saved lessons" value={promotionReport?.saved_lesson_candidates ?? 0} />
              <Metric label="Regression/planned" value={promotionReport?.already_promoted_candidates ?? 0} />
              <Metric label="Ignored" value={promotionReport?.ignored_candidates ?? 0} />
            </div>

            <div className="grid gap-3">
              {(promotionReport?.candidates ?? []).map((candidate) => (
                <PromotionCandidateCard
                  checked={selectedCandidateIds.has(candidate.id)}
                  candidate={candidate}
                  key={candidate.id}
                  lessonType={lessonTypes[candidate.id] ?? "regression_bug"}
                  onCheckedChange={(checked) => toggleCandidate(candidate.id, checked)}
                  onLessonTypeChange={(lessonType) => updateLessonType(candidate.id, lessonType)}
                />
              ))}
              {!promotionReport?.candidates.length ? (
                <div className="rounded-md border bg-background p-4 text-sm leading-6 text-muted-foreground">
                  The lesson queue is clear. Run Generate and Score after adding new titles or dirtier examples to look for fresh candidate guardrails.
                </div>
              ) : null}
            </div>
          </div>
        </Panel>

        <Message>{message}</Message>
      </div>
    </AppShell>
  );
}

function PromotionCandidateCard({
  candidate,
  checked,
  lessonType,
  onCheckedChange,
  onLessonTypeChange,
}: {
  candidate: ScoringSandboxPromotionCandidate;
  checked: boolean;
  lessonType: ScoringSandboxLessonType;
  onCheckedChange: (checked: boolean) => void;
  onLessonTypeChange: (lessonType: ScoringSandboxLessonType) => void;
}) {
  const selectedLesson = lessonOptions.find((item) => item.value === lessonType) ?? lessonOptions[0];
  return (
    <div className={cn("rounded-md border bg-background p-4", candidate.already_promoted && "opacity-65")}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={checked}
          className="mt-1"
          disabled={candidate.already_promoted}
          onCheckedChange={(value) => onCheckedChange(Boolean(value))}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full" variant={candidate.already_promoted ? "secondary" : "destructive"}>
              {candidate.already_promoted ? "Promoted" : "Needs review"}
            </Badge>
            <Badge className="rounded-full" variant="outline">
              {candidate.failure_mode.replaceAll("_", " ")}
            </Badge>
            <span className="text-xs text-muted-foreground">{candidate.case_slug} / {candidate.resume_file}</span>
          </div>

          <p className="mt-3 font-semibold leading-6">{candidate.reason}</p>
          <div className="mt-4 grid gap-3 rounded-md border bg-muted/15 p-3 lg:grid-cols-[minmax(220px,0.4fr)_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Save as</p>
              <Select
                disabled={candidate.already_promoted}
                onValueChange={(value) => onLessonTypeChange(value as ScoringSandboxLessonType)}
                value={lessonType}
              >
                <SelectTrigger className="mt-2 w-full bg-background">
                  <SelectValue>{selectedLesson.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {lessonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-background/80 p-3 text-sm leading-6 text-muted-foreground">
              {selectedLesson.description}
            </div>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-md bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Requirement</p>
              <p className="mt-2 text-sm leading-6">{candidate.requirement}</p>
            </div>
            <div className="rounded-md bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Matched evidence</p>
              <p className="mt-2 text-sm leading-6">{candidate.evidence}</p>
            </div>
          </div>

          <details className="mt-3 rounded-md border bg-muted/10 p-3">
            <summary className="cursor-pointer text-sm font-semibold">Preview proposed JSON case</summary>
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-background p-3 text-xs leading-5">
              {JSON.stringify(candidate.proposed_case, null, 2)}
            </pre>
          </details>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangleIcon className="size-4" />
            <span>{candidate.analysis_path}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-background/75 p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function StageStatusCard({
  runState,
  title,
}: {
  runState: StageRunState;
  title: string;
}) {
  const statusConfig = {
    idle: {
      badge: "Not run yet",
      icon: ClockIcon,
      iconClassName: "text-muted-foreground",
      variant: "outline" as const,
    },
    running: {
      badge: "Running",
      icon: LoaderCircleIcon,
      iconClassName: "animate-spin text-cyan-700",
      variant: "secondary" as const,
    },
    completed: {
      badge: "Completed",
      icon: CheckCircle2Icon,
      iconClassName: "text-emerald-700",
      variant: "secondary" as const,
    },
    failed: {
      badge: "Failed",
      icon: XCircleIcon,
      iconClassName: "text-destructive",
      variant: "destructive" as const,
    },
  }[runState.status];
  const Icon = statusConfig.icon;

  return (
    <div className="rounded-md border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className={cn("size-4 shrink-0", statusConfig.iconClassName)} />
          <p className="truncate text-sm font-semibold">{title}</p>
        </div>
        <Badge className="shrink-0 rounded-full" variant={statusConfig.variant}>
          {statusConfig.badge}
        </Badge>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{runState.detail}</p>
      <p className="mt-3 border-t pt-2 text-xs text-muted-foreground">
        {runState.updatedAt ? `Updated ${formatDateTime(runState.updatedAt)}` : "Waiting for first run"}
      </p>
    </div>
  );
}

function ActivityCard({
  count,
  detail,
  icon: Icon,
  latestAt,
  title,
}: {
  count: number;
  detail: string;
  icon: typeof SparklesIcon;
  latestAt?: string;
  title: string;
}) {
  const hasOutput = count > 0;
  return (
    <div className="rounded-md border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-cyan-700 text-white">
          <Icon className="size-5" />
        </span>
        <Badge className="rounded-full" variant={hasOutput ? "secondary" : "outline"}>
          {hasOutput ? "Ready" : "Empty"}
        </Badge>
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{count}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground">
        <CheckCircle2Icon className={cn("size-4", hasOutput ? "text-cyan-700" : "text-muted-foreground")} />
        {latestAt ? <span>Last updated {formatDateTime(latestAt)}</span> : <span>No completed output yet</span>}
      </div>
    </div>
  );
}
