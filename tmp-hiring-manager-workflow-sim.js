const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs/promises");

const root = "/home/ksu/recruit-system";
const baseUrl = "http://localhost:3001";
const token =
  process.env.HM_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODIyNjkwNDYsInN1YiI6IjkifQ.vaxqj3A9CQiiKdtoWv_MXN5tpJx6yy0ggiV4xFGV-Bc";

async function shot(page, name) {
  await page.screenshot({
    path: path.join(root, name),
    fullPage: true,
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.setDefaultTimeout(20000);

  const results = [];

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate((hmToken) => {
    window.localStorage.setItem("employer_token", hmToken);
    window.sessionStorage.setItem("employer_token", hmToken);
  }, token);

  await page.goto(`${baseUrl}/hiring_manager/interviews`, {
    waitUntil: "networkidle",
  });
  await page.waitForSelector("text=/Signed in as|Applications to review/i", {
    timeout: 30000,
  });
  await shot(page, "hm-wf-01-interviews-entry.png");
  results.push({
    step: "Hiring Manager opens assigned interviews",
    url: page.url(),
  });

  await page.getByRole("button", { name: /pending/i }).click();
  await page.waitForTimeout(500);
  await shot(page, "hm-wf-02-pending-review-list.png");
  results.push({
    step: "Reviews pending assigned interviews",
    url: page.url(),
  });

  await page.getByRole("button", { name: /^Review$/i }).first().click();
  await page.waitForSelector("text=/Full Dossier Preview|Manager review/i");
  await shot(page, "hm-wf-03-expanded-dossier.png");
  results.push({
    step: "Opens one-click dossier with resume/JD and Q&A signals",
    url: page.url(),
  });

  await page.getByRole("button", { name: /view questions/i }).click();
  await page.waitForSelector("text=/Resume-based|Job-based|No suggested questions/i", {
    timeout: 30000,
  });
  await shot(page, "hm-wf-04-suggested-questions.png");
  results.push({
    step: "Views generated interview questions",
    url: page.url(),
  });

  const notes =
    "Strong technical fit and clear production ownership. Probe SQLAlchemy depth, reporting experience, and incident examples in the live interview.";
  await page
    .locator('textarea[aria-label^="Manager review for interview"]')
    .first()
    .fill(notes);
  await page.getByRole("combobox").first().click();
  await page.getByRole("option", { name: /Strongly recommend/i }).click();
  await shot(page, "hm-wf-05-recommendation-draft.png");
  results.push({
    step: "Captures manager notes and recommendation",
    url: page.url(),
  });

  await page.getByRole("button", { name: /submit recommendation/i }).click();
  await page.waitForSelector("text=/Recommendation recorded/i", {
    timeout: 30000,
  });
  await page.getByRole("button", { name: /reviewed/i }).click();
  await page.waitForTimeout(800);
  await shot(page, "hm-wf-06-recommendation-submitted.png");
  results.push({
    step: "Submits recommendation and verifies reviewed queue",
    url: page.url(),
  });

  await fs.writeFile(
    path.join(root, "hm-wf-results.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
