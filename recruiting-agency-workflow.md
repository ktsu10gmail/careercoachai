# Recruiting Agency Workflow

This document describes the step-by-step workflow for a recruiting agency using Career Coaching AI. It is written as source material for creating a visual flowchart.

## 1. Create Agency Workspace

1. User opens the start page.
2. User chooses `Employers / Recruiting Agencies`.
3. User chooses `Create workspace`.
4. User enters company information.
5. User selects workspace type: `Recruiting agency`.
6. User creates the agency admin account.
7. User optionally creates HR users, recruiter users, and hiring manager users.
8. System creates the recruiting agency workspace.

Result: The company is stored as a `Recruiting_Agency`, so agency-specific pages become available after login.

## 2. Agency User Signs In

1. Agency admin, HR, or recruiter opens the workspace login page.
2. User signs in with their email and password.
3. System checks the user role and company type.
4. If the company type is `Recruiting_Agency`, the workspace shows agency tools.

Agency tools include:

- Client Companies
- Candidates
- Matching
- Performance
- HR Dashboard

## 3. Add Client Companies

1. Agency user opens `Client Companies`.
2. User adds a client company record.
3. User enters client company name, industry, website, contact person, contact email, phone, and notes.
4. System saves the client company under the agency.

Result: Jobs can now be created on behalf of that client company.

## 4. Create Client Job

1. Agency HR or recruiter opens the HR Dashboard.
2. User creates a new job.
3. User selects the client company.
4. User may assign a recruiter to the job.
5. User enters job title, position, salary range, and job description.
6. System creates the job and generates assessment questions.

Result: The client job is ready for candidate matching and applicant submissions.

## 5. Add Candidate Profile

1. Agency user opens `Candidates`.
2. User creates a candidate profile.
3. User enters candidate name, email, phone, location, resume notes, and talent network consent if applicable.
4. System records who created the candidate profile.

Result: The candidate exists in the agency candidate pool and can be matched to multiple client jobs.

## 6. Upload Candidate Resume

1. Agency user finds the candidate in `Candidates`.
2. User uploads a resume file.
3. Supported formats are TXT, PDF, and DOCX.
4. System saves the resume file.
5. System extracts resume text.
6. System updates the candidate profile with parsed resume text.

Result: The candidate can be scored against client jobs using resume content.

## 7. Match Candidate To Client Job

1. Agency user selects a candidate.
2. User selects a client job.
3. System checks whether the candidate is already matched to that job.
4. If a duplicate match exists, system shows a duplicate warning.
5. If no duplicate exists, system compares the candidate resume text against the job description.
6. System creates a scored application for that candidate and job.
7. System records who created the match.

Result: The candidate is now matched to a client job as an application.

## 8. Review Matched Application

1. Agency user opens the candidate profile or `Matching`.
2. User reviews the matched application.
3. User checks the resume-to-job score.
4. User checks resume comments and application status.
5. User confirms the candidate is ready to submit to the client.

Result: The agency has a reviewed candidate shortlist item.

## 9. Submit Candidate To Client

1. Agency user selects the matched application.
2. User enters client contact name and client contact email.
3. User optionally adds client-facing notes or feedback.
4. User submits the candidate to the client.
5. System creates a client submission record.
6. System records who sent the submission.

Result: The candidate has been submitted to the client for review.

## 10. Track Client Feedback

1. Agency user opens `Matching`.
2. User reviews recent client submissions.
3. User updates submission status.
4. Available statuses are:
   - pending
   - reviewed
   - accepted
   - rejected
5. User adds or updates client feedback notes.
6. System saves the updated feedback and review date.

Result: The agency can track client outcomes for each submitted candidate.

## 11. Schedule Interview If Needed

1. If the candidate should move forward, HR uses the HR Dashboard.
2. HR pre-qualifies the application if needed.
3. HR selects a hiring manager.
4. HR schedules the interview date and time.
5. Hiring manager receives the assigned interview in their interview page.

Result: The candidate enters the interview workflow.

## 12. Hiring Manager Review

1. Hiring manager signs in.
2. Hiring manager opens assigned interviews.
3. Hiring manager reviews job context, resume comments, and assessment comments.
4. Hiring manager writes review notes.
5. Hiring manager submits a recommendation.

Recommendation options include:

- Strongly recommend
- Acceptable
- Reject

Result: HR and agency users can use the hiring manager recommendation for next steps.

## 13. Monitor Recruiter Performance

1. Agency admin, HR, or recruiter opens `Performance`.
2. User selects a reporting period.
3. Available periods are:
   - last 7 days
   - last 30 days
   - last 90 days
   - all time
4. System shows recruiter activity.

Metrics include:

- candidates added
- matches created
- submissions sent
- pending submissions
- reviewed submissions
- accepted submissions
- rejected submissions
- last activity

Result: Agency leadership can compare recruiter activity and client outcomes.

## 14. End-To-End Flow Summary

1. Create recruiting agency workspace.
2. Add agency users.
3. Add client companies.
4. Create client jobs.
5. Add candidate profiles.
6. Upload and parse resumes.
7. Match candidates to client jobs.
8. Review matched applications.
9. Submit candidates to clients.
10. Track client feedback and submission status.
11. Schedule interviews when needed.
12. Hiring managers submit recommendations.
13. Review recruiter performance.

## Main Decision Points

1. Workspace type:
   - Direct employer
   - Recruiting agency

2. Candidate source:
   - Recruiter-created profile
   - Direct applicant profile

3. Candidate match:
   - Already matched to job
   - New match needed

4. Client submission status:
   - pending
   - reviewed
   - accepted
   - rejected

5. Interview recommendation:
   - Strongly recommend
   - Acceptable
   - Reject

## Suggested Flowchart Swimlanes

Use these lanes if you want to draw the workflow by actor:

1. Agency Admin
2. Agency HR / Recruiter
3. System
4. Client Company
5. Hiring Manager
6. Candidate / Applicant
