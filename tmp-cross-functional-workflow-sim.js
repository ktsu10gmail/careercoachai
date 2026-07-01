const { chromium } = require("playwright");
const fs = require("fs/promises");
const { openAsBlob } = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = "/home/ksu/recruit-system";
const frontendBase = "http://localhost:4001";
const apiBase = "http://localhost:8000";
const resumePath = path.join(root, "tmp-applicant-playwright-resume.txt");
const runId = Date.now();
const applicantEmail = `cross.functional.${runId}@example.com`;
const applicantPassword = "Playwright123!";
const jobUrl = process.env.CROSS_JOB_URL || "sim-senior-backend-engineer-2";

async function shot(page, name) {
  await page.screenshot({ path: path.join(root, name), fullPage: true });
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

async function login(email, password) {
  const body = new URLSearchParams({ username: email, password });
  const data = await api("/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return data.access_token;
}

function makeServiceToken(userId) {
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

async function main() {
  const results = [];
  const hrToken = makeServiceToken(8);
  const hmToken = makeServiceToken(9);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.setDefaultTimeout(45000);

  const job = await api(`/jobs/${encodeURIComponent(jobUrl)}`);
  results.push({
    step: "Selected public job URL",
    job_id: job.id,
    job_title: job.title,
    job_url: `${frontendBase}/apply/${job.job_url}`,
  });

  await page.goto(`${frontendBase}/apply/${job.job_url}`, { waitUntil: "networkidle" });
  await shot(page, "cross-functional-01-applicant-job-url.png");

  await api("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Casey Cross Functional",
      email: applicantEmail,
      password: applicantPassword,
      role: "Applicant",
    }),
  });
  const applicantToken = await login(applicantEmail, applicantPassword);
  const applicantMe = await api("/auth/me", {
    headers: { Authorization: `Bearer ${applicantToken}` },
  });
  const questions = await api(`/jobs/${encodeURIComponent(job.job_url)}/questions`);
  const applicationPayload = {
    job_id: job.id,
    answers: questions.map((question, index) => ({
      question_id: question.id,
      answer_text:
        `Cross-functional answer ${index + 1}: I have delivered production backend systems, collaborated with HR and hiring stakeholders, ` +
        "resolved incidents, documented tradeoffs, and communicated evidence clearly during interviews.",
    })),
  };
  const form = new FormData();
  form.append("application_in", JSON.stringify(applicationPayload));
  form.append("resume", await openAsBlob(resumePath, { type: "text/plain" }), "cross-functional-resume.txt");
  const application = await api("/applications", {
    method: "POST",
    headers: { Authorization: `Bearer ${applicantToken}` },
    body: form,
  });
  results.push({
    step: "Applicant submitted application from job URL",
    applicant_email: applicantEmail,
    applicant_id: applicantMe.id,
    application_id: application.id,
    status: application.status,
    matching_score: application.matching_score,
    answer_score: application.answer_score,
  });

  await page.goto(frontendBase, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => {
    localStorage.setItem("applicant_token", token);
    sessionStorage.setItem("applicant_token", token);
  }, applicantToken);
  await page.goto(`${frontendBase}/applicant/portal?job=${job.job_url}`, { waitUntil: "networkidle" });
  await shot(page, "cross-functional-02-applicant-portal-submitted.png");

  let hrApplication = await api(`/hr/jobs/${application.job_id}/applications`, {
    headers: { Authorization: `Bearer ${hrToken}` },
  }).then((items) => items.find((item) => item.id === application.id));
  results.push({
    step: "HR can see scored application",
    application_id: hrApplication.id,
    status: hrApplication.status,
    matching_score: hrApplication.matching_score,
    answer_score: hrApplication.answer_score,
  });

  await page.goto(frontendBase, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => {
    localStorage.setItem("employer_token", token);
    sessionStorage.setItem("employer_token", token);
  }, hrToken);
  await page.goto(`${frontendBase}/hr/dashboard`, { waitUntil: "networkidle" });
  await page.getByText(applicantEmail).first().waitFor({ timeout: 45000 });
  await shot(page, "cross-functional-03-hr-sees-application.png");

  hrApplication = await api(`/hr/applications/${application.id}/prequalify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${hrToken}` },
  });
  results.push({
    step: "HR pre-qualified applicant",
    application_id: hrApplication.id,
    status: hrApplication.status,
  });

  const managers = await api("/hr/hiring-managers", {
    headers: { Authorization: `Bearer ${hrToken}` },
  });
  const walker = managers.find((manager) => manager.email === "walker.cheng@jetta.com") || managers[0];
  const scheduleTime = "2026-07-08T10:30:00";
  const interview = await api(`/hr/applications/${application.id}/schedule`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hrToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      application_id: application.id,
      hiring_manager_id: walker.id,
      schedule_time: scheduleTime,
    }),
  });
  results.push({
    step: "HR scheduled interview and forwarded to HM",
    application_id: application.id,
    interview_id: interview.id,
    hiring_manager: walker.email,
    schedule_time: interview.schedule_time,
  });

  await page.goto(`${frontendBase}/hr/dashboard`, { waitUntil: "networkidle" });
  await page.getByText(applicantEmail).first().waitFor({ timeout: 45000 });
  await shot(page, "cross-functional-04-hr-interview-scheduled.png");

  await page.goto(frontendBase, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => {
    localStorage.setItem("employer_token", token);
    sessionStorage.setItem("employer_token", token);
  }, hmToken);
  await page.goto(`${frontendBase}/hiring_manager/interviews`, { waitUntil: "networkidle" });
  await page.getByText(applicantEmail).first().waitFor({ timeout: 45000 });
  await shot(page, "cross-functional-05-hm-assigned-interview.png");

  const hmComment =
    "Interview completed. Casey explained production debugging, API design, and stakeholder communication clearly. Strong hire signal with one follow-up on scaling tradeoffs.";
  const hmDecision = await api(`/interviews/${interview.id}/decision`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hmToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      manager_comment: hmComment,
      final_verdict: "Strongly recommend",
    }),
  });
  results.push({
    step: "HM completed interview and submitted recommendation",
    interview_id: hmDecision.id,
    final_verdict: hmDecision.final_verdict,
    manager_comment: hmDecision.manager_comment,
  });

  await page.goto(`${frontendBase}/hiring_manager/interviews`, { waitUntil: "networkidle" });
  await page.getByText("Strongly recommend").first().waitFor({ timeout: 45000 });
  await shot(page, "cross-functional-06-hm-recommendation-submitted.png");

  await page.goto(frontendBase, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => {
    localStorage.setItem("employer_token", token);
    sessionStorage.setItem("employer_token", token);
  }, hrToken);
  await page.goto(`${frontendBase}/hr/dashboard`, { waitUntil: "networkidle" });
  await page.getByText(applicantEmail).first().waitFor({ timeout: 45000 });
  await page.getByText("HM: Strongly recommend").first().waitFor({ timeout: 45000 });
  await shot(page, "cross-functional-07-hr-sees-hm-comment.png");

  const finalDecision = await api(`/hr/applications/${application.id}/final-decision`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hrToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "Offer pending",
      comment:
        "HR reviewed the hiring manager recommendation and interview notes. Move to offer pending for compensation and approval workflow.",
    }),
  });
  results.push({
    step: "HR reviewed HM recommendation and recorded final decision",
    application_id: finalDecision.id,
    status: finalDecision.status,
    hr_final_comment: finalDecision.hr_final_comment,
  });

  await page.goto(`${frontendBase}/hr/dashboard`, { waitUntil: "networkidle" });
  await page.getByText(applicantEmail).first().waitFor({ timeout: 45000 });
  await page.getByText("Offer pending").first().waitFor({ timeout: 45000 });
  await shot(page, "cross-functional-08-hr-final-decision.png");

  await fs.writeFile(
    path.join(root, "cross-functional-workflow-results.json"),
    JSON.stringify(results, null, 2),
  );

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
