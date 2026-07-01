"use client";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  GaugeIcon,
  QuoteIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PublicAnalysis } from "@/lib/api";
import { cn } from "@/lib/utils";

type AnalysisEvidenceDetailsProps = {
  analysis: Pick<
    PublicAnalysis,
    | "score_breakdown"
    | "requirement_matches"
    | "missing_requirements"
    | "evidence_quotes"
    | "confidence_level"
    | "confidence_reason"
  >;
  compact?: boolean;
  labels?: {
    title?: string;
    confidence?: string;
    breakdown?: string;
    matches?: string;
    gaps?: string;
    quotes?: string;
    noDetails?: string;
  };
};

const defaultLabels = {
  title: "Evidence-based analysis",
  confidence: "Confidence",
  breakdown: "Score breakdown",
  matches: "Matched requirements",
  gaps: "Missing or unclear",
  quotes: "Evidence quotes",
  noDetails: "Detailed analysis will appear after the next match run.",
};

function toneForLevel(level?: string) {
  if (level === "high") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (level === "low") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }
  return "border-cyan-200 bg-cyan-50 text-cyan-800";
}

function toneForScore(score: number) {
  if (score >= 75) return "bg-emerald-600";
  if (score >= 55) return "bg-cyan-600";
  if (score >= 35) return "bg-amber-500";
  return "bg-rose-500";
}

export function AnalysisEvidenceDetails({
  analysis,
  compact = false,
  labels,
}: AnalysisEvidenceDetailsProps) {
  const t = { ...defaultLabels, ...labels };
  const breakdown = analysis.score_breakdown ?? [];
  const matches = analysis.requirement_matches ?? [];
  const missing = analysis.missing_requirements ?? [];
  const quotes = analysis.evidence_quotes ?? [];
  const hasDetails = breakdown.length || matches.length || missing.length || quotes.length;
  const confidence = (analysis.confidence_level || "medium").toLowerCase();

  if (!hasDetails) {
    return (
      <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
        {t.noDetails}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", compact ? "text-sm" : "")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <ShieldCheckIcon className="size-4 text-emerald-700" />
            {t.title}
          </h3>
          {analysis.confidence_reason ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {analysis.confidence_reason}
            </p>
          ) : null}
        </div>
        <Badge className={cn("w-fit rounded-full border", toneForLevel(confidence))}>
          {t.confidence}: {confidence}
        </Badge>
      </div>

      {breakdown.length ? (
        <section className="rounded-md border bg-background/80 p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <GaugeIcon className="size-4 text-cyan-700" />
            {t.breakdown}
          </h4>
          <div className="grid gap-3">
            {breakdown.slice(0, 5).map((item) => (
              <div className="grid gap-1" key={item.category}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="font-semibold">{Math.round(item.score)}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", toneForScore(item.score))}
                    style={{ width: `${Math.max(4, Math.min(100, item.score))}%` }}
                  />
                </div>
                {item.reason ? (
                  <p className="text-xs leading-5 text-muted-foreground">{item.reason}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {matches.length ? (
          <section className="rounded-md border bg-background/80 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2Icon className="size-4 text-emerald-600" />
              {t.matches}
            </h4>
            <div className="grid gap-3">
              {matches.slice(0, compact ? 3 : 6).map((item) => (
                <div className="rounded-md border bg-muted/15 p-3" key={item.requirement}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.requirement}</p>
                    <Badge className="rounded-full" variant="secondary">
                      {item.strength}
                    </Badge>
                  </div>
                  {item.evidence.length ? (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.evidence[0]}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {missing.length ? (
          <section className="rounded-md border bg-background/80 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <AlertTriangleIcon className="size-4 text-amber-600" />
              {t.gaps}
            </h4>
            <div className="grid gap-3">
              {missing.slice(0, compact ? 3 : 6).map((item) => (
                <div className="rounded-md border bg-muted/15 p-3" key={item.requirement}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.requirement}</p>
                    <Badge className="rounded-full" variant="outline">
                      {item.severity}
                    </Badge>
                  </div>
                  {item.reason ? (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.reason}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {quotes.length ? (
        <section className="rounded-md border bg-background/80 p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <QuoteIcon className="size-4 text-slate-700" />
            {t.quotes}
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {quotes.slice(0, compact ? 2 : 4).map((item) => (
              <blockquote
                className="rounded-md border-l-2 border-slate-800 bg-muted/15 px-3 py-2 text-sm leading-6"
                key={`${item.source}-${item.quote}`}
              >
                <p>{item.quote}</p>
                <footer className="mt-2 text-xs text-muted-foreground">
                  {item.source}
                  {item.supports ? ` / ${item.supports}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
