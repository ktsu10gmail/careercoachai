# Career Coaching AI Frontend

Next.js + Tailwind frontend for the Career Coaching AI FastAPI backend.

## Getting Started

Run the FastAPI backend on port `8000`, then start the frontend:

```bash
source ~/.nvm/nvm.sh
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001).

The frontend proxies `/backend/*` to the FastAPI server. Override the target with `BACKEND_INTERNAL_URL` when needed.

```bash
cp .env.example .env.local
```

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint

## Migration Order

These FastAPI UI routes have Next.js equivalents:

- `/`
- `/ui`
- `/employer/setup`
- `/employer/login`
- `/employer/workspace`
- `/employer/admin`
- `/applicant/setup`
- `/applicant/login`
- `/applicant/portal`
- `/hr/dashboard`
- `/hiring_manager/interviews`

Shared API calls should live in `src/lib/api.ts`.

## Visible Playwright Browser

To let Codex and a human use the same browser without risking normal Chrome cookies, launch a sandbox Chrome profile with remote debugging:

```bash
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/recruit-mcp-chrome-profile \
  --no-first-run \
  --new-window \
  http://localhost:3001/hr/dashboard
```

Codex can then attach directly over CDP using Python Playwright:

```bash
.venv/bin/python - <<'PY'
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
    page = browser.contexts[0].pages[0]
    page.bring_to_front()
    page.goto("http://localhost:3001/hr/dashboard", wait_until="networkidle")
    print(page.title())
    browser.close()
PY
```

Verify the browser is attachable:

```bash
curl -sS http://127.0.0.1:9222/json/version
```
