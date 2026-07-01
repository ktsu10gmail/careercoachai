To help an AI coding tool implement the first practical multi-market expansion for **CareerCoachAI**, this specification focuses on two markets only:

*   **English / Global:** `https://www.jetta.com`
*   **Taiwan:** `https://tw.jetta.com`

China market support is intentionally out of scope for now.

***

# **Project Specification: CareerCoachAI Taiwan Market Expansion**

## **1. Core Objective**
Create a Taiwan-specific version of CareerCoachAI while keeping the same core product, backend, database, and workflows.

The goal is not to rebuild the platform or create a separate product. The goal is to provide a Taiwan-facing front door with Traditional Chinese as the default language, Taiwan-specific messaging, and analytics that can show whether the Taiwan market is gaining traction.

## **2. Market and Domain Strategy**
Use host-based market detection:

*   `www.jetta.com`
    *   `market = global`
    *   default `locale = en`
    *   English/global copy and SEO metadata
*   `tw.jetta.com`
    *   `market = TW`
    *   default `locale = zh-TW`
    *   Taiwan-specific copy and SEO metadata

The market and locale should be related but separate concepts.

Example:

*   A Taiwan visitor using Traditional Chinese:
    *   `market = TW`
    *   `locale = zh-TW`
*   A Taiwan visitor who manually switches to English:
    *   `market = TW`
    *   `locale = en`

This keeps analytics useful without forcing every Taiwan visitor into one language.

## **3. Internationalization Strategy**

### **Phase 1: Manual Language Support**
Start with a simple, reliable i18n foundation:

*   Support `en` and `zh-TW`.
*   Add a persistent language switcher in the site header.
*   Save the user’s language choice in local storage or a cookie.
*   User language choice always wins over automatic host/default logic.
*   Localize the public/applicant-facing pages first.

Initial pages to localize:

*   Public homepage / applicant lead magnet
*   `/free-analysis`
*   `/applicant/setup`
*   `/applicant/login`
*   Key opt-in and Talent Network conversion copy

### **Phase 2: Host-Based Defaults**
After manual switching works:

*   Default `www.jetta.com` to English.
*   Default `tw.jetta.com` to Traditional Chinese.
*   Do not require IP-based language detection for the first Taiwan release.
*   If IP detection is added later, use it only as a suggestion or fallback, not as a hard redirect.

### **Recommended Framework**
Use a Next.js i18n approach such as `next-intl` or a lightweight local translation dictionary, depending on how much of the UI needs to be translated in the first release.

Important distinction:

*   Static UI text should come from translation files.
*   AI-generated analysis should be generated directly in the selected language instead of translated after the fact.

## **4. Taiwan-Facing User Experience**

Do not create a fourth product or a separate UI system. Reuse the existing app structure:

*   Employer/global entry: existing `3001` experience
*   Agency entry: existing `4001` experience
*   Applicant/public entry: existing `5001` experience
*   Platform Admin analytics: existing protected admin route

For Taiwan, customize the public/applicant front door first:

### **Applicant Page**
*   Taiwan-specific Traditional Chinese copy.
*   No-login resume-to-JD analysis remains the primary lead magnet.
*   Show Resume-to-JD Match Score and coaching insights in the selected language.
*   Keep the Talent Network opt-in flow.
*   Make the value proposition feel natural for Taiwan applicants and hiring expectations.

### **Employer and Agency Pages**
Keep the workflows the same for now.

Translate employer/agency pages later only if Taiwan employer adoption becomes a priority.

## **5. Resume Parsing and AI Output**

### **Phase 1: Use Existing Parsing First**
Use the current PDF/DOCX extraction pipeline first and test it with Traditional Chinese resumes.

Do not add PaddleOCR immediately unless scanned/image-based Traditional Chinese resumes become a common failure case.

### **Phase 2: OCR Fallback If Needed**
If Chinese resume extraction quality is poor:

