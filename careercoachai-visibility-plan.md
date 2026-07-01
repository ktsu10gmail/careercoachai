# CareerCoachAI Visibility & SEO Plan

## Positioning

CareerCoachAI is the applicant-facing career coach and talent marketplace entry point for the platform. The core message is:

> Stop blindly applying into a black hole.

CareerCoachAI gives applicants immediate, free value through an AI resume-to-job match score, strengths and weaknesses analysis, coaching advice, and optional Talent Network participation.

For hiring managers, CareerCoachAI closes the vetting gap:

> Stop reading resumes cold. Get a pre-vetted dossier in one click.

The platform should feel like a trusted career mirror for applicants and a decision-prep engine for hiring teams.

## Target Audiences

### Applicants

Applicants want to know:

- Whether a job fits their actual experience.
- What strengths they should emphasize.
- What gaps they should improve before applying or interviewing.
- Whether their data is private and under their control.
- Whether joining the Talent Network helps better-fit jobs find them.

### Hiring Managers

Hiring managers want to know:

- Which candidates are strongest before the interview.
- What evidence supports the match score.
- What gaps or risks they should probe.
- What questions to ask when they are minutes away from the interview.
- How to make interview feedback more consistent and decision-oriented.

## Target Keywords

Primary long-tail phrases to use naturally across public pages:

- free AI career coach
- AI resume-to-job match score
- resume to job description match score
- free resume match analysis
- AI job fit analysis
- AI interview guide for hiring managers
- pre-vetted candidate dossier
- standardized interview questions
- 10 resume-based interview questions
- 10 job-based interview questions
- Talent Network for job applicants

## Applicant Messaging

Primary applicant messages:

- Meet your personal CareerCoachAI.
- Stop blindly applying into a black hole.
- Apply to jobs that better fit your experiences.
- We can help you for free.
- See your technical fit score immediately.
- Get a detailed breakdown of your competitive edges and where to improve.
- Let your CareerCoachAI work for you 24/7.
- Opt into the Talent Network and let better-fit jobs find you.

Privacy and trust language:

- We save extracted career metadata as a private anonymous profile snapshot.
- Employer discovery remains off unless the applicant explicitly opts in.
- Applicants can update or delete their data at any time.
- The free analysis is coaching support, not a measure of career value.

## Hiring Manager Messaging

Primary hiring-manager messages:

- End the last-minute interview panic.
- Stop reading resumes cold.
- After spending hours buried in a pile of resumes, are you still not sure who is the best fit?
- In the last minute before the interview, do you still find yourself not knowing what questions to ask?
- Get a pre-vetted dossier in one click.
- End the discovery phase and start the decision phase.
- Focus face-to-face time on final verdicts, not basic vetting.

## V4 Differentiators

### 10/10 Practice Question Split

The interview preparation system should be described as standardized and intentional:

- 10 resume-based story questions.
- 10 job-based capability proof questions.
- Designed to create a more level playing field.
- Helps applicants prepare with clarity.
- Helps hiring managers compare evidence consistently.

Suggested copy:

> Practice with 20 standardized and intentional questions: 10 resume-based story questions and 10 job-based capability questions, built to create a more level playing field.

### One-Click Dossier

Hiring managers should see CareerCoachAI as a dossier engine, not just a scoring tool.

The dossier should include:

- Resume-to-JD match analysis.
- 70/30 weighted score.
- Strengths and gaps.
- Pre-screening answers and comments.
- Interview-prep focus areas.
- Hiring-manager recommendation workflow.

### Built-In Scoring Rubrics

Each generated interview question should include a rubric:

- 1 = poor or vague answer.
- 3 = solid but incomplete answer.
- 5 = excellent evidence-backed answer.

This helps managers know what to listen for and reduces improvised, inconsistent evaluation.

## On-Page SEO Checklist

- Use one clear H1 on each public page.
- Include applicant pain point in the first 100 words.
- Use descriptive H2 sections for applicant tools, Talent Network, and hiring-manager prep.
- Use natural long-tail keywords without keyword stuffing.
- Add descriptive link text, not generic "Open" or "Click here."
- Make trust and privacy language visible.
- Keep paragraphs short and scannable.

## Technical SEO Checklist

