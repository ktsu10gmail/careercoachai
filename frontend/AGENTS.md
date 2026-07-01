<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Local Visible Playwright Setup

For this repo, when the user asks to use Playwright, inspect UI, test a flow, or verify a frontend fix, prefer direct CDP attachment to a visible sandbox Chrome. The Codex/VS Code Playwright MCP launch path has been observed to force `--headless` and to ignore the saved `--cdp-endpoint` args in active chats. Direct CDP attachment works reliably and lets the user see/log into the same sandbox browser.

Use this workflow automatically:

1. Check whether sandbox Chrome is already running:

```bash
curl -sS http://127.0.0.1:9222/json/version
curl -sS http://127.0.0.1:9222/json/list
```

2. If port `9222` is not responding, start a visible sandbox Chrome:

```bash
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/recruit-mcp-chrome-profile \
  --no-first-run \
  --new-window \
  http://localhost:3001/hr/dashboard
```

3. Use direct CDP attachment from Python Playwright for visible shared testing:

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

4. If Playwright MCP was launched and conflicts with testing, kill stale MCP-launched headless sessions only. Do not kill the sandbox Chrome using `/tmp/recruit-mcp-chrome-profile`.

Useful checks:

```bash
codex mcp get playwright
ps -ef | rg 'playwright-mcp|mcp-chrome|mcp-chrome-visible' | rg -v rg
```

The user can safely log into the visible sandbox Chrome. It uses `/tmp/recruit-mcp-chrome-profile`, so it does not share cookies or extensions with the user's normal Chrome profile.

Do not rely on the `mcp__playwright_mcp` tool when the user needs to see or log into the browser. Use direct CDP attachment to `127.0.0.1:9222` instead.
