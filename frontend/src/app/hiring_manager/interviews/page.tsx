"use client";

import { Fragment, useEffect, useState } from "react";
import {
  ClipboardListIcon,
  FileQuestionIcon,
  GaugeIcon,
  Loader2Icon,
  PanelsTopLeftIcon,
} from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, type Application, type Interview, type Question } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage, formatDateTime, formatScore } from "@/lib/format";

type DecisionDraft = {
  comment: string;
  verdict: "" | "Acceptable" | "Strongly recommend" | "Reject";
};

type ReviewFilter = "pending" | "reviewed" | "all";

const reviewFilters: Array<{
  value: ReviewFilter;
  label: string;
  description: string;
}> = [
  { value: "pending", label: "Pending", description: "Needs your recommendation" },
  { value: "reviewed", label: "Reviewed", description: "Recommendation submitted" },
  { value: "all", label: "All", description: "Every assigned interview" },
];

export default function HiringManagerInterviewsPage() {
  const [token, setToken] = useState("");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [drafts, setDrafts] = useState<Record<number, DecisionDraft>>({});
  const [message, setMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("pending");
  const [expandedInterviewId, setExpandedInterviewId] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }
      try {
        const me = await getCurrentUser(saved);
        const roles = me.roles?.length ? me.roles : [me.role];
        if (!roles.includes("Hiring_Manager")) {
          setAuthMessage("This page requires a hiring manager login.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        setAuthMessage(`Signed in as ${me.email}`);
      } catch {
        clearToken(EMPLOYER_TOKEN_KEY);
        window.location.href = "/employer/login";
      }
    }
    void init();
  }, []);

  useEffect(() => {
    if (token) void loadInterviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadInterviews() {
    try {
      const data = await apiFetch<Interview[]>("/interviews", { token });
      setInterviews(data);
      setDrafts(
        Object.fromEntries(
          data.map((interview) => [
            interview.id,
            {
              comment: interview.manager_comment || "",
              verdict: interview.final_verdict || "",
            },
          ]),
        ),
      );
      setMessage(data.length ? "" : "No interviews assigned.");
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  async function submitDecision(interviewId: number) {
    const draft = drafts[interviewId];
    if (
      draft?.verdict &&
      draft.comment.trim().length < 10
    ) {
      setMessage("Add manager review notes before submitting a recommendation.");
      return;
    }
    try {
      const data = await apiFetch<Interview>(`/interviews/${interviewId}/decision`, {
        method: "POST",
        token,
        body: JSON.stringify({
          manager_comment: draft?.comment || "",
          final_verdict: draft?.verdict || null,
        }),
      });
      setMessage(
        data.final_verdict
          ? `Recommendation recorded: ${data.final_verdict}.`
          : "Recommendation moved back to Pending.",
      );
      await loadInterviews();
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  const sortedInterviews = sortInterviews(interviews);
  const filteredInterviews = sortedInterviews.filter((interview) =>
    reviewFilter === "all"
      ? true
      : reviewFilter === "pending"
        ? !interview.final_verdict
        : Boolean(interview.final_verdict),
  );
  const filterCounts = {
    pending: interviews.filter((interview) => !interview.final_verdict).length,
    reviewed: interviews.filter((interview) => Boolean(interview.final_verdict)).length,
    all: interviews.length,
  } satisfies Record<ReviewFilter, number>;

  return (
    <AppShell
      eyebrow="Hiring manager"
      title="End the last-minute interview panic."
      description={authMessage || "Checking hiring manager login..."}
      actions={
        <>
          <GuideLink href="/guides/hiring-manager" />
          <Button onClick={loadInterviews} type="button" variant="outline">
            Refresh
          </Button>
        </>
      }
    >
      <div className="grid gap-5">
        <Panel>
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge className="mb-3 rounded-full bg-slate-950 text-white hover:bg-slate-950">
                Interview preparedness
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight">
                No more entering the room unsure what to ask.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                Stop reading resumes cold. After hours in a resume pile,
                CareerCoachAI turns each assigned interview into a decision-ready
                dossier: match evidence, pre-screening signals, and the exact
                gaps to probe before the candidate walks in.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: FileQuestionIcon,
                  title: "Intentional guide",
                  body: "4 JD prompts, 3 resume prompts, and 3 soft-skill prompts.",
                },
                {
                  icon: PanelsTopLeftIcon,
                  title: "One-click dossier",
                  body: "Resume match, Q&A score, comments, and status together.",
                },
                {
                  icon: ClipboardListIcon,
                  title: "Scoring rubrics",
                  body: "Clear 1-5 standards for what good answers contain.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div className="rounded-lg border bg-muted/20 p-3" key={title}>
                  <Icon className="mb-3 size-5 text-emerald-700" />
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel
          title="Applications to review"
          description="Start with pending recommendations, then open the one-click dossier to review evidence and submit your decision."
        >
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            {reviewFilters.map((filter) => (
              <Button
                className="h-auto justify-between gap-3 px-3 py-3 text-left"
                key={filter.value}
                onClick={() => {
                  setReviewFilter(filter.value);
                  setExpandedInterviewId(null);
                }}
                type="button"
                variant={reviewFilter === filter.value ? "default" : "outline"}
              >
                <span className="min-w-0">
                  <span className="block truncate">{filter.label}</span>
                  <span className="block truncate text-xs font-normal opacity-75">
                    {filter.description}
                  </span>
                </span>
                <Badge variant={reviewFilter === filter.value ? "secondary" : "outline"}>
                  {filterCounts[filter.value]}
                </Badge>
              </Button>
            ))}
          </div>
          <InterviewsTable
            drafts={drafts}
            expandedInterviewId={expandedInterviewId}
            interviews={filteredInterviews}
            token={token}
            onDraftChange={(interviewId, nextDraft) =>
              setDrafts({ ...drafts, [interviewId]: nextDraft })
            }
            onSubmit={(interviewId) => void submitDecision(interviewId)}
            onToggleInterview={(interviewId) =>
              setExpandedInterviewId((current) =>
                current === interviewId ? null : interviewId,
              )
            }
          />
        </Panel>
        <Message>{message}</Message>
      </div>
    </AppShell>
  );
}

function InterviewsTable({
  drafts,
  expandedInterviewId,
  interviews,
  token,
  onDraftChange,
  onSubmit,
  onToggleInterview,
}: {
  drafts: Record<number, DecisionDraft>;
  expandedInterviewId: number | null;
  interviews: Interview[];
  token: string;
  onDraftChange: (interviewId: number, draft: DecisionDraft) => void;
  onSubmit: (interviewId: number) => void;
  onToggleInterview: (interviewId: number) => void;
}) {
  if (!interviews.length) {
    return <p className="text-muted-foreground">No applications in this view.</p>;
  }

  return (
    <div className="overflow-x-auto">
    <Table className="min-w-[980px] table-fixed">
      <colgroup>
        <col className="w-[24%]" />
        <col className="w-[22%]" />
        <col className="w-[17%]" />
        <col className="w-[9%]" />
        <col className="w-[9%]" />
        <col className="w-[12%]" />
        <col className="w-[7%]" />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Job</TableHead>
          <TableHead>Interview</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Q&A</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map((interview) => {
          const application = interview.application;
          const draft = drafts[interview.id] || { comment: "", verdict: "" };
          const expanded = expandedInterviewId === interview.id;

          return (
            <Fragment key={interview.id}>
              <TableRow>
                <TableCell className="whitespace-normal break-words align-top">
                  <button
                    aria-expanded={expanded}
                    className="text-left font-medium text-primary underline underline-offset-4 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onToggleInterview(interview.id)}
                    type="button"
                  >
                    {application?.applicant_name || "Unnamed applicant"}
                  </button>
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {application?.applicant_email || "No email on file"}
                  </span>
                </TableCell>
                <TableCell className="whitespace-normal break-words align-top">
                  <span className="font-medium">
                    {application?.job_title || "Unknown job"}
                  </span>
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {application?.job_position || "No position listed"}
                  </span>
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {formatDateTime(interview.schedule_time)}
                </TableCell>
                <TableCell className="align-top">
                  {formatScore(application?.matching_score)}
                </TableCell>
                <TableCell className="align-top">
                  {formatScore(application?.answer_score)}
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {interview.final_verdict ? (
                    <Badge variant="secondary">{interview.final_verdict}</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="align-top text-right">
                  <Button
                    onClick={() => onToggleInterview(interview.id)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {expanded ? "Close" : "Review"}
                  </Button>
                </TableCell>
              </TableRow>
              {expanded ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell className="whitespace-normal p-0" colSpan={7}>
                    <div className="sticky left-0 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] p-4 sm:w-[calc(100vw-4rem)] sm:max-w-[calc(100vw-4rem)] lg:w-full lg:max-w-full">
                    <InterviewReviewPanel
                      draft={draft}
                      interview={interview}
                      token={token}
                      onDraftChange={(nextDraft) =>
                        onDraftChange(interview.id, nextDraft)
                      }
                      onSubmit={() => onSubmit(interview.id)}
                    />
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}

function InterviewReviewPanel({
  draft,
  interview,
  token,
  onDraftChange,
  onSubmit,
}: {
  draft: DecisionDraft;
  interview: Interview;
  token: string;
  onDraftChange: (draft: DecisionDraft) => void;
  onSubmit: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsMessage, setQuestionsMessage] = useState("");
  const application = interview.application;
  const savedVerdict = interview.final_verdict || "";
  const draftVerdict = draft.verdict || "";
  const hasUnsavedDecision = draftVerdict !== savedVerdict;
  const requiresNotes = Boolean(draft.verdict);
  const hasEnoughNotes = draft.comment.trim().length >= 10;
  const submitDisabled = requiresNotes && !hasEnoughNotes;

  async function toggleQuestions() {
    if (questionsOpen) {
      setQuestionsOpen(false);
      return;
    }
    setQuestionsOpen(true);
    if (questions.length || questionsLoading) return;
    setQuestionsLoading(true);
    setQuestionsMessage("");
    try {
      const data = await apiFetch<Question[]>(`/interviews/${interview.id}/questions`, {
        token,
      });
      setQuestions(data);
      if (!data.length) {
        setQuestionsMessage("No suggested questions are attached to this job yet.");
      }
    } catch (error) {
      setQuestionsMessage(detailMessage(error));
    } finally {
      setQuestionsLoading(false);
    }
  }

  return (
    <div className="grid min-w-0 gap-4 rounded-lg border bg-muted/20 p-4">
      <div className="grid min-w-0 gap-3">
          {application ? (
          <>
            <div className="min-w-0 w-full max-w-full overflow-hidden rounded-lg border bg-background p-3">
              <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Full Dossier Preview
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Everything needed to move from discovery to decision.
                  </p>
                </div>
                <GaugeIcon className="size-5 shrink-0 text-emerald-700" />
              </div>
              <div className="grid min-w-0 gap-2 sm:grid-cols-3">
                <div className="min-w-0 rounded-md border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Resume/JD
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {formatScore(application.matching_score)}
                  </p>
                </div>
                <div className="min-w-0 rounded-md border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Pre-screen Q&A
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {formatScore(application.answer_score)}
                  </p>
                </div>
                <div className="min-w-0 rounded-md border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Source
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {application.source.replaceAll("_", " ")}
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-0 w-full max-w-full overflow-hidden rounded-lg border bg-background p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Candidate snapshot
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Resume {formatScore(application.matching_score)}
                </Badge>
                <Badge variant="secondary">
                  Q&A {formatScore(application.answer_score)}
                </Badge>
                <Badge variant="outline">{application.status}</Badge>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Job
                  </p>
                  <p className="font-medium">
                    {application.job_title || "Unknown job"}
                  </p>
                  <p className="text-muted-foreground">
                    {application.job_position || "No position listed"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Interview
                  </p>
                  <p className="font-medium">{formatDateTime(interview.schedule_time)}</p>
                </div>
              </div>
            </div>
            <SuggestedQuestionsPanel
              loading={questionsLoading}
              message={questionsMessage}
              onToggle={() => void toggleQuestions()}
              open={questionsOpen}
              questions={questions}
            />
            <ApplicationEvidence application={application} />
          </>
        ) : (
          <p className="text-muted-foreground">Application details are unavailable.</p>
        )}
      </div>
      <div className="min-w-0 rounded-lg border bg-background p-4 shadow-xs">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Manager review
          </p>
          {requiresNotes ? (
            <Badge variant={hasEnoughNotes ? "secondary" : "outline"}>
              Notes required
            </Badge>
          ) : null}
          {hasUnsavedDecision ? (
            <Badge variant="secondary">
              Unsaved: {draftVerdict || "Pending"}
            </Badge>
          ) : null}
        </div>
        <Textarea
          aria-label={`Manager review for interview ${interview.id}`}
          id={`interview-${interview.id}-comment`}
          className="min-h-28 resize-y"
          onChange={(event) =>
            onDraftChange({ ...draft, comment: event.target.value })
          }
          placeholder="Short notes, strengths, concerns, or follow-up items..."
          value={draft.comment}
        />
        {submitDisabled ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Add at least 10 characters of notes before submitting a recommendation.
          </p>
        ) : null}
        <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="grid gap-2">
            <Label>Recommendation</Label>
            <Select
              value={draft.verdict || "none"}
              onValueChange={(value) =>
                onDraftChange({
                  ...draft,
                  verdict:
                    !value || value === "none"
                      ? ""
                      : (value as DecisionDraft["verdict"]),
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>{draft.verdict || "Pending"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Pending</SelectItem>
                <SelectItem value="Strongly recommend">
                  Strongly recommend
                </SelectItem>
                <SelectItem value="Acceptable">Acceptable</SelectItem>
                <SelectItem value="Reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full sm:w-auto"
            disabled={submitDisabled}
            onClick={onSubmit}
            type="button"
          >
            Submit recommendation
          </Button>
        </div>
      </div>
    </div>
  );
}

function sortInterviews(interviews: Interview[]) {
  const sorted = [...interviews].sort((left, right) => {
    const leftTime = left.schedule_time
      ? new Date(left.schedule_time).getTime()
      : Number.POSITIVE_INFINITY;
    const rightTime = right.schedule_time
      ? new Date(right.schedule_time).getTime()
      : Number.POSITIVE_INFINITY;
    return leftTime - rightTime || left.id - right.id;
  });

  return sorted;
}

function SuggestedQuestionsPanel({
  loading,
  message,
  onToggle,
  open,
  questions,
}: {
  loading: boolean;
  message: string;
  onToggle: () => void;
  open: boolean;
  questions: Question[];
}) {
  const resumeQuestions = questions.slice(0, 10);
  const jdQuestions = questions.slice(10, 20);

  return (
    <div className="min-w-0 rounded-lg border bg-background p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md border bg-emerald-50 text-emerald-800">
            <FileQuestionIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">20 suggested interview questions</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Open the generated question set before writing the final recommendation.
            </p>
          </div>
        </div>
        <Button
          className="gap-2"
          onClick={onToggle}
          size="sm"
          type="button"
          variant="outline"
        >
          {loading ? <Loader2Icon className="size-4 animate-spin" /> : null}
          {open ? "Hide questions" : "View questions"}
        </Button>
      </div>

      {open ? (
        <div className="mt-4 border-t pt-4">
          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading suggested questions...</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <QuestionColumn
                questions={resumeQuestions}
                startIndex={1}
                title="Resume-based"
              />
              <QuestionColumn
                questions={jdQuestions.length ? jdQuestions : questions.slice(10)}
                startIndex={11}
                title="Job-based"
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function QuestionColumn({
  questions,
  startIndex,
  title,
}: {
  questions: Question[];
  startIndex: number;
  title: string;
}) {
  return (
    <div className="min-w-0 rounded-md border bg-muted/20 p-3">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <ol className="mt-3 grid gap-3">
        {questions.map((question, index) => (
          <li className="grid grid-cols-[2rem_1fr] gap-2" key={question.id}>
            <span className="text-xs font-semibold text-muted-foreground">
              {startIndex + index}.
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-6">{question.text}</p>
              <Badge className="mt-2" variant="outline">
                {question.category}
              </Badge>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ApplicationEvidence({
  application,
}: {
  application: Application;
}) {
  return (
    <div className="grid gap-3 rounded-lg border bg-background p-3">
      <div className="flex items-start gap-3 rounded-md border bg-muted/20 p-3">
        <FileQuestionIcon className="mt-0.5 size-4 shrink-0 text-emerald-700" />
        <div>
          <p className="text-sm font-semibold">Interview prep focus</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Use the match evidence and pre-screening comments below to pick the
            highest-leverage follow-ups. The generated guide should keep
            face-to-face time focused on final verdicts, not basic vetting.
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Resume/JD dossier note
        </p>
        <p className="mt-1 whitespace-pre-wrap leading-6">
          {application.resume_comment || "No resume comment generated yet."}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Pre-screening Q&A dossier note
        </p>
        <p className="mt-1 whitespace-pre-wrap leading-6">
          {application.answer_comment || "No Q&A comment generated yet."}
        </p>
      </div>
    </div>
  );
}
