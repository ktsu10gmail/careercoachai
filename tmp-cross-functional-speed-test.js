const { openAsBlob } = require("fs");
const { writeFile } = require("fs/promises");
const { execFileSync } = require("child_process");
const path = require("path");

const root = "/home/ksu/recruit-system";
const apiBase = "http://localhost:8000";
const resumePath = path.join(root, "tmp-applicant-playwright-resume.txt");
const jobUrl = process.env.CROSS_JOB_URL || "sim-senior-backend-engineer-2";
const runId = Date.now();
const applicantEmail = `cross.speed.${runId}@example.com`;
const applicantPassword = "Playwright123!";

function serviceToken(userId) {
  return execFileSync(
    "docker",
    [
      "compose",
      "exec",
      "-T",
      "web",
      "python",
      "-c",
      `from datetime import timedelta; from app.services.auth_service import create_access_token; print(create_access_token("${userId}", timedelta(days=2)))`,
    ],
    { cwd: root, encoding: "utf8" },
  ).trim();
}

async function api(pathname, options = {}) {
  const response = await fetch(`${apiBase}${pathname}`, options);
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${pathname} failed ${response.status}: ${text}`);
  }
  return data;
}

async function timed(label, fn, timings) {
  const start = performance.now();
  const result = await fn();
  const seconds = Number(((performance.now() - start) / 1000).toFixed(2));
  timings.push({ step: label, seconds });
  console.log(`${label}: ${seconds}s`);
  return result;
}

async function login(email, password) {
  const body = new URLSearchParams({ username: email, password });
  const data = await api("/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return data.access_token;
}

async function main() {
  const timings = [];
  const hrToken = serviceToken(8);
  const hmToken = serviceToken(9);

  const job = await timed("Load public job", () => api(`/jobs/${encodeURIComponent(jobUrl)}`), timings);
  const questions = await timed(
    "Load job questions",
    () => api(`/jobs/${encodeURIComponent(job.job_url)}/questions`),
    timings,
  );

  await timed(
    "Applicant signup",
    () =>
      api("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Speed Test Applicant",
          email: applicantEmail,
          password: applicantPassword,
          role: "Applicant",
        }),
      }),
    timings,
  );
  const applicantToken = await timed(
    "Applicant login",
    () => login(applicantEmail, applicantPassword),
    timings,
  );

  const applicationPayload = {
    job_id: job.id,
    answers: questions.map((question, index) => ({
      question_id: question.id,
      answer_text:
        `Speed test answer ${index + 1}: I handled production APIs, debugging, stakeholder communication, ` +
        "documentation, testing, and release ownership with specific examples from backend workflow systems.",
    })),
  };
  const form = new FormData();
  form.append("application_in", JSON.stringify(applicationPayload));
  form.append("resume", await openAsBlob(resumePath, { type: "text/plain" }), "speed-test-resume.txt");

  const application = await timed(
    "Applicant submit + AI scoring",
    () =>
      api("/applications", {
        method: "POST",
        headers: { Authorization: `Bearer ${applicantToken}` },
        body: form,
      }),
    timings,
  );

  await timed(
    "HR list scored application",
    () =>
      api(`/hr/jobs/${application.job_id}/applications`, {
        headers: { Authorization: `Bearer ${hrToken}` },
      }),
    timings,
  );

  const prequalified = await timed(
    "HR pre-qualify",
    () =>
      api(`/hr/applications/${application.id}/prequalify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${hrToken}` },
      }),
    timings,
  );

  const managers = await timed(
    "HR load hiring managers",
    () => api("/hr/hiring-managers", { headers: { Authorization: `Bearer ${hrToken}` } }),
    timings,
  );
  const walker = managers.find((manager) => manager.email === "walker.cheng@jetta.com") || managers[0];
  const interview = await timed(
    "HR schedule interview",
    () =>
      api(`/hr/applications/${application.id}/schedule`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hrToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id: application.id,
          hiring_manager_id: walker.id,
          schedule_time: "2026-07-08T13:00:00",
        }),
      }),
    timings,
  );

  await timed(
    "HM load assigned interviews",
    () => api("/interviews", { headers: { Authorization: `Bearer ${hmToken}` } }),
    timings,
  );

  const hmDecision = await timed(
    "HM submit recommendation",
    () =>
      api(`/interviews/${interview.id}/decision`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hmToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager_comment:
            "Speed test interview complete. Candidate gave concrete backend, debugging, communication, and ownership examples. Recommend moving forward.",
          final_verdict: "Strongly recommend",
        }),
      }),
    timings,
  );

  const finalDecision = await timed(
    "HR final decision",
    () =>
      api(`/hr/applications/${application.id}/final-decision`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hrToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Offer pending",
          comment: "HR reviewed HM speed-test recommendation and moved the candidate to offer pending.",
        }),
      }),
    timings,
  );

  const result = {
    applicant_email: applicantEmail,
    job_id: job.id,
    job_title: job.title,
    application_id: application.id,
    interview_id: interview.id,
    matching_score: application.matching_score,
    answer_score: application.answer_score,
    prequalified_status: prequalified.status,
    hm_verdict: hmDecision.final_verdict,
    final_status: finalDecision.status,
    timings,
  };
  await writeFile(
    path.join(root, "cross-functional-speed-test-results.json"),
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
