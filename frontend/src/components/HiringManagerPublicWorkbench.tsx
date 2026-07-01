"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ClipboardListIcon,
  FileQuestionIcon,
  LightbulbIcon,
  RefreshCcwIcon,
  UploadIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  apiFetch,
  type PublicAnalysis,
  type PublicHiringManagerQuestionSet,
  type PublicHiringManagerQuestions,
} from "@/lib/api";
import { AnalysisEvidenceDetails } from "@/components/AnalysisEvidenceDetails";
import { EMPLOYER_TOKEN_KEY, readToken } from "@/lib/auth";
import { detailMessage } from "@/lib/format";
import { useCurrentLocale } from "@/lib/market";
import { cn } from "@/lib/utils";

const hmCopy = {
  en: {
    uploadFirst: "Upload a resume first.",
    fullerJd: "Paste a fuller job description before running the tool.",
    analyzingMessage: "Analyzing resume against the JD.",
    analysisComplete: "Match analysis complete.",
    generatingMessage: "Generating intentional interview questions. This can take a minute.",
    questionsComplete: "Interview questions generated.",
    badge: "Free pre-screening preview",
    title: "Generate job-specific questions before you commit to a workspace.",
    body:
      "Paste the role, upload a resume, and run a complete mini-workflow: resume-to-JD match evidence, gaps to probe, and a 10-question interview guide with scoring rubrics.",
    jobTitle: "Job title",
    jobTitlePlaceholder: "Senior backend engineer",
    jd: "Job description",
    jdPlaceholder: "Paste the job description here...",
    resume: "Candidate resume",
    analyzing: "Analyzing",
    analyze: "Analyze match",
    generating: "Generating",
    generate: "Generate My Interview Guide",
    formTitle: "Run the preview",
    formBody: "Paste a role and upload one resume. The buttons below are the actions in this preview.",
    preview: "Pre-Screening Preview",
    previewBody:
      "Resume-to-JD match analysis, gaps to probe, and interview standards before the candidate walks in.",
    score: "70/30 score",
    gaps: "Gaps to probe",
    rubricStandards: "Rubric standards",
    match: "Resume/JD match",
    privatePreview: "Private preview",
    evidence: "Evidence to probe",
    verify: "Gaps to verify",
    evidenceTitle: "Evidence-based fit analysis",
    confidence: "Confidence",
    breakdown: "Score breakdown",
    matchedRequirements: "Matched requirements",
    missingRequirements: "Missing or unclear",
    evidenceQuotes: "Evidence quotes",
    emptyTitle: "No match analysis yet",
    emptyBody:
      "Analyze first to see whether the resume has enough evidence for this role. Generate an interview guide when the candidate is worth a closer look.",
    guide: "Intentional Interview Guide",
    guideBody: "4 JD prompts, 3 resume prompts, and 3 soft-skill prompts.",
    practiceQuestions: "practice questions",
    resumeStory: "Resume story",
    jdProof: "JD proof",
    scoringRubric: "Scoring Rubric",
    poor: "1 Poor:",
    solid: "3 Solid:",
    excellent: "5 Excellent:",
  },
  "zh-TW": {
    uploadFirst: "請先上傳候選人的履歷。",
    fullerJd: "請先貼上更完整的職缺內容再執行工具。",
    analyzingMessage: "正在比對履歷與職缺內容。",
    analysisComplete: "適配分析已完成。",
    generatingMessage: "正在產生結構化面試題，可能需要一點時間。",
    questionsComplete: "面試題已產生。",
    badge: "免費預篩分析預覽",
    title: "建立工作區前，先產生符合職缺的面試問題。",
    body:
      "貼上職缺、上傳履歷，就能完成一個小型預篩流程：履歷與職缺適配證據、需要追問的缺口，以及附評分標準的 10 題面試指南。",
    jobTitle: "職稱",
    jobTitlePlaceholder: "資深後端工程師",
    jd: "職缺內容",
    jdPlaceholder: "貼上職缺內容...",
    resume: "候選人履歷",
    analyzing: "分析中",
    analyze: "分析適配度",
    generating: "產生中",
    generate: "產生面試指南",
    formTitle: "執行預覽",
    formBody: "貼上職缺並上傳一份履歷。下方按鈕是此預覽頁的主要操作。",
    preview: "預篩分析預覽",
    previewBody: "在候選人進入面試前，先看到履歷與職缺適配、追問缺口與面試標準。",
    score: "70/30 分數",
    gaps: "需要追問的缺口",
    rubricStandards: "評分標準",
    match: "履歷 / 職缺適配",
    privatePreview: "私人預覽",
    evidence: "可深入追問的證據",
    verify: "需要確認的缺口",
    evidenceTitle: "證據式適配分析",
    confidence: "可信度",
    breakdown: "分數拆解",
    matchedRequirements: "符合的需求",
    missingRequirements: "缺少或不明確",
    evidenceQuotes: "證據摘錄",
    emptyTitle: "尚未進行適配分析",
    emptyBody:
      "請先分析履歷是否具備此職缺需要的證據。若候選人值得進一步了解，再產生面試指南。",
    guide: "結構化面試指南",
    guideBody: "4 題職缺驗證、3 題履歷故事、3 題軟技能題。",
    practiceQuestions: "題面試題",
    resumeStory: "履歷故事",
    jdProof: "職缺驗證",
    scoringRubric: "評分標準",
    poor: "1 不足：",
    solid: "3 合格：",
    excellent: "5 優秀：",
  },
} as const;

