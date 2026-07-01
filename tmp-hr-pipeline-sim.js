const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs/promises");

const root = "/home/ksu/recruit-system";
const baseUrl = "http://localhost:3001";
const token =
  process.env.HR_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODIyNjkyMTksInN1YiI6IjgifQ.op9C-zzfqctLTfm1FrDDc4_a31tJl7LkclZpPZG6siI";

async function shot(page, name) {
  await page.screenshot({ path: path.join(root, name), fullPage: true });
}

async function chooseSelectOption(page, trigger, optionName) {
  await trigger.click();
  await page.getByRole("option", { name: optionName }).click();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
  page.setDefaultTimeout(25000);
  const results = [
    {
      step: "HR creates/publishes job",
      note: "Backend created job id 26 during the first run; UI success banner was slow/missed by Playwright wait.",
    },
  ];

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate((hrToken) => {
    window.localStorage.setItem("employer_token", hrToken);
    window.sessionStorage.setItem("employer_token", hrToken);
  }, token);

  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=/Signed in as|Applications/i", { timeout: 30000 });
  await shot(page, "hr-wf-03-job-created.png");
  results.push({ step: "HR opens dashboard and sees pipeline", url: page.url() });

  const app54Email = "applicant.playwright.1782239659840@example.com";
  await page.waitForSelector(`text=${app54Email}`);
  const app54NewRow = page.locator("tr").filter({ hasText: app54Email }).first();
  await app54NewRow.getByRole("button", { name: /Jordan Playwright/i }).click();
  await page.waitForSelector("text=/RESUME\\/JD COMMENT|Q&A COMMENT/i");
  await shot(page, "hr-wf-04-ai-evaluation-notes.png");
  results.push({ step: "HR reviews AI score/comments and applicant evidence", url: page.url() });

  await chooseSelectOption(page, page.getByLabel("Choose action for application 54"), /Qualify/i);
  await page.waitForSelector("text=/Application #54 was qualified/i", { timeout: 30000 });
  await shot(page, "hr-wf-05-application-qualified.png");
  results.push({ step: "HR prequalifies candidate", url: page.url() });

  await page.getByRole("button", { name: /Qualified/i }).click();
  await page.waitForSelector(`text=${app54Email}`);
  const qualifiedRow = page.locator("tr").filter({ hasText: app54Email }).first();
  await chooseSelectOption(page, qualifiedRow.getByRole("combobox").first(), /Walker Cheng/i);
  await qualifiedRow.getByLabel("Interview date for application 54").fill("2026-07-03");
  await chooseSelectOption(page, qualifiedRow.getByRole("combobox").nth(1), /^10:00 AM$/i);
  await shot(page, "hr-wf-06-schedule-draft.png");
  await qualifiedRow.getByRole("button", { name: /Schedule/i }).click();
  await page.waitForSelector("text=/Interview for application #54 was scheduled/i", {
    timeout: 30000,
  });
  await shot(page, "hr-wf-07-interview-scheduled.png");
  results.push({ step: "HR routes shortlist and schedules interview with HM", url: page.url() });

  await page.getByRole("button", { name: /HM Decision/i }).click();
  await page.waitForSelector("text=/ktsu10@gmail.com|HM:/i", { timeout: 30000 });
  await shot(page, "hr-wf-08-hm-decision-list.png");
  results.push({ step: "HR receives HM recommendation", url: page.url() });

  const app51Row = page.locator("tr").filter({ hasText: "ktsu10@gmail.com" }).first();
  await app51Row
    .getByLabel("HR final note for application 51")
    .fill("HM strongly recommends this candidate. HR is preparing the offer package and compensation review.");
  await shot(page, "hr-wf-09-final-decision-draft.png");
  await app51Row.getByRole("button", { name: /Prepare offer/i }).click();
  await page.waitForSelector("text=/Application #51 moved to Offer pending/i", {
    timeout: 30000,
  });
  await shot(page, "hr-wf-10-offer-pending.png");
  results.push({ step: "HR records final decision/status update", url: page.url() });

  await fs.writeFile(path.join(root, "hr-wf-results.json"), JSON.stringify(results, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
