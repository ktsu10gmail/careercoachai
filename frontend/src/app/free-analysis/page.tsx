"use client";

import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Upload,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";

import { AnalysisEvidenceDetails } from "@/components/AnalysisEvidenceDetails";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeResumePublic,
  login,
  optIntoTalentNetwork,
  type PublicAnalysis,
} from "@/lib/api";
import { APPLICANT_TOKEN_KEY, readToken, saveToken } from "@/lib/auth";
import { useCurrentLocale } from "@/lib/market";

const copy = {
  en: {
    publicBeta: "Back to Public Beta",
    createWorkspace: "Create your workspace",
    resume: "Resume",
    resumePlaceholder: "PDF or DOCX",
    targetPosition: "Target position",
    targetPlaceholder: "Backend engineer, product analyst...",
    jobDescription: "Job description",
    jdPlaceholder: "Paste the role requirements, responsibilities, and must-have skills.",
    showFit: "Show My Fit",
    privacyNote:
      "We save extracted career metadata as a private anonymous profile snapshot so CareerCoachAI can reconnect your analysis if you claim your profile. This does not opt you into employer discovery.",
    score: "AI Matching Score",
    mirrorReady: "Career mirror ready",
    strengths: "Competitive Edges",
    weaknesses: "Improve Before Applying",
    noStrengths: "No strengths returned.",
    noWeaknesses: "No weaknesses returned.",
    evidenceTitle: "Evidence-based analysis",
    confidence: "Confidence",
    breakdown: "Score breakdown",
    matchedRequirements: "Matched requirements",
    missingRequirements: "Missing or unclear",
    evidenceQuotes: "Evidence quotes",
    profilePreview: "Extracted Profile Preview",
    notProvided: "Not provided",
    notFound: "Not found",
    name: "Name",
    email: "Email",
    phone: "Phone",
    location: "Location",
    savedSnapshot:
      "Private anonymous profile snapshot saved. Talent Network discovery remains off until you opt in below.",
    unsavedSnapshot:
      "We could not save a private profile snapshot because the resume did not include enough contact metadata. You can still claim your profile below after verifying the fields.",
    claimedTitle: "Your CareerCoachAI profile is claimed.",
    claimedBody:
      "You are opted into the Talent Network. Your pre-vetted profile can now be suggested for better-fit roles.",
    claimedControl: "You stay in control and can update or delete your data from the applicant portal.",
    portal: "Go to Applicant Portal",
    optTitle: "Don't just apply once. Let your CareerCoachAI work for you 24/7.",
    optBody:
      "Claim your profile to keep improving your fit, practice interviews, and let matched roles find you.",
    optCards: [
      [
        "Interview Question Practice",
        "Master your next interview with 10 practice questions: 4 JD prompts, 3 resume prompts, and 3 soft-skill prompts.",
      ],
      [
        "Passive Match-Making",
        "Your pre-vetted profile can be suggested to top employers for roles that fit your skills.",
      ],
      [
        "Continuous Career Coaching",
        "Keep your data updated to receive ongoing insights as your experience grows.",
      ],
    ],
    optIn: "Opt-in to the Talent Network and let the best jobs find you.",
    optInPrivacy: "Your privacy is protected. You control your profile and can update or delete your data at any time.",
    verify: "Verify the profile details CareerCoachAI extracted, then create a password to claim your profile.",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    signInPortal: "Sign in to applicant portal",
    claim: "Claim My Profile",
    emptyTitle: "Your career mirror appears here.",
    emptyBody:
      "Upload a resume and paste a job description to see whether the role actually fits your experience before you apply.",
    emptyPreview: {
      score: "Resume-to-JD score",
      strengths: "Strengths worth emphasizing",
      gaps: "Gaps to improve before applying",
      questions: "10 practice questions",
      privacy: "Private until you opt in",
      ready: "What you get",
    },
    uploadResume: "Upload a PDF or DOCX resume.",
  },
  "zh-TW": {
    publicBeta: "回到 Public Beta",
    createWorkspace: "建立你的工作區",
    resume: "履歷",
    resumePlaceholder: "PDF 或 DOCX",
    targetPosition: "目標職稱",
    targetPlaceholder: "後端工程師、產品分析師、業務主管...",
    jobDescription: "職缺內容",
    jdPlaceholder: "貼上職缺要求、工作內容與必要技能。",
    showFit: "查看我的適配度",
    privacyNote:
      "我們會儲存擷取出的職涯資料作為私人匿名快照，方便你之後認領個人檔案。這不代表你已加入雇主搜尋。",
    score: "AI 適配分數",
    mirrorReady: "職涯分析已完成",
    strengths: "你的競爭優勢",
    weaknesses: "申請前可補強",
    noStrengths: "尚未回傳優勢分析。",
    noWeaknesses: "尚未回傳補強建議。",
    evidenceTitle: "證據式分析",
    confidence: "可信度",
    breakdown: "分數拆解",
    matchedRequirements: "符合的需求",
    missingRequirements: "缺少或不明確",
    evidenceQuotes: "證據摘錄",
    profilePreview: "擷取資料預覽",
    notProvided: "未提供",
    notFound: "未找到",
    name: "姓名",
    email: "Email",
    phone: "電話",
    location: "地點",
    savedSnapshot: "私人匿名檔案快照已儲存。你勾選加入前，Talent Network 不會開放雇主搜尋。",
    unsavedSnapshot:
      "履歷中的聯絡資料不足，因此無法儲存匿名檔案快照。你仍可確認下方欄位後認領個人檔案。",
    claimedTitle: "你的 CareerCoachAI 檔案已建立。",
    claimedBody: "你已加入 Talent Network。符合條件的職缺可以更容易找到你的預審檔案。",
    claimedControl: "你仍保有控制權，可在求職者入口更新或刪除資料。",
    portal: "前往求職者入口",
    optTitle: "不要只投一次履歷。讓 CareerCoachAI 持續替你準備機會。",
    optBody: "認領你的檔案，持續改善職缺適配度、練習面試，並讓更適合的職缺找到你。",
    optCards: [
      ["面試題練習", "用 10 題標準化題目準備面試：4 題職缺、3 題履歷、3 題軟技能。"],
      ["被動媒合機會", "你的預審檔案可被推薦給符合技能需求的雇主。"],
      ["持續職涯建議", "保持資料更新，隨著經驗成長取得後續建議。"],
    ],
    optIn: "加入 Talent Network，讓更適合的工作機會找到你。",
    optInPrivacy: "你的隱私會受到保護。你可以隨時更新或刪除自己的資料。",
    verify: "請確認 CareerCoachAI 擷取出的資料，並建立密碼來認領檔案。",
    password: "密碼",
    passwordPlaceholder: "至少 8 個字元",
    signInPortal: "登入求職者入口",
    claim: "認領我的檔案",
    emptyTitle: "你的職涯分析會顯示在這裡。",
    emptyBody: "上傳履歷並貼上職缺內容，在申請前先看這份工作是否真的適合你的經驗。",
    emptyPreview: {
      score: "履歷與職缺適配分數",
      strengths: "值得強調的優勢",
      gaps: "申請前可補強缺口",
      questions: "10 題面試練習",
      privacy: "勾選後才開放搜尋",
      ready: "你會得到",
    },
    uploadResume: "請上傳 PDF 或 DOCX 履歷。",
  },
} as const;

