To help your AI coding tool (like Codex or Cursor) implement the **Performance Analytics Dashboard** for the V4 Talent Marketplace, I have created a structured technical prompt in Markdown format. This prompt focuses on the transition from "Cold Start" engagement to "Warm Start" marketplace activity.

***

### **AI Coding Agent Prompt: Implement V4 Platform Admin Performance Dashboard**

**Context:**
I am building a **Platform Admin Performance Analytics Dashboard** for the **CareerCoachAI** platform (V4). This is a back-office dashboard for site administrators only. The first goal is to understand site usage statistically: how many visitors are coming to the site, how many applicants are using the tools, and how many Hiring Managers are using the tools daily, monthly, and over selectable reporting periods.

**Task:**
Implement the Performance Analytics Dashboard in two practical phases:

*   **Phase 1: Practical MVP Dashboard** - Build a useful dashboard using the current FastAPI, SQLAlchemy, and Next.js architecture, adding only the telemetry needed to make the metrics reliable.
*   **Phase 2: Production Analytics Layer** - Add background aggregation, precomputed snapshots, deeper funnel analytics, and stronger anonymous/session tracking after the MVP proves useful.

The dashboard should focus first on admin-level usage analytics and visual trends, then expand into deeper marketplace funnel analytics later.

---

### **1. Metrics to Implement**

#### **A. Site Traffic and Usage**
*   **Total Visitors:** Count of unique visitor/session IDs across tracked public pages and tools.
*   **Daily Visitors:** Count of unique visitors grouped by day.
*   **Monthly Visitors:** Count of unique visitors grouped by month.
*   **Page/Tool Visits:** Count visits to key areas such as public landing pages, `/free-analysis`, applicant setup/login, employer login, and hiring manager pages.
*   **Returning vs. New Visitors:** Count first-time sessions compared with repeat sessions if the available tracking data supports it.

#### **B. Applicant Usage**
*   **Daily Active Applicants:** Count applicants using applicant-facing tools each day.
*   **Monthly Active Applicants:** Count applicants using applicant-facing tools each month.
*   **New Applicant Accounts:** Count new `Users` with the `Applicant` role.
*   **Free Analysis Volume:** Total number of "No-Login" Resume-to-JD matching events triggered.
*   **Extraction Success Rate:** Ratio of successful `parsed_profile_json` generations vs. parsing errors (PDF/DOCX).
*   **Global Average Match Score:** The mean **Resume-to-JD Matching Score** across all users.

#### **C. Hiring Manager Usage**
*   **Daily Active Hiring Managers:** Count Hiring Managers using their workflow each day.
*   **Monthly Active Hiring Managers:** Count Hiring Managers using their workflow each month.
*   **Hiring Manager Actions:** Count application reviews, interview guide views/generations, final verdicts, and other tracked HM activity.
*   **Final Verdict Volume:** Count applications moved to `Hired` or `Rejected`.
*   **Final Verdict Velocity:** Average time from Job Posting to `applications.status` changing to `Hired` or `Rejected`.

#### **D. Talent Network and Marketplace Growth**
*   **Marketplace Opt-in Rate:** Percentage of users where `candidates.consent_talent_network = true`.
*   **Dossier Completion:** Percentage of opted-in candidates who have verified/edited their extracted skills and experience.
*   **Pre-Screening Accelerator Usage:** Number of times the "One-Click Dossier" has been opened.
*   **Interview Guides Generated:** Total count of 20-question **Intentional Interview Guides** (10/10 split) produced.
*   **Submission Success:** Track `candidate_submissions` status (pending, reviewed, accepted, rejected).
*   **Recruiter Activity:** Aggregate stats per `assigned_recruiter_id` (candidates added, matches created).

---

### **2. Technical Requirements**

#### **Phase 1: Practical MVP Dashboard**

*   **Database Schema:** 
    *   Create a lightweight `usage_stats` table to log analytics events such as page visits, anonymous "No-Login" resume matching, parsing success/failure, applicant tool usage, Hiring Manager activity, dossier opens, and interview guide generation.
    *   Suggested fields: `id`, `company_id`, `user_id`, `session_id`, `visitor_id`, `role`, `event_type`, `path`, `result_score`, `metadata_json`, and `created_at`.
    *   Use the existing `company_id` tenant model in this codebase. Treat any `organization_id` references as equivalent to `company_id` unless a broader naming refactor is intentionally planned.
    *   The Phase 1 dashboard is for **Platform Admin** users only and should show global site usage across the platform.
    *   Preserve tenant-safe query patterns so future company-level dashboards can still be added safely.