*   Add OCR as a fallback only when text extraction is empty or clearly weak.
*   Consider PaddleOCR for scanned Traditional Chinese resumes.
*   Normalize all extraction output into the existing candidate profile schema:

```json
{
  "name": "",
  "email": "",
  "skills": [],
  "experience": [],
  "location": ""
}
```

### **AI Prompt Localization**
Pass the selected `locale` and `market` into AI prompt generation.

For example:

*   `locale = zh-TW`
*   `market = TW`

The AI should return applicant-facing analysis in Traditional Chinese when `locale = zh-TW`.

The core scoring logic should stay consistent across languages:

*   Resume-to-JD match score
*   Strengths
*   Weaknesses
*   Coaching recommendations
*   10/10 interview question structure when relevant
*   70% hard skill / 30% soft skill weighting when relevant

## **6. Analytics**
Extend the Platform Admin performance dashboard to support market and locale tracking.

Track these values in usage telemetry:

*   `market`
*   `locale`
*   `host`
*   `path`
*   `event_type`

Add dashboard views or filters for:

*   Visitors by market
*   Visitors by locale
*   Free analysis volume by market
*   Applicant signups by market
*   Talent Network opt-ins by market
*   Daily/monthly Taiwan usage trends

This lets the site admin answer:

*   Is `tw.jetta.com` getting traffic?
*   Are Taiwan visitors using the free analysis tool?
*   Are Taiwan visitors converting into applicant accounts or Talent Network profiles?
*   Is Traditional Chinese content improving engagement?

## **7. Infrastructure and Deployment**

### **Recommended Initial Setup**
Use the same server and same codebase.

Do not create a new server for Taiwan yet.

Recommended routing:

*   `www.jetta.com` -> existing English/global app
*   `tw.jetta.com` -> same app, Taiwan market default

Use host detection in the frontend and/or Next.js middleware to set the initial market and locale.

### **When to Consider a Separate Server Later**
Only consider a Taiwan-specific server or separate deployment if:

*   Taiwan traffic grows enough to need separate scaling.
*   A Taiwan partner requires hard data isolation.
*   Latency becomes a real user experience problem.
*   Compliance or hosting expectations require a Taiwan-specific deployment.
*   The Taiwan product evolves into a materially different offering.

## **8. Security and Privacy**
Keep the same RBAC and tenant-isolation rules.

For the Taiwan release:

*   Do not expose resume text or candidate details in analytics.
*   Keep Platform Admin analytics aggregated by default.
*   Track anonymous visitor/session IDs, market, locale, and event type.
*   Avoid storing unnecessary sensitive data in telemetry metadata.

## **9. Suggested Implementation Phases**

### **Phase 1: Taiwan Front Door**
*   Add market/locale detection based on host.
*   Add `en` and `zh-TW` UI translation structure.
*   Add language switcher.
*   Localize public/applicant pages.
*   Keep backend behavior mostly unchanged.

### **Phase 2: Taiwan Analytics**
*   Add `market` and `locale` to usage telemetry.
*   Add Platform Admin filters/charts for Taiwan usage.
*   Track Taiwan visitor-to-applicant conversion.

### **Phase 3: Traditional Chinese AI Output**
*   Pass selected locale into AI prompt generation.
*   Return applicant-facing analysis in Traditional Chinese for Taiwan users.
*   Validate tone and wording with native Traditional Chinese review if possible.

### **Phase 4: Resume Parsing Refinement**
*   Test existing PDF/DOCX extraction with Taiwan resumes.
*   Add OCR fallback only if needed.
*   Consider PaddleOCR later for scanned/image-based resumes.

***

### **Strategic Rationale**
This approach gives CareerCoachAI a practical Taiwan market launch without splitting the product too early. The platform can learn whether Taiwan users respond to the free CareerCoachAI analysis, Traditional Chinese messaging, and Talent Network opt-in flow while keeping infrastructure simple and measurable.
