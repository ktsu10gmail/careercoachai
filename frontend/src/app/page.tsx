import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import {
  ArrowRightIcon,
  Building2Icon,
  CheckCircle2Icon,
  FileTextIcon,
  FileQuestionIcon,
  GaugeIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  SendIcon,
  SparklesIcon,
  TargetIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from "lucide-react";
import { AppShell, AppTopNav, Panel } from "@/components/AppShell";
import { LocalizedText } from "@/components/LocalizedText";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { applicantKeywords, siteName, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function isAgencyHost(host: string | null) {
  return process.env.FRONTEND_PORT === "4001" || host?.split(":").at(-1) === "4001";
}

function isApplicantHost(host: string | null) {
  const hostname = host?.split(":")[0]?.toLowerCase();
  return (
    process.env.FRONTEND_PORT === "5001" ||
    host?.split(":").at(-1) === "5001" ||
    hostname === "careercoachai.jetta.com"
  );
}

function isTaiwanHost(host: string | null) {
  return host?.toLowerCase().startsWith("tw.") ?? false;
}

function publicHostFromHeaders(headerList: Headers) {
  return (
    headerList.get("x-ccai-public-host") ||
    headerList.get("x-forwarded-host") ||
    headerList.get("host")
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = publicHostFromHeaders(headerList);

  if (isApplicantHost(host)) {
    const taiwanMode = isTaiwanHost(host);
    return {
      title: taiwanMode
        ? "CareerCoachAI 台灣 | 免費 AI 履歷與職缺適配分析"
        : "Free AI Career Coach for Better-Fit Job Applications",
      description: taiwanMode
        ? "CareerCoachAI 幫台灣求職者免費分析履歷與職缺適配度，提供優勢、缺口與面試準備建議。"
        : "Stop blindly applying into a black hole. CareerCoachAI helps applicants get a free AI resume-to-job match score, coaching insights, 10 focused practice questions, and optional Talent Network discovery.",
      keywords: applicantKeywords,
      alternates: {
        canonical: siteUrl("/"),
      },
      openGraph: {
        type: "website",
        siteName,
        url: siteUrl("/"),
        title: taiwanMode
          ? "CareerCoachAI 台灣 | 免費 AI 求職顧問"
          : "CareerCoachAI | Free AI Career Coach",
        description: taiwanMode
          ? "免費取得履歷與職缺適配分數、優勢缺口分析與面試準備建議。"
          : "Get a free AI resume match score, coaching insights, and 10 focused practice questions with JD, resume, and soft-skill prompts.",
      },
      twitter: {
        card: "summary_large_image",
        title: taiwanMode
          ? "CareerCoachAI 台灣 | 免費 AI 求職顧問"
          : "CareerCoachAI | Free AI Career Coach",
        description: taiwanMode
          ? "在申請前先確認職缺是否真的符合你的經驗。"
          : "Apply to jobs that better fit your experience with free AI resume analysis and career coaching.",
      },
    };
  }

  if (isAgencyHost(host)) {
    return {
      title: "Recruiting Agency Workspace",
      description:
        "Manage client companies, candidates, matches, submissions, and recruiter performance in CareerCoachAI.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Direct Hiring Workspace",
    description:
      "Create jobs, review applicants, schedule interviews, and manage hiring decisions in CareerCoachAI.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Home() {
  const headerList = await headers();
  const host = publicHostFromHeaders(headerList);
  const agencyMode = isAgencyHost(host);
  const applicantMode = isApplicantHost(host);

  if (applicantMode) {
    return (
      <main className="min-h-screen bg-[#f8faf8] text-slate-950">
        <AppTopNav />

        <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#f8faf8_0%,#edf7f2_46%,#e8f2ff_100%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <Badge className="mb-5 w-fit rounded-full bg-slate-950 text-white hover:bg-slate-950">
                <LocalizedText en="Public beta" zh="台灣求職者免費使用" />
              </Badge>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                <LocalizedText
                  en="Meet your personal CareerCoachAI."
                  zh="讓 CareerCoachAI 幫你看懂這份工作適不適合。"
                />
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-650">
                <LocalizedText
                  en="Stop blindly applying into a black hole. CareerCoachAI helps you understand your fit, improve your profile, and apply to jobs that better fit your experiences, for free."
                  zh="上傳履歷、貼上職缺，立即取得 AI 適配分數、優勢缺口分析與面試準備建議。適合台灣求職者先確認方向，再決定是否申請。"
                />
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className={cn(buttonVariants(), "gap-2 bg-slate-950 hover:bg-slate-800")} href="/free-analysis">
                  <LocalizedText
                    en="Get free CareerCoachAI analysis"
                    zh="開始免費分析"
                  />
                  <ArrowRightIcon className="size-4" />
                </Link>
                <Link className={cn(buttonVariants({ variant: "outline" }), "gap-2 bg-white/75")} href="/hiring-manager-preview">
                  <LocalizedText en="Hiring manager preview" zh="招募主管預覽" />
                  <FileQuestionIcon className="size-4" />
                </Link>
              </div>
            </div>

            <div className="hidden content-end lg:grid">
              <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
                <div className="grid grid-cols-[1fr_auto] items-start gap-5 border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-200">
                      <LocalizedText en="Career mirror dossier" zh="職涯鏡像分析檔" />
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight">
                      <LocalizedText en="Evidence before you apply" zh="申請前先看證據" />
                    </h2>
                  </div>
                  <div className="grid min-w-24 justify-items-end">
                    <p className="text-xs text-slate-400">
                      <LocalizedText en="Match score" zh="適配分數" />
                    </p>
                    <div className="mt-1 flex items-end gap-1">
                      <span className="text-5xl font-semibold leading-none tracking-tight">82</span>
                      <span className="pb-1 text-sm font-medium text-slate-400">/100</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-5 flex flex-wrap gap-2">
                    {[
                      ["JD cleaned", "職缺已清理"],
                      ["Evidence locked", "證據已鎖定"],
                      ["Talent Network off", "Talent Network 未開啟"],
                    ].map(([label, zhLabel]) => (
                      <span
                        className="inline-flex h-7 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600"
                        key={label}
                      >
                        <CheckCircle2Icon className="size-3.5 text-teal-700" />
                        <LocalizedText en={label} zh={zhLabel} />
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-[8rem_1fr] gap-5">
                    <div className="border-r border-slate-200 pr-5">
                      <div className="grid gap-4">
                        {[
                          ["Must-have", "90", "必備條件"],
                          ["Tools fit", "84", "工具適配"],
                          ["Evidence", "76", "證據品質"],
                        ].map(([label, value, zhLabel]) => (
                          <div key={label}>
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-500">
                                <LocalizedText en={label} zh={zhLabel} />
                              </p>
                              <p className="text-sm font-semibold text-slate-950">{value}</p>
                            </div>
                            <div className="mt-1.5 h-1.5 rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-teal-700"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="grid gap-4">
                        <div>
                          <div className="mb-2 flex items-center gap-2 text-teal-900">
                            <CheckCircle2Icon className="size-4" />
                            <p className="text-sm font-semibold">
                              <LocalizedText en="Matched evidence" zh="已匹配證據" />
                            </p>
                          </div>
                          <div className="grid gap-2">
                            {[
                              ["Python + API platform delivery", "Python 與 API 平台交付"],
                              ["PostgreSQL, Docker, production ownership", "PostgreSQL、Docker、產品環境維運"],
                            ].map(([label, zhLabel]) => (
                              <div className="border-l-2 border-teal-700 bg-teal-50 px-3 py-2 text-sm text-teal-950/80" key={label}>
                                <LocalizedText en={label} zh={zhLabel} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex items-center gap-2 text-amber-950">
                            <TargetIcon className="size-4" />
                            <p className="text-sm font-semibold">
                              <LocalizedText en="Clarify before applying" zh="申請前補強" />
                            </p>
                          </div>
                          <div className="border-l-2 border-amber-500 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950/80">
                            <LocalizedText
                              en="Add one measurable incident, architecture, or scaling example."
                              zh="補上一個可量化的事故、架構或擴展案例。"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 rounded-md border border-slate-200 bg-slate-50 text-center">
                    {[
                      ["4", "JD prompts", "職缺題"],
                      ["3", "Resume prompts", "履歷題"],
                      ["3", "Soft skills", "軟技能"],
                    ].map(([value, label, zhLabel]) => (
                      <div className="px-3 py-3" key={label}>
                        <p className="text-2xl font-semibold text-slate-950">{value}</p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          <LocalizedText en={label} zh={zhLabel} />
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <LockKeyholeIcon className="size-3.5" />
                      <LocalizedText en="Private until you opt in" zh="勾選前保持私人" />
                    </span>
                    <span className="font-semibold text-teal-700">
                      <LocalizedText en="Ready in under a minute" zh="一分鐘內完成" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hidden" id="applicants">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Panel className="border-slate-200 bg-white">
              <div className="flex min-h-80 flex-col justify-between gap-8">
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <Badge className="rounded-full">
                      <LocalizedText en="For applicants" zh="給求職者" />
                    </Badge>
                    <span className="grid size-11 place-items-center rounded-md border bg-emerald-50 text-emerald-700">
                      <SparklesIcon className="size-5" />
                    </span>
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    <LocalizedText
                      en="Stop blindly applying into a black hole."
                      zh="申請前，先知道這份工作是否真的適合你。"
                    />
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                    <LocalizedText
                      en="Upload your resume, paste a target JD, and get an instant technical fit score, strength and weakness analysis, and coaching advice. Claim your profile when you want the Talent Network to let better-fit roles find you."
                      zh="上傳履歷、貼上目標職缺，立即取得技術適配分數、優勢缺口分析與求職建議。準備好時，也可以認領檔案加入 Talent Network。"
                    />
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link className={buttonVariants()} href="/free-analysis">
                    <LocalizedText
                      en="Run free CareerCoachAI analysis"
                      zh="開始免費 CareerCoachAI 分析"
                    />
                  </Link>
                  <Link
                    className={cn(buttonVariants({ variant: "outline" }))}
                    href="/applicant/setup"
                  >
                    <LocalizedText en="Create account" zh="建立帳號" />
                  </Link>
                </div>
              </div>
            </Panel>

            <div className="grid gap-5">
              {[
                {
                  id: "career-mirror",
                  icon: UserRoundCheckIcon,
                  title: "Career Mirror",
                  description: "Review your extracted profile, strengths, weaknesses, and concrete next steps before you apply.",
                },
                {
                  id: "resume-match",
                  icon: TargetIcon,
                  title: "Resume-to-JD Match",
                  description: "Apply to jobs that better fit your experiences by comparing each JD against your resume evidence.",
                },
                {
                  id: "guide",
                  icon: ListChecksIcon,
                  title: "24/7 CareerCoachAI",
                  description: "Practice 10 focused questions: 4 JD prompts, 3 resume prompts, and 3 soft-skill prompts.",
                },
              ].map(({ id, icon: Icon, title, description }) => (
                <Panel className="border-slate-200 bg-white" key={id}>
                  <div className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-muted">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-semibold">{title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden" id="hiring-managers">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge className="mb-3 rounded-full" variant="secondary">
                  <LocalizedText en="For hiring managers" zh="給招募主管" />
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight">
                  <LocalizedText
                    en="Start with a free pre-screening preview. Continue into Auto Mediator when applicants answer."
                    zh="先用免費預篩預覽，再把求職者答題帶進 Auto Mediator。"
                  />
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                  <LocalizedText
                    en="The public tool gives HR a useful mini-workflow right away: paste a JD, upload a resume, see fit evidence, and generate focused interview questions. When you want answer scores from applicants, create a free hiring workspace and send them the job link."
                    zh="公開工具可以先讓 HR 完成一個實用的小流程：貼上 JD、上傳履歷、查看適配證據，並產生有焦點的面試問題。當你需要求職者答題分數時，再建立免費招募工作區並寄出職缺連結。"
                  />
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <ShieldCheckIcon className="size-4 text-teal-700" />
                <LocalizedText en="Temporary upload, private preview" zh="暫時上傳，私人預覽" />
              </div>
            </div>
            <div className="mb-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border bg-white text-slate-900">
                    <FileQuestionIcon className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold">
                      <LocalizedText en="Public pre-screening tool" zh="公開預篩工具" />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      <LocalizedText
                        en="A no-account preview for resume/JD fit, probe gaps, and interview questions."
                        zh="不需帳號，先取得履歷 / JD 適配、追問缺口與面試問題。"
                      />
                    </p>
                  </div>
                </div>
              </div>
              <Link
                className="rounded-md border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-100/70 hover:shadow-sm"
                href="/employer/setup?type=employer&source=hm"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-emerald-200 bg-white text-emerald-800">
                    <SendIcon className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-emerald-950">
                      <LocalizedText en="Free Auto Mediator workspace" zh="免費 Auto Mediator 工作區" />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-950/75">
                      <LocalizedText
                        en="Create a job link, invite applicants, collect answer scores, and compare candidates."
                        zh="建立職缺連結、邀請求職者、收集答題分數，並比較候選人。"
                      />
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="hidden">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge className="mb-3 rounded-full bg-slate-950 text-white hover:bg-slate-950">
                <LocalizedText en="Automated Mediator engine" zh="自動化評估引擎" />
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight">
                <LocalizedText
                  en="Built to evaluate evidence, not just keywords."
                  zh="評估的是證據，不只是關鍵字。"
                />
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                <LocalizedText
                  en="The V4 assessment turns resume data, job requirements, and applicant answers into a structured evaluation system. The public HM preview handles resume-to-JD evidence and question generation. The free workspace adds the job URL, applicant accounts, answer scores, and candidate comparison."
                  zh="V4 評估會把履歷資料、職缺要求與求職者回答整合成結構化評估系統。公開 HM 預覽先處理履歷 / JD 證據與題目產生；免費工作區再加入職缺連結、求職者帳號、答題分數與候選人比較。"
                />
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  id: "interview-guide",
                  icon: ListChecksIcon,
                  title: <LocalizedText en="Intentional interview guide" zh="結構化面試指南" />,
                  description: (
                    <LocalizedText
                      en="A complete public mini-workflow with 4 JD prompts, 3 resume prompts, and 3 soft-skill prompts."
                      zh="完整的公開小流程：4 題職缺、3 題履歷、3 題軟技能。"
                    />
                  ),
                },
                {
                  id: "pre-screening",
                  icon: GaugeIcon,
                  title: <LocalizedText en="Pre-screening preview" zh="預篩分析預覽" />,
                  description: (
                    <LocalizedText
                      en="Resume-to-JD match evidence and gaps to probe before applicant answer scoring is available."
                      zh="在尚未取得求職者答題分數前，先看到履歷與職缺適配證據，以及需要追問的缺口。"
                    />
                  ),
                },
                {
                  id: "rubrics",
                  icon: ShieldCheckIcon,
                  title: <LocalizedText en="Workspace answer scores" zh="工作區答題分數" />,
                  description: (
                    <LocalizedText
                      en="After HR sends the job URL, applicants answer through their account and the workspace can show scored responses."
                      zh="HR 寄出職缺連結後，求職者透過帳號回答問題，工作區即可呈現答題評分。"
                    />
                  ),
                },
              ].map(({ id, icon: Icon, title, description }) => (
                <Panel className="border-slate-200 bg-white" key={id}>
                  <div>
                    <span className="grid size-10 place-items-center rounded-md border bg-muted">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden" id="tools">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
                {
                  id: "free-analysis",
                  icon: FileTextIcon,
                  title: <LocalizedText en="Free analysis" zh="免費分析" />,
                  description: (
                    <LocalizedText
                      en="Fast resume-to-JD score before creating an account."
                      zh="建立帳號前，先快速取得履歷與職缺適配分數。"
                    />
                  ),
                  href: "/free-analysis",
                  cta: <LocalizedText en="Run free resume match" zh="開始免費履歷比對" />,
                },
                {
                  id: "applicant-portal",
                  icon: UserRoundCheckIcon,
                  title: <LocalizedText en="Applicant portal" zh="求職者入口" />,
                  description: (
                    <LocalizedText
                      en="Save your resume, profile, matches, and practice answers."
                      zh="儲存履歷、個人檔案、適配結果與練習回答。"
                    />
                  ),
                  href: "/applicant/login",
                  cta: <LocalizedText en="Open applicant portal" zh="開啟求職者入口" />,
                },
                {
                  id: "interview-planner",
                  icon: FileQuestionIcon,
                  title: <LocalizedText en="HM pre-screening" zh="HM 預篩工具" />,
                  description: (
                    <LocalizedText
                      en="Use the public HM tool above, then create a free workspace when you need applicant answer scores."
                      zh="先使用上方公開 HM 工具；需要求職者答題分數時，再建立免費工作區。"
                    />
                  ),
                  href: "#hiring-managers",
                  cta: <LocalizedText en="Open HM tool" zh="開啟 HM 工具" />,
                },
                {
                  id: "auto-mediator-workspace",
                  icon: Building2Icon,
                  title: (
                    <LocalizedText
                      en="Create Auto Mediator Workspace"
                      zh="建立 Auto Mediator 工作區"
                    />
                  ),
                  description: (
                    <LocalizedText
                      en="HR/HM signs up to create job links, invite applicants, and review answer scores."
                      zh="HR / HM 註冊後，可建立職缺連結、邀請求職者，並查看答題分數。"
                    />
                  ),
                  href: "/employer/setup?type=employer&source=hm",
                  cta: <LocalizedText en="Create workspace" zh="建立工作區" />,
                  fullCardLink: true,
                },
              ].map(({ id, icon: Icon, title, description, href, cta, fullCardLink }) => (
                <Panel
                  className={cn(
                    "relative border-slate-200 bg-white",
                    fullCardLink
                      ? "transition hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow-sm"
                      : "",
                  )}
                  key={id}
                >
                  {fullCardLink ? (
                    <Link
                      aria-label="Create Auto Mediator Workspace"
                      className="absolute inset-0 z-10 rounded-lg"
                      href={href}
                    />
                  ) : null}
                  <div className="flex min-h-52 flex-col justify-between gap-5">
                    <div>
                      <span className="grid size-10 place-items-center rounded-md border bg-muted">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-4 font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    {fullCardLink ? (
                      <span
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "w-fit border-emerald-300 bg-white text-emerald-900",
                        )}
                      >
                        {cta}
                      </span>
                    ) : (
                      <Link
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
                        href={href}
                      >
                        {cta}
                      </Link>
                    )}
                  </div>
                </Panel>
              ))}
          </div>
        </section>

        <section className="hidden">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-teal-200">
                <LocalizedText en="For applicants" zh="給求職者" />
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                <LocalizedText
                  en="Don't just apply once. Let your CareerCoachAI work for you 24/7."
                  zh="不要只投一次履歷。讓 CareerCoachAI 持續替你準備機會。"
                />
              </p>
              <p className="mt-3 leading-7 text-slate-300">
                <LocalizedText
                  en="Get a free AI analysis of your fit, verify your profile, and opt into the Talent Network so better-fit roles can find you."
                  zh="免費取得職缺適配分析，確認個人檔案，並選擇加入 Talent Network，讓更適合的機會找到你。"
                />
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-teal-200">
                <LocalizedText en="For hiring managers" zh="給招募主管" />
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                <LocalizedText
                  en="End the last-minute interview panic."
                  zh="結束面試前一刻才開始慌張。"
                />
              </p>
              <p className="mt-3 leading-7 text-slate-300">
                <LocalizedText
                  en="Use the public pre-screening tool now, then create a free workspace to send job links and collect applicant answer scores."
                  zh="現在先使用公開預篩工具；接著建立免費工作區，寄出職缺連結並收集求職者答題分數。"
                />
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (agencyMode) {
    return (
      <AppShell
        eyebrow="Recruiting agency"
        title="Recruiting agency workspace."
        description="Sign in to manage clients, candidates, matches, submissions, and recruiter performance."
        actions={
          <>
            <Link className={buttonVariants()} href="/employer/login">
              Agency sign in
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/employer/setup?type=agency"
            >
              Create agency workspace
            </Link>
          </>
        }
        contentClassName="max-w-5xl"
      >
        <Panel>
          <div className="flex min-h-72 flex-col justify-between gap-8">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <Badge>Agency portal</Badge>
                <span className="grid size-11 place-items-center rounded-md border bg-muted">
                  <UsersRoundIcon className="size-5" />
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Built for client-company recruiting.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Use this entry for recruiting agencies. Applicants should use the
                specific job link they receive from the agency.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className={buttonVariants()} href="/employer/login">
                Sign in
              </Link>
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href="/employer/setup?type=agency"
              >
                Create workspace
              </Link>
            </div>
          </div>
        </Panel>

        <div className="mt-5 rounded-md border bg-card p-4 text-sm leading-6 text-muted-foreground">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <SparklesIcon className="mt-0.5 size-4 shrink-0 text-emerald-700" />
              <p>
                Candidates can run a free resume-to-job analysis before creating
                an account.
              </p>
            </div>
            <Link
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
              href="/free-analysis"
            >
              Free analysis
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Employer"
      title="Direct hiring workspace."
      description="Sign in to create jobs, review applicants, schedule interviews, and manage hiring decisions."
      actions={
        <>
          <Link className={buttonVariants()} href="/employer/login">
            Employer sign in
          </Link>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/employer/setup?type=employer"
          >
            Create employer workspace
          </Link>
        </>
      }
      contentClassName="max-w-5xl"
    >
      <Panel>
        <div className="flex min-h-72 flex-col justify-between gap-8">
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <Badge>Employer portal</Badge>
              <span className="grid size-11 place-items-center rounded-md border bg-muted">
                <Building2Icon className="size-5" />
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Built for in-house hiring teams.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Use this entry for direct hiring companies. Applicants should use the
              specific job link posted on your job site or shared by your team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonVariants()} href="/employer/login">
              Sign in
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "outline" }))}
              href="/employer/setup?type=employer"
            >
              Create workspace
            </Link>
          </div>
        </div>
      </Panel>

      <div className="mt-5 rounded-md border bg-card p-4 text-sm leading-6 text-muted-foreground">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <SparklesIcon className="mt-0.5 size-4 shrink-0 text-emerald-700" />
            <p>
              Candidates can run a free resume-to-job analysis before creating
              an account.
            </p>
          </div>
          <Link
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
            href="/free-analysis"
          >
            Free analysis
          </Link>
        </div>
      </div>

      <div className="mt-5 rounded-md border bg-card p-4 text-sm leading-6 text-muted-foreground">
        <div className="flex items-start gap-3">
          <SendIcon className="mt-0.5 size-4 shrink-0" />
          <p>
            Applicant flow starts from a job URL. The URL identifies the job, and
            the backend uses that job to connect the application to the correct
            company or agency client context.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