*   **Backend Logic (FastAPI):**
    *   Implement **Reporting Periods** filter: Last 7 days, 30 days, 90 days, or All Time.
    *   Create aggregate reporting endpoints that compute the MVP metrics from existing tables plus `usage_stats`.
    *   Keep the initial implementation synchronous with efficient SQL queries unless real dashboard latency proves background processing is needed.
    *   Define clear MVP rules for derived metrics:
        *   **Total Visitors:** Count distinct `visitor_id` or `session_id` values from tracked public page/tool events.
        *   **Daily Active Applicants:** Count distinct Applicant users or anonymous applicant sessions with applicant tool events on each day.
        *   **Monthly Active Applicants:** Count distinct Applicant users or anonymous applicant sessions grouped by month.
        *   **Daily Active Hiring Managers:** Count distinct Hiring Manager users with HM workflow events on each day.
        *   **Monthly Active Hiring Managers:** Count distinct Hiring Manager users grouped by month.
        *   **Dossier Completion:** Count opted-in candidates with enough completed profile data, such as `parsed_profile_json`, `searchable_skills`, and/or `searchable_title`.
        *   **Final Verdict Velocity:** Measure from `jobs.created_at` to `applications.hr_final_decided_at` for applications marked `Hired` or `Rejected`.
*   **Frontend UI (Next.js):**
    *   Create a protected Platform Admin back-office route, such as `/platform/performance`.
    *   Restrict the dashboard to `Platform_Admin` users only.
    *   Use KPI cards for headline totals.
    *   Include charts and graphs, not just lists or tables:
        *   Line chart for daily visitors.
        *   Bar chart for monthly visitors.
        *   Line or area chart for daily/monthly active applicants.
        *   Line or area chart for daily/monthly active Hiring Managers.
        *   Funnel or stacked bar chart for visitor -> free analysis -> applicant signup -> Talent Network opt-in.
    *   Tables can be included for detailed drill-downs, but the primary admin experience should be visual and trend-focused.
    *   Show a clear **Cold Start vs. Warm Start** summary that connects site traffic and free-tool activity to applicant/HM adoption.

*   **Security and Admin Access:**
    *   Protect the frontend route with a role check before rendering Platform Admin data.
    *   Protect every analytics API endpoint with `Platform_Admin` authorization on the FastAPI side. The backend is the real security boundary.
    *   Keep the dashboard aggregated by default. Do not expose visitor PII, resume text, candidate answers, or sensitive candidate content in the analytics MVP.
    *   Store anonymous `visitor_id` and `session_id` values instead of raw personal visitor data.
    *   For local development, a `Platform_Admin` account can be created through the existing signup API if needed. Before production, prevent public self-registration as `Platform_Admin` and create site admin accounts through a seed script, CLI command, or existing Platform Admin invite flow.

#### **Phase 2: Production Analytics Layer**

*   **Background Processing:**
    *   Add **Asynchronous Workers (Celery/Redis)** only when the MVP dashboard needs faster load times or heavier reporting workloads.
    *   Precompute daily or weekly metric snapshots so large dashboards load instantly without blocking the AI evaluation engine.
*   **Advanced Analytics:**
    *   Add stronger anonymous visitor/session tracking for more accurate unique visitor and conversion metrics.
    *   Add deeper funnel breakdowns from free analysis to opt-in, dossier completion, application, interview, and final decision.
    *   Add ROI/time-saved modeling for hiring managers, based on reduced manual resume screening and faster decision velocity.
    *   Add company, agency, role, path, event type, and acquisition-source filters.

---

### **3. Success Criteria**
1.  Platform Admins can see how many visitors are using the site daily, monthly, and over selectable reporting periods.
2.  Platform Admins can see how many applicants are using the tools daily and monthly.
3.  Platform Admins can see how many Hiring Managers are using the tools daily and monthly.
4.  The dashboard includes graphs/charts for usage trends, not only lists or tables.
5.  The dashboard must show the **"Cold Start" vs. "Warm Start"** status, connecting visitor traffic and free-tool usage to applicant and Hiring Manager adoption.
6.  Phase 1 should deliver a working Platform Admin back-office dashboard before introducing Celery/Redis or precomputed analytics snapshots.

***

### **Strategic Rationale for the AI Agent**
This prompt is designed to ensure the coding AI understands the **holistic evidence-based scoring** philosophy. By tracking these specific metrics, you gain the data needed to prove the platform's value to B2B clients—showing them a clear path from a posted job to a pre-vetted, decision-ready candidate dossier.
