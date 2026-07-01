const { chromium } = require("playwright");
const path = require("path");

const root = "/home/ksu/recruit-system";
const resumePath = path.join(root, "tmp-applicant-playwright-resume.txt");
const freeAnalysisResumePath = path.join(root, "tmp-applicant-playwright-resume.pdf");
const baseUrl = "http://localhost:5001";
const jobUrl = "sim-senior-backend-engineer-2";
const applicantEmail = `applicant.playwright.${Date.now()}@example.com`;
const applicantPassword = "Playwright123!";

async function shot(page, name) {
  await page.screenshot({
    path: path.join(root, name),
    fullPage: true,
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.setDefaultTimeout(15000);

  const results = [];

  await page.goto(`${baseUrl}/free-analysis`, { waitUntil: "networkidle" });
  await shot(page, "applicant-wf-01-free-analysis-entry.png");
  results.push({ step: "Direct Free Tool Path: public site opened", url: page.url() });

  await page.locator('input[type="file"]').first().setInputFiles(freeAnalysisResumePath);
  const jd = [
    "Backend Engineer role building FastAPI services, SQLAlchemy data models,",
    "PostgreSQL reporting features, Docker deployments, CI/CD workflows,",
    "observability dashboards, incident response, and product-facing APIs.",
  ].join(" ");
  const textareas = page.locator("textarea");
  await textareas.first().fill(jd);
  await shot(page, "applicant-wf-02-free-analysis-filled.png");
  results.push({ step: "Direct Free Tool Path: resume uploaded and JD pasted", url: page.url() });

  const analyzeButton = page.getByRole("button", { name: /show my fit|analyze|analysis|match|score/i }).first();
  await analyzeButton.click();
  await page.waitForTimeout(1000);
  await shot(page, "applicant-wf-03-free-analysis-submitted.png");
  try {
    await page.waitForSelector("text=/Match|Strength|Improve|score|analysis/i", { timeout: 45000 });
  } catch {}
  await shot(page, "applicant-wf-04-free-analysis-output.png");
  results.push({ step: "Direct Free Tool Path: analysis submitted/output area captured", url: page.url() });

  await page.goto(`${baseUrl}/apply/${jobUrl}`, { waitUntil: "networkidle" });
  await shot(page, "applicant-wf-05-job-link.png");
  results.push({ step: "Job Application Path: opened job link", url: page.url() });

  await page.getByRole("link", { name: /create applicant account/i }).click();
  await page.waitForLoadState("networkidle");
  await shot(page, "applicant-wf-06-create-account.png");

  await page.getByLabel(/^Name$/i).fill("Jordan Playwright");
  await page.getByLabel(/^Email$/i).fill(applicantEmail);
  await page.getByLabel(/^Password$/i).fill(applicantPassword);
  await page.getByRole("button", { name: /create account/i }).click();
  await page.waitForURL(new RegExp(`/applicant/portal\\?job=${jobUrl}`), { timeout: 30000 });
  await page.waitForLoadState("networkidle");
  await shot(page, "applicant-wf-07-portal-application-form.png");
  results.push({ step: "Job Application Path: account created and application form opened", url: page.url(), applicantEmail });

  const answers = page.locator("textarea");
  const count = await answers.count();
  for (let i = 0; i < count; i += 1) {
    await answers.nth(i).fill(
      `Answer ${i + 1}: I have relevant FastAPI, PostgreSQL, Docker, production troubleshooting, and cross-functional delivery experience.`
    );
  }
  await page.locator('input[type="file"]').last().setInputFiles(resumePath);
  await shot(page, "applicant-wf-08-application-complete-before-submit.png");
  results.push({ step: "Job Application Path: screening answers and resume filled", url: page.url(), answerFields: count });

  await page.getByRole("button", { name: /submit application/i }).click();
  await page.waitForTimeout(1500);
  await page.waitForSelector("text=/Your application was submitted|Submission complete|Application #/i", { timeout: 60000 });
  await shot(page, "applicant-wf-09-application-submitted.png");
  results.push({ step: "Job Application Path: submitted, AI scoring/review handoff captured", url: page.url() });

  await require("fs/promises").writeFile(
    path.join(root, "applicant-wf-results.json"),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