function readError(error: unknown) {
  if (!(error instanceof Error)) {
    return "Analysis failed.";
  }
  try {
    const parsed = JSON.parse(error.message) as { detail?: string };
    return parsed.detail || error.message;
  } catch {
    return error.message;
  }
}

function scoreTone(score: number) {
  if (score >= 75) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

function StrengthLine({ text }: { text: string }) {
  const splitAt = text.lastIndexOf(":");
  if (splitAt < 0 || splitAt >= text.length - 1) {
    return (
      <div className="border border-[#b8ddd2] bg-[#edf8f3] p-3 text-sm leading-6 text-[#24312c]">
        {text}
      </div>
    );
  }

  return (
    <div className="border border-[#b8ddd2] bg-[#edf8f3] p-3">
      <p className="text-xs font-semibold tracking-[0.12em] text-[#0b6b57] uppercase">
        Documented evidence
      </p>
      <p className="mt-1 text-sm leading-6 text-[#5d6e68]">
        {text.slice(0, splitAt + 1)}
      </p>
      <p className="mt-2 border-l-2 border-[#0b6b57] bg-white/90 py-2 pl-3 text-sm font-medium leading-6 text-[#183c34]">
        {text.slice(splitAt + 1).trim()}
      </p>
    </div>
  );
}

function WeaknessLine({ text }: { text: string }) {
  return (
    <div className="border border-[#efc7ad] bg-[#fff6ef] p-3 text-sm leading-6 text-[#43291d]">
      {text}
    </div>
  );
}

export default function FreeAnalysisPage() {
  const { locale, market } = useCurrentLocale();
  const t = copy[locale];
  const [resume, setResume] = useState<File | null>(null);
  const [targetPosition, setTargetPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<PublicAnalysis | null>(null);
  const [optInProfile, setOptInProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [password, setPassword] = useState("");
  const [talentNetworkOptIn, setTalentNetworkOptIn] = useState(false);
  const [optInError, setOptInError] = useState("");
  const [optInCandidateId, setOptInCandidateId] = useState<number | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [isOptingIn, setIsOptingIn] = useState(false);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResumeName, setAnalyzedResumeName] = useState("");
  const analysisRequestRef = useRef(0);

  const canSubmit = useMemo(
    () => Boolean(resume && jobDescription.trim().length >= 20 && !isAnalyzing),
    [resume, jobDescription, isAnalyzing],
  );

  const canOptIn = useMemo(
    () =>
      Boolean(
        analysis &&
          talentNetworkOptIn &&
          optInProfile.name.trim().length >= 2 &&
          optInProfile.email.trim().length >= 3 &&
          password.length >= 8 &&
          !isOptingIn,
      ),
    [
      analysis,
      talentNetworkOptIn,
      optInProfile.email,
      optInProfile.name,
      password,
      isOptingIn,
    ],
  );

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resume) {
      setError(t.uploadResume);
      return;
    }

    const requestId = analysisRequestRef.current + 1;
    analysisRequestRef.current = requestId;
    const submittedResume = resume;

    setError("");
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumePublic({
        resume: submittedResume,
        jobDescription,
        targetPosition,
        market,
        locale,
        host: window.location.host,
        token: readToken(APPLICANT_TOKEN_KEY),
      });
      if (analysisRequestRef.current !== requestId) {
        return;
      }
      setAnalysis(result);
      setAnalyzedResumeName(submittedResume.name);
      setOptInProfile({
        name: result.extracted_profile.name || "",
        email: result.extracted_profile.email || "",
        phone: result.extracted_profile.phone || "",
        address: result.extracted_profile.address || "",
      });
      setPassword("");
      setTalentNetworkOptIn(false);
      setOptInError("");
      setOptInCandidateId(null);
      setPortalReady(false);
    } catch (caught) {
      if (analysisRequestRef.current === requestId) {
        setAnalysis(null);
        setAnalyzedResumeName("");
        setError(readError(caught));
      }
    } finally {
      if (analysisRequestRef.current === requestId) {
        setIsAnalyzing(false);
      }
    }
  }

  async function handleOptIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!analysis) {
      return;
    }

    setOptInError("");
    setIsOptingIn(true);
    try {
      const result = await optIntoTalentNetwork({
        candidate_data: {
          name: optInProfile.name.trim(),
          email: optInProfile.email.trim(),
          phone: optInProfile.phone.trim() || null,
          address: optInProfile.address.trim() || null,
          searchable_title: targetPosition.trim() || null,
          experience: analysis.extracted_profile.experience,
          skills: analysis.extracted_profile.skills,
          education: analysis.extracted_profile.education,
        },
        password,
      });
      setOptInCandidateId(result.candidate_id);
      try {
        const token = await login(optInProfile.email.trim(), password);
        saveToken(APPLICANT_TOKEN_KEY, token.access_token);
        setPortalReady(true);
      } catch {
        setPortalReady(false);
      }
    } catch (caught) {
      setOptInError(readError(caught));
    } finally {
      setIsOptingIn(false);
    }
  }

  const profile = analysis?.extracted_profile;

  return (
    <AppShell
      eyebrow={locale === "zh-TW" ? "求職者免費分析" : "Applicant free analysis"}
      title={
        locale === "zh-TW"
          ? "申請前先確認這份工作是否適合。"
          : "Check your fit before you apply."
      }
      description={
        locale === "zh-TW"
          ? "上傳履歷、貼上職缺，取得履歷與職缺適配分數、證據、缺口與下一步建議。"
          : "Upload a resume, paste a job description, and get a resume-to-JD match score, evidence, gaps, and next steps."
      }
      actions={
        <>
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            {t.publicBeta}
          </Link>
          <Link className={buttonVariants()} href="/applicant/setup?next=/applicant/portal">
            {t.createWorkspace}
          </Link>
        </>
      }
      contentClassName="max-w-7xl"
    >
      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="grid self-start gap-4 rounded-md border bg-background p-4 shadow-sm">
          <div>
            <p className="text-lg font-semibold tracking-tight">{t.showFit}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {t.emptyBody}
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#24312c]">
                {t.resume}
              </span>
              <span className="flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-[#183c34]/35 bg-[#f4faf7] px-4 py-5 text-center transition hover:border-[#0b6b57] hover:bg-white">
                <Upload className="mb-2 size-5 text-[#0b6b57]" />
                <span className="text-sm font-medium text-[#24312c]">
                  {resume ? resume.name : t.resumePlaceholder}
                </span>
              </span>
              <input
                className="sr-only"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                disabled={isAnalyzing}
                onChange={(event) => {
                  setResume(event.target.files?.[0] ?? null);
                  setAnalysis(null);
                  setAnalyzedResumeName("");
                  setError("");
                }}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#24312c]">
                {t.targetPosition}
              </span>
              <Input
                value={targetPosition}
                onChange={(event) => {
                  setTargetPosition(event.target.value);
                  setAnalysis(null);
                  setAnalyzedResumeName("");
                }}
                className="rounded-none border-[#183c34]/25 bg-[#fbfffd] text-[#17201c] placeholder:text-[#61736d]"
                placeholder={t.targetPlaceholder}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#24312c]">
                {t.jobDescription}
              </span>
              <Textarea
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setAnalysis(null);
                  setAnalyzedResumeName("");
                  setError("");
                }}
                className="min-h-56 resize-none rounded-none border-[#183c34]/25 bg-[#fbfffd] text-[#17201c] placeholder:text-[#61736d]"
                placeholder={t.jdPlaceholder}
              />
            </label>

            {error ? (
              <div className="flex items-start gap-2 border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-11 w-full rounded-none bg-[#10251f] text-white hover:bg-[#0b6b57]"
            >
              {isAnalyzing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileText className="size-4" />
              )}
              {t.showFit}
            </Button>

            <p className="text-xs leading-5 text-[#61736d]">
              {t.privacyNote}
            </p>
          </form>
        </section>

        <section className="rounded-md border bg-background p-4 shadow-sm">
          {analysis ? (
            <div className="grid min-h-full content-between gap-8">
              <div className="flex items-start justify-between gap-5 border-b border-[#183c34]/15 pb-8">
                <div>
                  <p className="mb-2 text-sm font-semibold tracking-[0.16em] text-[#466058] uppercase">
                    {t.score}
                  </p>
                  {analyzedResumeName ? (
                    <p className="mb-3 max-w-[16rem] truncate text-xs font-medium text-[#61736d]">
                      {analyzedResumeName}
                    </p>
                  ) : null}
                  <div
                    className={`font-serif text-7xl leading-none font-semibold ${scoreTone(
                      analysis.match_score,
                    )}`}
                  >
                    {Math.round(analysis.match_score)}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 border border-[#0b6b57]/30 bg-[#cfe8df] px-3 py-2 text-sm font-medium text-[#0b6b57]">
                  <CheckCircle2 className="size-4" />
                  {t.mirrorReady}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-sm font-semibold tracking-[0.14em] text-[#0b6b57] uppercase">
                    {t.strengths}
                  </h2>
                  <div className="space-y-2">
                    {analysis.strengths.length ? (
                      analysis.strengths.map((item) => (
                        <StrengthLine key={item} text={item} />
                      ))
                    ) : (
                      <p className="text-sm text-[#61736d]">{t.noStrengths}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-sm font-semibold tracking-[0.14em] text-[#9b4d2e] uppercase">
                    {t.weaknesses}
                  </h2>
                  <div className="space-y-2">
                    {analysis.weaknesses.length ? (
                      analysis.weaknesses.map((item) => (
                        <WeaknessLine key={item} text={item} />
                      ))
                    ) : (
                      <p className="text-sm text-[#61736d]">{t.noWeaknesses}</p>
                    )}
                  </div>
                </div>
              </div>

              <AnalysisEvidenceDetails
                analysis={analysis}
                labels={{
                  title: t.evidenceTitle,
                  confidence: t.confidence,
                  breakdown: t.breakdown,
                  matches: t.matchedRequirements,
                  gaps: t.missingRequirements,
                  quotes: t.evidenceQuotes,
                }}
              />

              <div className="border border-[#183c34]/15 bg-[#fbfffd] p-4">
                <h2 className="mb-4 text-sm font-semibold tracking-[0.14em] text-[#466058] uppercase">
                  {t.profilePreview}
                </h2>
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-[#61736d]">{t.targetPosition}</dt>
                    <dd className="mt-1 text-[#17201c]">
                      {targetPosition.trim() || t.notProvided}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#61736d]">{t.name}</dt>
                    <dd className="mt-1 text-[#17201c]">{profile?.name || t.notFound}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#61736d]">{t.email}</dt>
                    <dd className="mt-1 text-[#17201c]">{profile?.email || t.notFound}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#61736d]">{t.phone}</dt>
                    <dd className="mt-1 text-[#17201c]">{profile?.phone || t.notFound}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#61736d]">{t.location}</dt>
                    <dd className="mt-1 text-[#17201c]">{profile?.address || t.notFound}</dd>
                  </div>
                </dl>

                {profile?.skills?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {profile.skills.slice(0, 14).map((skill) => (
                      <span
                        key={skill}
                        className="border border-[#183c34]/15 bg-[#dfeee8] px-2 py-1 text-xs font-medium text-[#24312c]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 border-t border-[#183c34]/10 pt-4 text-xs leading-5 text-[#61736d]">
                  {analysis.anonymous_candidate_id ? (
                    <span>
                      {t.savedSnapshot}
                    </span>
                  ) : (
                    <span>
                      {t.unsavedSnapshot}
                    </span>
                  )}
                </div>
              </div>

              <form
                onSubmit={handleOptIn}
                className="border border-[#0b6b57]/25 bg-[#e1f3ec] p-4"
              >
                {optInCandidateId ? (
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 size-5 shrink-0 text-[#0b6b57]" />
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-[#17201c]">
                        {t.claimedTitle}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#315f54]">
                        {t.claimedBody} Candidate ID: {optInCandidateId}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#315f54]">
                        {t.claimedControl}
                      </p>
                      <Link
                        className="mt-4 inline-flex h-10 items-center justify-center gap-2 border border-[#0b6b57] bg-[#0b6b57] px-4 text-sm font-semibold text-white transition hover:bg-[#10251f]"
                        href={
                          portalReady
                            ? "/applicant/portal"
                            : "/applicant/login?next=/applicant/portal"
                        }
                      >
                        {t.portal}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl font-semibold text-[#17201c]">
                          {t.optTitle}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-[#315f54]">
                          {t.optBody}
                        </p>
                      </div>
                      <UserPlus className="mt-1 size-5 shrink-0 text-[#0b6b57]" />
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                      {[
                        {
                          icon: BriefcaseBusiness,
                          title: t.optCards[0][0],
                          body: t.optCards[0][1],
                        },
                        {
                          icon: Clock3,
                          title: t.optCards[1][0],
                          body: t.optCards[1][1],
                        },
                        {
                          icon: Eye,
                          title: t.optCards[2][0],
                          body: t.optCards[2][1],
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="border border-[#0b6b57]/20 bg-[#fbfffd] p-3"
                        >
                          <item.icon className="mb-2 size-4 text-[#0b6b57]" />
                          <p className="text-sm font-semibold text-[#17201c]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#315f54]">
                            {item.body}
                          </p>
                        </div>
                      ))}
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 border border-[#0b6b57]/25 bg-[#fbfffd] p-3">
                      <Checkbox
                        checked={talentNetworkOptIn}
                        onCheckedChange={(checked) =>
                          setTalentNetworkOptIn(checked === true)
                        }
                        className="mt-1 border-[#0b6b57]/50 data-checked:border-[#0b6b57] data-checked:bg-[#0b6b57]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[#17201c]">
                          {t.optIn}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[#315f54]">
                          {t.optInPrivacy}
                        </span>
                      </span>
                    </label>

                    {talentNetworkOptIn ? (
                      <div className="mt-4 border border-[#0b6b57]/20 bg-[#f4faf7] p-4">
                        <div className="mb-3 flex items-start gap-2">
                          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[#0b6b57]" />
                          <p className="text-sm leading-6 text-[#315f54]">
                            {t.verify}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold text-[#315f54]">
                              {t.name}
                            </span>
                            <Input
                              value={optInProfile.name}
                              onChange={(event) =>
                                setOptInProfile((current) => ({
                                  ...current,
                                  name: event.target.value,
                                }))
                              }
                              className="rounded-none border-[#0b6b57]/25 bg-[#fbfffd]"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold text-[#315f54]">
                              {t.email}
                            </span>
                            <Input
                              type="email"
                              value={optInProfile.email}
                              onChange={(event) =>
                                setOptInProfile((current) => ({
                                  ...current,
                                  email: event.target.value,
                                }))
                              }
                              className="rounded-none border-[#0b6b57]/25 bg-[#fbfffd]"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold text-[#315f54]">
                              {t.phone}
                            </span>
                            <Input
                              value={optInProfile.phone}
                              onChange={(event) =>
                                setOptInProfile((current) => ({
                                  ...current,
                                  phone: event.target.value,
                                }))
                              }
                              className="rounded-none border-[#0b6b57]/25 bg-[#fbfffd]"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold text-[#315f54]">
                              {t.location}
                            </span>
                            <Input
                              value={optInProfile.address}
                              onChange={(event) =>
                                setOptInProfile((current) => ({
                                  ...current,
                                  address: event.target.value,
                                }))
                              }
                              className="rounded-none border-[#0b6b57]/25 bg-[#fbfffd]"
                            />
                          </label>
                        </div>

                        <label className="mt-3 block">
                          <span className="mb-1 block text-xs font-semibold text-[#315f54]">
                            {t.password}
                          </span>
                          <Input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="rounded-none border-[#0b6b57]/25 bg-[#fbfffd]"
                            placeholder={t.passwordPlaceholder}
                          />
                        </label>
                      </div>
                    ) : null}

                    {optInError ? (
                      <div className="mt-3 border border-rose-300 bg-rose-50 px-3 py-3 text-sm text-rose-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 size-4 shrink-0" />
                          <span>{optInError}</span>
                        </div>
                        <Link
                          className="mt-3 inline-flex h-9 items-center justify-center border border-rose-300 bg-white px-3 text-sm font-semibold text-rose-900 transition hover:border-rose-400 hover:bg-rose-100"
                          href="/applicant/login?next=/applicant/portal"
                        >
                          {t.signInPortal}
                        </Link>
                      </div>
                    ) : null}

                    <Button
                      type="submit"
                      disabled={!canOptIn}
                      className="mt-4 h-10 w-full rounded-none bg-[#0b6b57] text-white hover:bg-[#10251f]"
                    >
                      {isOptingIn ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="size-4" />
                      )}
                      {t.claim}
                    </Button>
                  </>
                )}
              </form>
            </div>
          ) : (
            <div className="grid min-h-96 place-items-center text-center">
              <div>
                <FileText className="mx-auto size-8 text-slate-700" />
                <p className="mt-4 font-semibold">{t.emptyTitle}</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {t.emptyBody}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