- Add strong metadata for public pages.
- Add Open Graph and Twitter metadata.
- Add canonical URLs with `NEXT_PUBLIC_SITE_URL`; update when a public domain is assigned.
- Add `robots.txt`.
- Add `sitemap.xml`.
- Confirm mobile layout has no horizontal overflow.
- Run Lighthouse or equivalent performance checks.
- Use optimized image formats if visual assets are added.
- Enforce HTTPS before public indexing.

Note: a LAN address such as `192.168.1.46:5001` cannot be indexed by public search engines. These improvements prepare the site for a real public domain.

## Internal Linking Plan

Important internal links:

- Homepage to `/free-analysis`.
- Homepage to `/applicant/login`.
- Homepage to hiring-manager prep section.
- Free analysis success state to `/applicant/portal`.
- Applicant portal back to resume/JD match and practice interview tools.
- Hiring-manager marketing section to public interview guide generator.

## Public-Domain Deployment Checklist

Before search indexing is enabled on a real domain:

- Choose the canonical public domain for CareerCoachAI.
- Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
- Confirm HTTPS and certificate renewal.
- Submit `sitemap.xml` in Google Search Console.
- Submit `sitemap.xml` in Bing Webmaster Tools.
- Verify `robots.txt` allows only public marketing and guide pages.
- Confirm authenticated pages remain `noindex` or disallowed.
- Configure analytics with privacy-respecting defaults.
- Run Lighthouse checks for performance, accessibility, SEO, and best practices.
- Confirm Open Graph previews render correctly in Slack, LinkedIn, and messaging apps.
- Add production favicon and social preview image when brand assets are final.

## Topic Cluster Plan

### Pillar Page

Main pillar:

- Free AI Career Coach for Better-Fit Job Applications.

Supporting pages or articles:

- How to compare your resume to a job description before applying.
- What an AI resume-to-job match score means.
- How to prepare with 10 resume-based and 10 job-based interview questions.
- Why applicants should verify extracted career metadata before opting into a Talent Network.

### Hiring Manager Cluster

Main pillar:

- AI Interview Guide for Hiring Managers.

Supporting pages or articles:

- How to stop reading resumes cold.
- What belongs in a pre-vetted candidate dossier.
- How scoring rubrics improve interview consistency.
- What to ask when you have five minutes before an interview.

### Trust and Fairness Cluster

Main pillar:

- How standardized interview questions create a more level playing field.

Supporting pages or articles:

- Why the 10/10 split matters.
- How applicants control Talent Network discovery.
- How AI coaching should support, not replace, human judgment.

## Implementation Checklist

### Completed

- Rebranded applicant free-analysis page as CareerCoachAI.
- Added no-login resume and JD analysis entry point.
- Added target position field to free analysis.
- Saved anonymous applicant metadata before login.
- Added Talent Network opt-in checkbox.
- Added profile claim flow.
- Added "Go to Applicant Portal" after successful claim.
- Updated applicant language to "20 practice questions."
- Added hiring-manager "last-minute interview panic" messaging.
- Added public hiring-manager "Generate My Interview Guide" CTA.
- Added one-click dossier preview.
- Added scoring rubric toggles for public generated questions.
- Added homepage metadata and public-page descriptions.
- Added Open Graph and Twitter metadata.
- Added canonical URL support through `NEXT_PUBLIC_SITE_URL`.
- Added `robots.txt`.
- Added `sitemap.xml`.
- Added descriptive public homepage links.
- Added 10/10 split level-playing-field language.
- Reviewed public page heading hierarchy.
- Ran mobile and desktop screenshot checks for homepage and free analysis.
- Added public-domain deployment checklist.
- Added future topic-cluster plan.

### Pending

- Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain before public launch.
- Add final social preview image once brand assets are ready.
- Create actual topic-cluster content pages after domain and content strategy are approved.

## Future Content Ideas

Potential article or landing-page topics:

- How to compare your resume to a job description before applying.
- Why applicants should stop blindly applying into job boards.
- How AI resume matching can help applicants choose better-fit roles.
- What hiring managers should ask when they only have minutes to prepare.
- How standardized interview questions create a fairer hiring process.
- Resume-based vs job-based interview questions: why both matter.
- How pre-vetted candidate dossiers reduce hiring-manager interview prep time.
