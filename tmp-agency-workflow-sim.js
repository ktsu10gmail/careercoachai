const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs/promises");

const root = "/home/ksu/recruit-system";
const baseUrl = "http://localhost:4001";
const token = process.env.AGENCY_TOKEN;
const resumePath = path.join(root, "tmp-applicant-playwright-resume.txt");
const stamp = Date.now();
const clientName = `Agency Playwright Client ${stamp}`;
const candidateName = `Agency Playwright Candidate ${stamp}`;
const candidateEmail = `agency.candidate.${stamp}@example.com`;

async function shot(page, name) {
  await page.screenshot({ path: path.join(root, name), fullPage: true });
}

async function setToken(page) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate((agencyToken) => {
    window.localStorage.setItem("employer_token", agencyToken);
    window.sessionStorage.setItem("employer_token", agencyToken);
  }, token);
}

async function chooseSelectOption(page, trigger, optionName) {
  await trigger.click();
  await page.getByRole("option", { name: optionName }).click();
}

async function main() {
  if (!token) throw new Error("AGENCY_TOKEN is required");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1500, height: 1050 } });
  page.setDefaultTimeout(30000);
  const results = [];

  await setToken(page);

  await page.goto(`${baseUrl}/agency/clients`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=/Signed in as|Manage client companies/i");
  await shot(page, "agency-wf-01-clients-entry.png");
  await page.getByLabel("Company name").fill(clientName);
  await page.getByLabel("Industry").fill("Workflow simulation");
  await page.getByLabel("Website").fill("https://agency-playwright.example.com");
  await page.getByLabel("Contact name").fill("Riley Client");
  await page.getByLabel("Contact email").fill(`client.${stamp}@example.com`);
  await page.getByLabel("Contact phone").fill("555-222-1000");
  await page.getByLabel("Notes").fill("Created during Playwright agency workflow simulation.");
  await shot(page, "agency-wf-02-client-filled.png");
  await page.getByRole("button", { name: /Add client/i }).click();
  await page.waitForSelector(`text=${clientName}`);
  await shot(page, "agency-wf-03-client-created.png");
  results.push({ step: "Agency creates client company", url: page.url(), clientName });

  await page.goto(`${baseUrl}/agency/candidates`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=/Signed in as|Manage candidate profiles/i");
  await shot(page, "agency-wf-04-candidates-entry.png");
  await page.getByLabel("Name").fill(candidateName);
  await page.getByLabel("Email").fill(candidateEmail);
  await page.getByLabel("Phone").fill("555-333-2000");
  await page.getByLabel("Location").fill("Remote");
  await page.getByLabel("Resume notes").fill(
    "Senior data engineer with Python, SQL, Airflow, dbt, cloud data warehouses, healthcare analytics, data quality, observability, and stakeholder delivery experience.",
  );
  await page.locator("form").filter({ hasText: "Talent network consent" }).getByText("Talent network consent").click();
  await shot(page, "agency-wf-05-candidate-filled.png");
  await page.getByRole("button", { name: /Add candidate/i }).click();
  await page.waitForSelector(`text=${candidateEmail}`);
  await shot(page, "agency-wf-06-candidate-created.png");
  results.push({ step: "Agency creates candidate profile", url: page.url(), candidateEmail });

  const candidateRow = page.locator("tr").filter({ hasText: candidateEmail }).first();
  await candidateRow.locator('input[type="file"]').setInputFiles(resumePath);
  await page.waitForSelector(`text=/Resume uploaded and parsed for ${candidateName}/i`, {
    timeout: 45000,
  });
  await shot(page, "agency-wf-07-resume-uploaded.png");
  results.push({ step: "Agency uploads and parses candidate resume", url: page.url() });

  await page.goto(`${baseUrl}/agency/matching`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=/Match candidates to client jobs/i");
  await chooseSelectOption(page, page.getByRole("combobox").first(), new RegExp(candidateEmail));
  await chooseSelectOption(page, page.getByRole("combobox").nth(1), /Senior Data Engineer - Northstar BioAnalytics/i);
  await shot(page, "agency-wf-08-match-draft.png");
  await page.getByRole("button", { name: /Create scored match/i }).click();
  await page.waitForSelector("text=/Application #|Resume\\/JD score|ready/i", {
    timeout: 210000,
  });
  await shot(page, "agency-wf-09-match-created.png");
  results.push({ step: "Agency creates AI-scored candidate/job match", url: page.url() });

  await page.getByLabel("Client contact name").fill("Maya Chen");
  await page.getByLabel("Client contact email").fill("maya.chen@northstar-bio.example.com");
  await page.getByLabel("Initial notes").fill("Submitting a strong data engineering profile for client review.");
  await shot(page, "agency-wf-10-submission-draft.png");
  await page.getByRole("button", { name: /Submit to client/i }).click();
  await page.waitForSelector("text=/Submission #|was sent/i", { timeout: 45000 });
  await shot(page, "agency-wf-11-submitted-to-client.png");
  results.push({ step: "Agency submits candidate to client", url: page.url() });

  const submissionRow = page.locator("tr").filter({ hasText: candidateEmail }).first();
  await chooseSelectOption(page, submissionRow.getByRole("combobox").first(), /^accepted$/i);
  await submissionRow
    .getByLabel(/Feedback for submission/i)
    .fill("Client accepted the candidate for next-step interview coordination.");
  await shot(page, "agency-wf-12-feedback-draft.png");
  await submissionRow.getByRole("button", { name: /Save feedback/i }).click();
  await page.waitForSelector("text=/updated to accepted/i", { timeout: 45000 });
  await shot(page, "agency-wf-13-feedback-saved.png");
  results.push({ step: "Agency tracks client feedback and outcome", url: page.url() });

  await page.goto(`${baseUrl}/agency/performance`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=/Recruiter performance dashboard|Recruiter leaderboard/i");
  await shot(page, "agency-wf-14-performance.png");
  results.push({ step: "Agency reviews recruiter performance dashboard", url: page.url() });

  await fs.writeFile(
    path.join(root, "agency-wf-results.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