function EvidenceLine({ text }: { text: string }) {
  const splitAt = text.lastIndexOf(":");
  if (splitAt < 0 || splitAt >= text.length - 1) {
    return (
      <div className="rounded-md border border-emerald-100 bg-emerald-50/45 p-3 text-sm leading-6 text-slate-800">
        {text}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-emerald-100 bg-emerald-50/45 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
        Documented evidence
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        {text.slice(0, splitAt + 1)}
      </p>
      <p className="mt-2 border-l-2 border-emerald-500 bg-white/80 py-2 pl-3 text-sm font-medium leading-6 text-slate-950">
        {text.slice(splitAt + 1).trim()}
      </p>
    </div>
  );
}

function GapLine({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-amber-100 bg-amber-50/55 p-3 text-sm leading-6 text-slate-800">
      {text}
    </div>
  );
}

export function HiringManagerPublicWorkbench() {
  const { locale } = useCurrentLocale();
  const t = hmCopy[locale];
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<PublicAnalysis | null>(null);
  const [questions, setQuestions] = useState<PublicHiringManagerQuestions | null>(null);
  const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [openRubrics, setOpenRubrics] = useState<Set<number>>(new Set());

  function buildForm() {
    if (!resume) {
      setMessage(t.uploadFirst);
      return null;
    }
    if (jobDescription.trim().length < 40) {
      setMessage(t.fullerJd);
      return null;
    }
    const form = new FormData();
    form.append("job_description", jobDescription.trim());
    form.append("job_title", jobTitle.trim());
    form.append("resume", resume);
    return form;
  }

  async function analyzeCandidate() {
    const form = buildForm();
    if (!form) return;
    setAnalyzing(true);
    setMessage(t.analyzingMessage);
    setQuestions(null);
    try {
      const data = await apiFetch<PublicAnalysis>("/api/public/hiring-manager/analyze", {
        method: "POST",
        token: readToken(EMPLOYER_TOKEN_KEY),
        body: form,
      });
      setAnalysis(data);
      setMessage(t.analysisComplete);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setAnalyzing(false);
    }
  }

  async function generateQuestions() {
    const form = buildForm();
    if (!form) return;
    setGenerating(true);
    setMessage(t.generatingMessage);
    try {
      const data = await apiFetch<PublicHiringManagerQuestionSet>(
        "/api/public/hiring-manager/questions-only",
        {
          method: "POST",
          token: readToken(EMPLOYER_TOKEN_KEY),
          body: form,
        },
      );
      setQuestions({
        ...(analysis || {
          match_score: 0,
          strengths: [],
          weaknesses: [],
          extracted_profile: {
            name: "",
            email: "",
            phone: "",
            address: "",
            experience: [],
            skills: [],
            education: [],
          },
        }),
        questions: data.questions,
      });
      setOpenRubrics(new Set());
      setMessage(t.questionsComplete);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="grid self-start gap-4 rounded-md border bg-background p-4 shadow-sm">
          <div>
            <p className="text-lg font-semibold tracking-tight">{t.formTitle}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {t.formBody}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hm-job-title">{t.jobTitle}</Label>
            <Input
              id="hm-job-title"
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder={t.jobTitlePlaceholder}
              value={jobTitle}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hm-jd">{t.jd}</Label>
            <Textarea
              className="min-h-44"
              id="hm-jd"
              onChange={(event) => {
                setJobDescription(event.target.value);
                setAnalysis(null);
                setQuestions(null);
              }}
              placeholder={t.jdPlaceholder}
              value={jobDescription}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hm-resume">{t.resume}</Label>
            <Input
              accept=".txt,.pdf,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              id="hm-resume"
              onChange={(event) => {
                setResume(event.target.files?.[0] || null);
                setAnalysis(null);
                setQuestions(null);
              }}
              type="file"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="gap-2"
              disabled={analyzing}
              onClick={() => void analyzeCandidate()}
              type="button"
            >
              {analyzing ? (
                <RefreshCcwIcon className="size-4 animate-spin" />
              ) : (
                <UploadIcon className="size-4" />
              )}
              {analyzing ? t.analyzing : t.analyze}
            </Button>
            <Button
              className="gap-2"
              disabled={generating}
              onClick={() => void generateQuestions()}
              type="button"
            >
              {generating ? (
                <RefreshCcwIcon className="size-4 animate-spin" />
              ) : (
                <FileQuestionIcon className="size-4" />
              )}
              {generating ? t.generating : t.generate}
            </Button>
          </div>
          {message ? (
            <p className="rounded-md border bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              {message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4">
          <div className="rounded-md border bg-background p-4 shadow-sm">
            {analysis ? (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.match}
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight">
                      {Math.round(analysis.match_score)}
                      <span className="text-xl text-muted-foreground">/100</span>
                    </p>
                  </div>
                  <Badge className="w-fit rounded-full" variant="secondary">
                    {t.privatePreview}
                  </Badge>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                      <CheckCircle2Icon className="size-4 text-emerald-700" />
                      {t.evidence}
                    </div>
                    <div className="grid gap-3">
                      {analysis.strengths.map((item) => (
                        <EvidenceLine key={item} text={item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                      <LightbulbIcon className="size-4 text-amber-600" />
                      {t.verify}
                    </div>
                    <div className="grid gap-3">
                      {analysis.weaknesses.map((item) => (
                        <GapLine key={item} text={item} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <AnalysisEvidenceDetails
                    analysis={analysis}
                    compact
                    labels={{
                      title: t.evidenceTitle,
                      confidence: t.confidence,
                      breakdown: t.breakdown,
                      matches: t.matchedRequirements,
                      gaps: t.missingRequirements,
                      quotes: t.evidenceQuotes,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="grid min-h-64 place-items-center text-center">
                <div>
                  <FileQuestionIcon className="mx-auto size-8 text-slate-700" />
                  <p className="mt-4 font-semibold">{t.emptyTitle}</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    {t.emptyBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {questions?.questions.length ? (
            <div className="max-h-[560px] overflow-auto rounded-md border bg-background p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{t.guide}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.guideBody}
                  </p>
                </div>
                <Badge className="rounded-full" variant="secondary">
                  {questions.questions.length} {t.practiceQuestions}
                </Badge>
              </div>
              <div className="grid gap-3">
                {questions.questions.map((question) => {
                  const rubricOpen = openRubrics.has(question.id);
                  return (
                    <div className="rounded-md border bg-muted/15 p-3" key={question.id}>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full" variant="secondary">
                          {question.type}
                        </Badge>
                        <Badge
                          className={cn(
                            "rounded-full",
                            question.skill_type === "Hard"
                              ? "bg-cyan-700 text-white hover:bg-cyan-700"
                              : "bg-amber-600 text-white hover:bg-amber-600",
                          )}
                        >
                          {question.skill_type}
                        </Badge>
                        <Badge className="rounded-full" variant="secondary">
                          {question.category}
                        </Badge>
                        <Badge className="rounded-full" variant="outline">
                          {question.skill_type === "Soft"
                            ? "Soft skill"
                            : question.type === "Resume-Based"
                              ? t.resumeStory
                              : t.jdProof}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-6">
                        Q{question.id}. {question.text}
                      </p>
                      <Button
                        className="mt-3 h-7 gap-1 px-2 text-xs"
                        onClick={() =>
                          setOpenRubrics((current) => {
                            const next = new Set(current);
                            if (next.has(question.id)) {
                              next.delete(question.id);
                            } else {
                              next.add(question.id);
                            }
                            return next;
                          })
                        }
                        type="button"
                        variant="outline"
                      >
                        <ClipboardListIcon className="size-3.5" />
                        {t.scoringRubric}
                        <ChevronDownIcon
                          className={cn(
                            "size-3.5 transition-transform",
                            rubricOpen ? "rotate-180" : "",
                          )}
                        />
                      </Button>
                      {rubricOpen ? (
                        <div className="mt-3 grid gap-1 border-t pt-3 text-xs leading-5 text-muted-foreground">
                          <p>
                            <strong className="text-foreground">{t.poor}</strong>{" "}
                            {question.rubric?.["1"]}
                          </p>
                          <p>
                            <strong className="text-foreground">{t.solid}</strong>{" "}
                            {question.rubric?.["3"]}
                          </p>
                          <p>
                            <strong className="text-foreground">{t.excellent}</strong>{" "}
                            {question.rubric?.["5"]}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
