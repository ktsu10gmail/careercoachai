import os

from fastapi import APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse, Response

router = APIRouter()


def next_frontend_redirect(path: str = "/") -> RedirectResponse:
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001").rstrip("/")
    return RedirectResponse(url=f"{frontend_url}{path}", status_code=307)


DESIGN_CSS = """
:root {
    color-scheme: light;
    --ink: #17202e;
    --muted: #667084;
    --soft: #8b96a8;
    --line: #d8deea;
    --line-strong: #c2cad8;
    --panel: #ffffff;
    --surface: #f4f7fb;
    --surface-2: #edf2f7;
    --navy: #0f2742;
    --primary: #1f67c2;
    --primary-dark: #174f96;
    --green: #28785d;
    --amber: #b96f14;
    --danger: #b42318;
    --shadow: 0 18px 42px rgba(23, 32, 46, .10);
    --shadow-soft: 0 10px 24px rgba(23, 32, 46, .07);
}

* { box-sizing: border-box; }

html { min-height: 100%; }

body {
    min-height: 100vh;
    margin: 0 !important;
    color: var(--ink) !important;
    font-family: Aptos, "Segoe UI", ui-sans-serif, system-ui, sans-serif !important;
    background:
        linear-gradient(135deg, rgba(31, 103, 194, .08), transparent 34%),
        linear-gradient(180deg, #fbfcfe 0%, var(--surface) 44%, #eef3f8 100%) !important;
}

body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
        linear-gradient(rgba(15, 39, 66, .045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 39, 66, .045) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, .6), transparent 72%);
}

header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 18px !important;
    margin: 0 !important;
    padding: 16px clamp(18px, 4vw, 40px) !important;
    border: 0 !important;
    border-bottom: 1px solid rgba(216, 222, 234, .78) !important;
    background: rgba(255, 255, 255, .86) !important;
    backdrop-filter: blur(16px);
    box-shadow: 0 1px 0 rgba(255, 255, 255, .75) inset;
}

header strong,
.brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--navy);
    font-size: 15px !important;
    font-weight: 800 !important;
    letter-spacing: .01em;
}

header strong::before,
.brand::before {
    content: "";
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background:
        linear-gradient(135deg, var(--navy), var(--primary) 64%, #54a082);
    box-shadow: 0 8px 18px rgba(31, 103, 194, .22);
}

nav,
.docs {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

header a,
.docs a,
main a {
    color: var(--primary) !important;
    text-decoration: none !important;
    font-weight: 750 !important;
}

header a,
.docs a {
    margin: 0 !important;
    min-height: 34px;
    display: inline-flex !important;
    align-items: center;
    padding: 7px 10px;
    border-radius: 7px;
}

header a:hover,
.docs a:hover {
    background: rgba(31, 103, 194, .09);
}

main {
    position: relative;
    width: min(1180px, calc(100% - 32px)) !important;
    max-width: 1180px !important;
    margin: 0 auto !important;
    padding: clamp(28px, 5vw, 64px) 0 64px !important;
}

h1 {
    margin: 0 0 10px !important;
    color: var(--navy);
    font-size: clamp(30px, 5vw, 54px) !important;
    line-height: 1.02 !important;
    letter-spacing: 0 !important;
    font-weight: 850 !important;
}

h2 {
    margin: 0 0 18px !important;
    color: var(--navy);
    font-size: 18px !important;
    line-height: 1.2;
    letter-spacing: 0 !important;
    font-weight: 820 !important;
}

h3 {
    margin: 0 0 10px;
    color: var(--navy);
    font-size: 18px;
}

p,
.subhead,
.choice span,
a.card span,
.item p {
    color: var(--muted) !important;
    line-height: 1.55 !important;
}

.subhead {
    max-width: 720px !important;
    margin-bottom: 30px !important;
    font-size: 17px !important;
}

section,
.section,
.choice,
a.card,
.card {
    border: 1px solid rgba(216, 222, 234, .95) !important;
    border-radius: 8px !important;
    background: rgba(255, 255, 255, .9) !important;
    box-shadow: var(--shadow-soft);
}

section,
.section {
    padding: clamp(18px, 3vw, 26px) !important;
    margin: 0 0 18px !important;
}

.choices {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
    gap: 16px !important;
}

.choice,
a.card {
    min-height: 178px !important;
    padding: 24px !important;
    color: var(--ink) !important;
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.choice:hover,
a.card:hover,
.item:hover {
    transform: translateY(-2px);
    border-color: rgba(31, 103, 194, .34) !important;
    box-shadow: var(--shadow);
}

.choice strong,
a.card strong {
    display: block;
    margin-bottom: 8px !important;
    color: var(--navy);
    font-size: 22px !important;
}

form,
.results,
.questions {
    display: grid !important;
    gap: 14px !important;
}

.grid,
.field-grid,
.member-row,
.row {
    gap: 12px !important;
}

label {
    display: grid !important;
    gap: 7px !important;
    color: var(--muted) !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    letter-spacing: .03em;
    text-transform: uppercase;
}

input,
textarea,
select {
    width: 100% !important;
    min-height: 42px;
    margin: 0 !important;
    border: 1px solid var(--line) !important;
    border-radius: 7px !important;
    padding: 10px 12px !important;
    color: var(--ink) !important;
    background: #fff !important;
    font: inherit !important;
    letter-spacing: 0;
    text-transform: none;
    outline: none;
    transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
}

textarea {
    min-height: 112px;
    resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 4px rgba(31, 103, 194, .13);
}

button,
.action {
    min-height: 40px !important;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 7px !important;
    padding: 10px 14px !important;
    color: #fff !important;
    background: var(--primary) !important;
    box-shadow: 0 10px 20px rgba(31, 103, 194, .18);
    font: inherit !important;
    font-weight: 800 !important;
    cursor: pointer;
    transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
}

button:hover,
.action:hover {
    transform: translateY(-1px);
    background: var(--primary-dark) !important;
    box-shadow: 0 14px 26px rgba(31, 103, 194, .24);
}

.secondary,
button.secondary,
.action.secondary {
    color: var(--navy) !important;
    background: #e8edf4 !important;
    box-shadow: none;
}

.submit,
.choice.employer .action {
    background: var(--green) !important;
    box-shadow: 0 10px 20px rgba(40, 120, 93, .18);
}

.remove {
    color: var(--danger) !important;
    background: #f7e7e4 !important;
    box-shadow: none;
}

.actions {
    display: flex !important;
    gap: 10px !important;
    flex-wrap: wrap;
    margin-top: 14px !important;
}

.item {
    border: 1px solid var(--line) !important;
    border-radius: 8px !important;
    padding: 15px !important;
    background: #fff !important;
    box-shadow: 0 1px 0 rgba(255, 255, 255, .8) inset;
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.selected {
    border-color: var(--primary) !important;
    background: #eef5ff !important;
    box-shadow: 0 0 0 4px rgba(31, 103, 194, .08);
}

pre {
    display: none;
    margin-top: 16px !important;
    border: 1px solid #20344e !important;
    border-radius: 8px !important;
    padding: 14px !important;
    color: #edf6ff !important;
    background: #101a29 !important;
    overflow: auto !important;
    max-height: 360px !important;
}

table {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    margin-top: 14px !important;
    overflow: hidden;
    border: 1px solid var(--line) !important;
    border-radius: 8px;
    background: #fff;
}

th,
td {
    border: 0 !important;
    border-bottom: 1px solid var(--line) !important;
    padding: 12px !important;
    text-align: left !important;
    vertical-align: top;
}

th {
    color: var(--navy);
    background: var(--surface-2) !important;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .04em;
}

tr:last-child td { border-bottom: 0 !important; }

.status,
.verdict {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 3px 9px !important;
    border-radius: 999px !important;
    font-size: 12px;
    font-weight: 850;
}

.submitted { color: var(--amber); background: #fff1da !important; }
.prequalified { color: var(--primary-dark); background: #e7f1ff !important; }
.hire { color: var(--green); background: #e5f3ed !important; }
.reject { color: var(--danger); background: #f8e5e2 !important; }

details {
    border: 1px dashed var(--line-strong);
    border-radius: 8px;
    padding: 14px;
    background: #fbfcfe;
}

summary {
    color: var(--navy);
    font-weight: 850;
    cursor: pointer;
}

#auth_msg,
#apps_msg,
#qualified_msg {
    color: var(--muted);
    font-weight: 700;
}

#interviews_container {
    display: grid;
    gap: 14px;
    margin-top: 18px !important;
}

#interviews_container .card textarea {
    margin-top: 8px !important;
}

@media (max-width: 780px) {
    header {
        align-items: flex-start !important;
        flex-direction: column;
    }

    main {
        width: min(100% - 24px, 1180px) !important;
        padding-top: 24px !important;
    }

    .grid,
    .field-grid,
    .member-row,
    .row,
    .item {
        grid-template-columns: 1fr !important;
    }

    button,
    .action {
        width: 100%;
        justify-content: center;
    }

    table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }
}
"""


def with_design(html: str) -> str:
    return html.replace("</head>", '<link rel="stylesheet" href="/ui/design.css" />\n    </head>')


@router.get("/ui/design.css")
def ui_design_css():
    return Response(content=DESIGN_CSS, media_type="text/css")


@router.get("/ui", response_class=HTMLResponse)
def swagger_ui_landing():
    return next_frontend_redirect("/")
    html_content = """
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Career Coaching AI</title>
        <style>
            :root {
                color-scheme: light;
                --ink: #18212f;
                --muted: #657184;
                --line: #d8dee8;
                --panel: #ffffff;
                --surface: #f6f8fb;
                --primary: #1267a8;
                --primary-dark: #0d4f82;
                --green: #2f7d54;
            }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                color: var(--ink);
                background: var(--surface);
            }
            header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 18px 32px;
                border-bottom: 1px solid var(--line);
                background: var(--panel);
            }
            .brand { font-weight: 750; font-size: 20px; }
            .docs a { color: var(--muted); margin-left: 16px; text-decoration: none; font-size: 14px; }
            main {
                max-width: 960px;
                margin: 0 auto;
                padding: 72px 24px 48px;
            }
            h1 {
                max-width: 760px;
                margin: 0 0 14px;
                font-size: clamp(34px, 6vw, 58px);
                line-height: 1.04;
                letter-spacing: 0;
            }
            .subhead {
                max-width: 680px;
                margin: 0 0 34px;
                color: var(--muted);
                font-size: 18px;
                line-height: 1.55;
            }
            .choices {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 18px;
            }
            .choice {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 210px;
                padding: 24px;
                border: 1px solid var(--line);
                border-radius: 8px;
                background: var(--panel);
                text-decoration: none;
                color: var(--ink);
            }
            .choice strong { font-size: 24px; margin-bottom: 10px; display: block; }
            .choice span { color: var(--muted); line-height: 1.45; }
            .choice .action {
                display: inline-block;
                width: fit-content;
                margin-top: 24px;
                padding: 10px 14px;
                border-radius: 6px;
                background: var(--primary);
                color: white;
                font-weight: 650;
                text-decoration: none;
            }
            .choice .action.secondary {
                margin-left: 8px;
                background: #e9eef5;
                color: var(--ink);
            }
            .choice.employer .action { background: var(--green); }
            .choice.employer .action.secondary { background: #e9eef5; color: var(--ink); }
            .demo {
                margin-top: 28px;
                color: var(--muted);
                font-size: 14px;
                line-height: 1.6;
            }
            @media (max-width: 720px) {
                header { padding: 16px 20px; align-items: flex-start; gap: 12px; }
                .docs a { display: block; margin: 2px 0 0; }
                main { padding-top: 42px; }
                .choices { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <header>
            <div class="brand">Career Coaching AI</div>
            <nav class="docs">
                <a href="/docs">API Docs</a>
                <a href="/redoc">ReDoc</a>
            </nav>
        </header>
        <main>
            <h1>Recruiting workspace for applicants and employers</h1>
            <p class="subhead">Applicants can submit for open roles. Employers can create a company workspace, add recruiting users, publish jobs, review scored applications, and schedule interviews.</p>
            <section class="choices" aria-label="Choose your path">
                <article class="choice applicant">
                    <div>
                        <strong>Job Applicant</strong>
                        <span>Find a job link, answer the role questions, and upload a resume for review.</span>
                    </div>
                    <div>
                        <a class="action" href="/applicant/login">Log In</a>
                        <a class="action secondary" href="/applicant/setup">Create Account</a>
                    </div>
                </article>
                <article class="choice employer">
                    <div>
                        <strong>Employer</strong>
                        <span>Set up a company account with an admin, HR users, and hiring managers.</span>
                    </div>
                    <div>
                        <a class="action" href="/employer/login">Log In</a>
                        <a class="action secondary" href="/employer/setup">Create Account</a>
                    </div>
                </article>
            </section>
            <p class="demo">Existing demo pages remain available for HR and hiring managers after login: <a href="/hr/dashboard">HR dashboard</a> and <a href="/hiring_manager/interviews">interviews</a>.</p>
        </main>
    </body>
    </html>
    """
    return HTMLResponse(content=with_design(html_content))


@router.get("/employer/setup", response_class=HTMLResponse)
def employer_setup_form():
    return next_frontend_redirect("/employer/setup")
    html = """
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Employer Setup</title>
        <style>
            :root {
                --ink: #18212f;
                --muted: #657184;
                --line: #d8dee8;
                --panel: #ffffff;
                --surface: #f6f8fb;
                --primary: #1267a8;
                --green: #2f7d54;
                --danger: #b42318;
            }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                color: var(--ink);
                background: var(--surface);
            }
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 18px 32px;
                border-bottom: 1px solid var(--line);
                background: var(--panel);
            }
            header a { color: var(--primary); text-decoration: none; font-weight: 650; margin-left: 14px; }
            main {
                max-width: 1040px;
                margin: 0 auto;
                padding: 34px 24px 56px;
            }
            h1 { margin: 0 0 8px; font-size: 34px; letter-spacing: 0; }
            .subhead { margin: 0 0 28px; color: var(--muted); line-height: 1.5; }
            form {
                display: grid;
                gap: 18px;
            }
            section {
                border: 1px solid var(--line);
                border-radius: 8px;
                background: var(--panel);
                padding: 22px;
            }
            h2 { margin: 0 0 18px; font-size: 20px; letter-spacing: 0; }
            .grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 14px;
            }
            label {
                display: grid;
                gap: 6px;
                color: var(--muted);
                font-size: 13px;
                font-weight: 650;
            }
            input, select {
                width: 100%;
                min-height: 42px;
                border: 1px solid var(--line);
                border-radius: 6px;
                padding: 9px 10px;
                color: var(--ink);
                background: white;
                font: inherit;
            }
            .member-row {
                display: grid;
                grid-template-columns: 1.3fr 1.5fr 1fr auto;
                gap: 10px;
                align-items: end;
                margin-top: 10px;
            }
            button {
                min-height: 42px;
                border: 0;
                border-radius: 6px;
                padding: 10px 14px;
                font: inherit;
                font-weight: 700;
                cursor: pointer;
            }
            .secondary { background: #e9eef5; color: var(--ink); }
            .remove { background: #f5e8e7; color: var(--danger); }
            .submit { background: var(--green); color: white; width: fit-content; }
            .actions { display: flex; gap: 10px; flex-wrap: wrap; }
            pre {
                margin: 18px 0 0;
                border: 1px solid var(--line);
                border-radius: 8px;
                padding: 14px;
                background: #101828;
                color: white;
                overflow: auto;
                max-height: 360px;
                display: none;
            }
            .error { color: var(--danger); }
            @media (max-width: 760px) {
                header { padding: 16px 20px; }
                main { padding: 24px 16px 42px; }
                .grid, .member-row { grid-template-columns: 1fr; }
                .submit { width: 100%; }
            }
        </style>
    </head>
    <body>
        <header>
            <strong>Career Coaching AI</strong>
            <nav>
                <a href="#" onclick="history.back(); return false;">Back</a>
                <a href="/ui">Home</a>
            </nav>
        </header>
        <main>
            <h1>Company Setup</h1>
            <p class="subhead">Create the employer workspace and the first recruiting users.</p>
            <form id="setup-form">
                <section>
                    <h2>Company Information</h2>
                    <div class="grid">
                        <label>Company Name
                            <input id="company_name" required minlength="2" placeholder="Acme Health" />
                        </label>
                        <label>Industry
                            <input id="industry" placeholder="Healthcare" />
                        </label>
                        <label>Website
                            <input id="website" placeholder="https://example.com" />
                        </label>
                        <label>Company Size
                            <select id="size">
                                <option value="">Select size</option>
                                <option>1-10</option>
                                <option>11-50</option>
                                <option>51-200</option>
                                <option>201-1000</option>
                                <option>1000+</option>
                            </select>
                        </label>
                    </div>
                </section>
                <section>
                    <h2>Company Admin</h2>
                    <div class="grid">
                        <label>Name
                            <input id="admin_name" required minlength="2" placeholder="Alex Morgan" />
                        </label>
                        <label>Email
                            <input id="admin_email" required type="email" placeholder="admin@example.com" />
                        </label>
                        <label>Password
                            <input id="admin_password" required type="password" minlength="8" placeholder="Minimum 8 characters" />
                        </label>
                    </div>
                </section>
                <section>
                    <h2>HR Users</h2>
                    <div id="hr_rows"></div>
                    <button class="secondary" type="button" id="add_hr">Add HR User</button>
                </section>
                <section>
                    <h2>Hiring Managers</h2>
                    <div id="manager_rows"></div>
                    <button class="secondary" type="button" id="add_manager">Add Hiring Manager</button>
                </section>
                <div class="actions">
                    <button class="submit" type="submit">Create Company Workspace</button>
                    <button class="secondary" type="reset">Clear</button>
                </div>
            </form>
            <pre id="out"></pre>
        </main>
        <script>
            const out = document.getElementById('out');

            function memberRow(type) {
                const row = document.createElement('div');
                row.className = 'member-row';
                row.innerHTML = `
                    <label>Name
                        <input data-field="name" required minlength="2" placeholder="${type === 'HR' ? 'Jamie Lee' : 'Taylor Smith'}" />
                    </label>
                    <label>Email
                        <input data-field="email" required type="email" placeholder="${type === 'HR' ? 'hr@example.com' : 'manager@example.com'}" />
                    </label>
                    <label>Password
                        <input data-field="password" type="password" minlength="8" value="changeme123" />
                    </label>
                    <button type="button" class="remove">Remove</button>
                `;
                row.querySelector('.remove').onclick = () => row.remove();
                return row;
            }

            function collectMembers(containerId, role) {
                return Array.from(document.querySelectorAll(`#${containerId} .member-row`)).map(row => ({
                    name: row.querySelector('[data-field="name"]').value.trim(),
                    email: row.querySelector('[data-field="email"]').value.trim(),
                    password: row.querySelector('[data-field="password"]').value || 'changeme123',
                    role
                })).filter(member => member.name || member.email);
            }

            document.getElementById('add_hr').onclick = () => document.getElementById('hr_rows').appendChild(memberRow('HR'));
            document.getElementById('add_manager').onclick = () => document.getElementById('manager_rows').appendChild(memberRow('Hiring_Manager'));
            document.getElementById('hr_rows').appendChild(memberRow('HR'));
            document.getElementById('manager_rows').appendChild(memberRow('Hiring_Manager'));

            document.getElementById('setup-form').onsubmit = async (event) => {
                event.preventDefault();
                out.style.display = 'block';
                out.className = '';
                out.textContent = 'Creating company workspace...';

                const payload = {
                    company: {
                        name: document.getElementById('company_name').value.trim(),
                        industry: document.getElementById('industry').value.trim() || null,
                        website: document.getElementById('website').value.trim() || null,
                        size: document.getElementById('size').value || null
                    },
                    admin: {
                        name: document.getElementById('admin_name').value.trim(),
                        email: document.getElementById('admin_email').value.trim(),
                        password: document.getElementById('admin_password').value
                    },
                    hr_members: collectMembers('hr_rows', 'HR'),
                    hiring_managers: collectMembers('manager_rows', 'Hiring_Manager')
                };

                try {
                    const res = await fetch('/employer/setup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        out.className = 'error';
                        out.textContent = JSON.stringify(data, null, 2);
                        return;
                    }
                    out.textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    out.className = 'error';
                    out.textContent = error.message;
                }
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=with_design(html))


@router.get("/employer/login", response_class=HTMLResponse)
def employer_login_form():
    return next_frontend_redirect("/employer/login")
    html = """
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Employer Login</title>
        <style>
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18212f; background: #f6f8fb; }
            header { display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; border-bottom: 1px solid #d8dee8; background: white; }
            header a { color: #1267a8; text-decoration: none; font-weight: 650; margin-left: 14px; }
            main { max-width: 560px; margin: 0 auto; padding: 42px 24px; }
            section { border: 1px solid #d8dee8; border-radius: 8px; background: white; padding: 24px; }
            h1 { margin: 0 0 8px; font-size: 34px; letter-spacing: 0; }
            p { margin: 0 0 24px; color: #657184; line-height: 1.5; }
            form { display: grid; gap: 14px; }
            label { display: grid; gap: 6px; color: #657184; font-size: 13px; font-weight: 650; }
            input { min-height: 42px; border: 1px solid #d8dee8; border-radius: 6px; padding: 9px 10px; font: inherit; }
            button { min-height: 42px; border: 0; border-radius: 6px; padding: 10px 14px; font: inherit; font-weight: 700; cursor: pointer; background: #2f7d54; color: white; width: fit-content; }
            pre { display: none; margin-top: 18px; border: 1px solid #d8dee8; border-radius: 8px; padding: 14px; background: #101828; color: white; overflow: auto; }
            .error { color: #ffdad6; }
            @media (max-width: 640px) { header { padding: 16px 20px; } main { padding: 28px 16px; } button { width: 100%; } }
        </style>
    </head>
    <body>
        <header>
            <strong>Career Coaching AI</strong>
            <nav>
                <a href="#" onclick="history.back(); return false;">Back</a>
                <a href="/ui">Home</a>
            </nav>
        </header>
        <main>
            <h1>Employer Login</h1>
            <p>Sign in as a company admin, HR user, or hiring manager.</p>
            <section>
                <form id="login-form">
                    <label>Email
                        <input id="email" required type="email" placeholder="hr@example.com" />
                    </label>
                    <label>Password
                        <input id="password" required type="password" />
                    </label>
                    <button type="submit">Log In</button>
                </form>
                <pre id="out"></pre>
            </section>
        </main>
        <script>
            const out = document.getElementById('out');
            document.getElementById('login-form').onsubmit = async (event) => {
                event.preventDefault();
                out.style.display = 'block';
                out.className = '';
                out.textContent = 'Signing in...';
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                try {
                    const tokenRes = await fetch('/auth/token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ username: email, password })
                    });
                    const tokenData = await tokenRes.json();
                    if (!tokenRes.ok) {
                        out.className = 'error';
                        out.textContent = JSON.stringify(tokenData, null, 2);
                        return;
                    }
                    sessionStorage.setItem('employer_token', tokenData.access_token);
                    localStorage.setItem('employer_token', tokenData.access_token);
                    const payload = JSON.parse(atob(tokenData.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                    out.textContent = 'Signed in. Choose your workspace.';
                    window.location.href = '/employer/workspace';
                } catch (error) {
                    out.className = 'error';
                    out.textContent = error.message;
                }
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=with_design(html))


@router.get("/employer/workspace", response_class=HTMLResponse)
def employer_workspace():
    return next_frontend_redirect("/employer/workspace")
    html = """
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Employer Workspace</title>
        <style>
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18212f; background: #f6f8fb; }
            header { display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; border-bottom: 1px solid #d8dee8; background: white; }
            header a { color: #1267a8; text-decoration: none; font-weight: 650; margin-left: 14px; }
            main { max-width: 860px; margin: 0 auto; padding: 42px 24px; }
            h1 { margin: 0 0 8px; font-size: 34px; letter-spacing: 0; }
            p { color: #657184; line-height: 1.5; }
            .choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 22px; }
            a.card { border: 1px solid #d8dee8; border-radius: 8px; background: white; padding: 22px; text-decoration: none; color: #18212f; }
            a.card strong { display: block; font-size: 22px; margin-bottom: 8px; }
            a.card span { color: #657184; line-height: 1.45; }
            @media (max-width: 720px) { header { padding: 16px 20px; } main { padding: 28px 16px; } .choices { grid-template-columns: 1fr; } }
        </style>
    </head>
    <body>
        <header>
            <strong>Career Coaching AI</strong>
            <nav>
                <a href="#" onclick="history.back(); return false;">Back</a>
                <a href="/ui">Home</a>
            </nav>
        </header>
        <main>
            <h1>Employer Workspace</h1>
            <p>Use the workspace that matches your role. Your login token will be carried into the selected page.</p>
            <section class="choices">
                <a class="card" href="/employer/admin">
                    <strong>Company Admin</strong>
                    <span>Manage company users, correct emails, and reset passwords.</span>
                </a>
                <a class="card" href="/hr/dashboard">
                    <strong>HR Dashboard</strong>
                    <span>Create jobs, review applications, pre-qualify candidates, and schedule interviews.</span>
                </a>
                <a class="card" href="/hiring_manager/interviews">
                    <strong>Hiring Manager</strong>
                    <span>Review assigned interviews and submit hiring decisions.</span>
                </a>
            </section>
        </main>
        <script>
            const token = sessionStorage.getItem('employer_token') || localStorage.getItem('employer_token');
            if (token) sessionStorage.setItem('employer_token', token);
            if (!token) window.location.href = '/employer/login';
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=with_design(html))


@router.get("/employer/admin", response_class=HTMLResponse)
def employer_admin_page():
    return next_frontend_redirect("/employer/admin")
    html = """
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Company Admin</title>
        <style>
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18212f; background: #f6f8fb; }
            header { display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; border-bottom: 1px solid #d8dee8; background: white; }
            header a { color: #1267a8; text-decoration: none; font-weight: 650; margin-left: 14px; }
            main { max-width: 1120px; margin: 0 auto; padding: 30px 24px 56px; display: grid; gap: 18px; }
            section { border: 1px solid #d8dee8; border-radius: 8px; background: white; padding: 20px; }
            h1 { margin: 0; font-size: 30px; letter-spacing: 0; }
            h2 { margin: 0 0 14px; font-size: 20px; letter-spacing: 0; }
            .grid { display: grid; grid-template-columns: 1.2fr 1.5fr 1fr 1fr auto; gap: 10px; align-items: end; }
            .row { display: grid; grid-template-columns: 70px 1.2fr 1.5fr 1fr 1fr auto; gap: 10px; align-items: end; padding: 12px 0; border-top: 1px solid #eef1f5; }
            label { display: grid; gap: 6px; color: #657184; font-size: 13px; font-weight: 650; }
            input, select { width: 100%; min-height: 40px; border: 1px solid #d8dee8; border-radius: 6px; padding: 8px 10px; font: inherit; }
            button { min-height: 40px; border: 0; border-radius: 6px; padding: 9px 13px; font: inherit; font-weight: 700; cursor: pointer; background: #1267a8; color: white; }
            button.secondary { background: #e9eef5; color: #18212f; }
            pre { display: none; margin: 0; border: 1px solid #d8dee8; border-radius: 8px; padding: 14px; background: #101828; color: white; overflow: auto; max-height: 260px; }
            @media (max-width: 900px) { header { padding: 16px 20px; } main { padding: 22px 16px 42px; } .grid, .row { grid-template-columns: 1fr; } }
        </style>
    </head>
    <body>
        <header>
            <strong>Company Admin</strong>
            <nav>
                <a href="#" onclick="history.back(); return false;">Back</a>
                <a href="/employer/workspace">Workspace</a>
                <a href="/ui">Home</a>
            </nav>
        </header>
        <main>
            <h1>Manage Employer Users</h1>
            <section>
                <h2>Add User</h2>
                <div class="grid">
                    <label>Name
                        <input id="new_name" placeholder="Helen HR" />
                    </label>
                    <label>Email
                        <input id="new_email" type="email" placeholder="hr@example.com" />
                    </label>
                    <label>Password
                        <input id="new_password" type="password" value="changeme123" />
                    </label>
                    <label>Role
                        <select id="new_role">
                            <option value="HR">HR</option>
                            <option value="Hiring_Manager">Hiring Manager</option>
                            <option value="Company_Admin">Company Admin</option>
                        </select>
                    </label>
                    <button id="add_user">Add</button>
                </div>
            </section>
            <section>
                <h2>Team</h2>
                <div id="users"></div>
            </section>
            <pre id="out"></pre>
        </main>
        <script>
            const out = document.getElementById('out');
            const token = sessionStorage.getItem('employer_token') || localStorage.getItem('employer_token');
            if (token) sessionStorage.setItem('employer_token', token);
            if (!token) window.location.href = '/employer/login';
            const authHeaders = () => ({ 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' });
            const show = (text) => { out.style.display = 'block'; out.textContent = text; };

            async function loadUsers() {
                const res = await fetch('/employer/users', { headers: authHeaders() });
                if (res.status === 401 || res.status === 403) {
                    sessionStorage.removeItem('employer_token');
                    localStorage.removeItem('employer_token');
                    window.location.href = '/employer/login';
                    return;
                }
                const users = await res.json();
                const container = document.getElementById('users');
                container.innerHTML = '';
                users.forEach(user => {
                    const row = document.createElement('div');
                    row.className = 'row';
                    row.innerHTML = `
                        <div><strong>#${user.id}</strong></div>
                        <label>Name<input data-field="name" value="${user.name}"></label>
                        <label>Email<input data-field="email" type="email" value="${user.email}"></label>
                        <label>New Password<input data-field="password" type="password" placeholder="Leave blank"></label>
                        <label>Role
                            <select data-field="role">
                                <option value="Company_Admin"${user.role === 'Company_Admin' ? ' selected' : ''}>Company Admin</option>
                                <option value="HR"${user.role === 'HR' ? ' selected' : ''}>HR</option>
                                <option value="Hiring_Manager"${user.role === 'Hiring_Manager' ? ' selected' : ''}>Hiring Manager</option>
                            </select>
                        </label>
                        <button>Save</button>
                    `;
                    row.querySelector('button').onclick = async () => {
                        const payload = {
                            name: row.querySelector('[data-field="name"]').value.trim(),
                            email: row.querySelector('[data-field="email"]').value.trim(),
                            role: row.querySelector('[data-field="role"]').value
                        };
                        const password = row.querySelector('[data-field="password"]').value;
                        if (password) payload.password = password;
                        const save = await fetch(`/employer/users/${user.id}`, {
                            method: 'PATCH',
                            headers: authHeaders(),
                            body: JSON.stringify(payload)
                        });
                        const data = await save.json();
                        show(JSON.stringify(data, null, 2));
                        if (save.ok) loadUsers();
                    };
                    container.appendChild(row);
                });
            }

            document.getElementById('add_user').onclick = async () => {
                const payload = {
                    name: document.getElementById('new_name').value.trim(),
                    email: document.getElementById('new_email').value.trim(),
                    password: document.getElementById('new_password').value,
                    role: document.getElementById('new_role').value
                };
                const res = await fetch('/employer/users', {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                show(JSON.stringify(data, null, 2));
                if (res.ok) {
                    document.getElementById('new_name').value = '';
                    document.getElementById('new_email').value = '';
                    document.getElementById('new_password').value = 'changeme123';
                    loadUsers();
                }
            };

            loadUsers();
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=with_design(html))


@router.get("/applicant/setup", response_class=HTMLResponse)
def applicant_setup_form():
    return next_frontend_redirect("/applicant/setup")
    html = """
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Applicant Setup</title>
                <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18212f; background: #f6f8fb; }
                    header { display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; border-bottom: 1px solid #d8dee8; background: white; }
                    header a { color: #1267a8; text-decoration: none; font-weight: 650; margin-left: 14px; }
                    main { max-width: 720px; margin: 0 auto; padding: 42px 24px; }
                    section { border: 1px solid #d8dee8; border-radius: 8px; background: white; padding: 24px; }
                    h1 { margin: 0 0 8px; font-size: 34px; letter-spacing: 0; }
                    p { margin: 0 0 24px; color: #657184; line-height: 1.5; }
                    form { display: grid; gap: 14px; }
                    label { display: grid; gap: 6px; color: #657184; font-size: 13px; font-weight: 650; }
                    input { min-height: 42px; border: 1px solid #d8dee8; border-radius: 6px; padding: 9px 10px; font: inherit; }
                    button { min-height: 42px; border: 0; border-radius: 6px; padding: 10px 14px; font: inherit; font-weight: 700; cursor: pointer; background: #1267a8; color: white; width: fit-content; }
                    pre { display: none; margin-top: 18px; border: 1px solid #d8dee8; border-radius: 8px; padding: 14px; background: #101828; color: white; overflow: auto; }
                    .error { color: #ffdad6; }
                    @media (max-width: 640px) { header { padding: 16px 20px; } main { padding: 28px 16px; } button { width: 100%; } }
                </style>
            </head>
            <body>
                <header>
                    <strong>Career Coaching AI</strong>
                    <nav>
                        <a href="#" onclick="history.back(); return false;">Back</a>
                        <a href="/ui">Home</a>
                    </nav>
                </header>
                <main>
                    <h1>Applicant Account</h1>
                    <p>Create your applicant account, then search employers and apply for jobs.</p>
                    <section>
                        <form id="signup-form">
                            <label>Name
                                <input id="name" required minlength="2" placeholder="Jordan Lee" />
                            </label>
                            <label>Email
                                <input id="email" required type="email" placeholder="jordan@example.com" />
                            </label>
                            <label>Password
                                <input id="password" required type="password" minlength="8" placeholder="Minimum 8 characters" />
                            </label>
                            <button type="submit">Create Account</button>
                        </form>
                        <pre id="out"></pre>
                    </section>
                </main>
                <script>
                    const out = document.getElementById('out');
                    document.getElementById('signup-form').onsubmit = async (event) => {
                        event.preventDefault();
                        out.style.display = 'block';
                        out.className = '';
                        out.textContent = 'Creating account...';
                        const email = document.getElementById('email').value.trim();
                        const password = document.getElementById('password').value;
                        try {
                            const signup = await fetch('/auth/signup', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    name: document.getElementById('name').value.trim(),
                                    email,
                                    password,
                                    role: 'Applicant'
                                })
                            });
                            const signupData = await signup.json();
                            if (!signup.ok) {
                                out.className = 'error';
                                out.textContent = JSON.stringify(signupData, null, 2);
                                return;
                            }
                            const tokenRes = await fetch('/auth/token', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: new URLSearchParams({ username: email, password })
                            });
                            const tokenData = await tokenRes.json();
                            if (!tokenRes.ok) {
                                out.className = 'error';
                                out.textContent = JSON.stringify(tokenData, null, 2);
                                return;
                            }
                            sessionStorage.removeItem('applicant_token');
                            sessionStorage.setItem('applicant_token', tokenData.access_token);
                            window.location.href = '/applicant/portal';
                        } catch (error) {
                            out.className = 'error';
                            out.textContent = error.message;
                        }
                    };
                </script>
            </body>
        </html>
        """
    return HTMLResponse(content=with_design(html))


@router.get("/applicant/login", response_class=HTMLResponse)
def applicant_login_form():
    return next_frontend_redirect("/applicant/login")
    html = """
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Applicant Login</title>
                <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18212f; background: #f6f8fb; }
                    header { display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; border-bottom: 1px solid #d8dee8; background: white; }
                    header a { color: #1267a8; text-decoration: none; font-weight: 650; margin-left: 14px; }
                    main { max-width: 560px; margin: 0 auto; padding: 42px 24px; }
                    section { border: 1px solid #d8dee8; border-radius: 8px; background: white; padding: 24px; }
                    h1 { margin: 0 0 8px; font-size: 34px; letter-spacing: 0; }
                    p { margin: 0 0 24px; color: #657184; line-height: 1.5; }
                    form { display: grid; gap: 14px; }
                    label { display: grid; gap: 6px; color: #657184; font-size: 13px; font-weight: 650; }
                    input { min-height: 42px; border: 1px solid #d8dee8; border-radius: 6px; padding: 9px 10px; font: inherit; }
                    button { min-height: 42px; border: 0; border-radius: 6px; padding: 10px 14px; font: inherit; font-weight: 700; cursor: pointer; background: #1267a8; color: white; width: fit-content; }
                    pre { display: none; margin-top: 18px; border: 1px solid #d8dee8; border-radius: 8px; padding: 14px; background: #101828; color: white; overflow: auto; }
                    .error { color: #ffdad6; }
                    @media (max-width: 640px) { header { padding: 16px 20px; } main { padding: 28px 16px; } button { width: 100%; } }
                </style>
            </head>
            <body>
                <header>
                    <strong>Career Coaching AI</strong>
                    <nav>
                        <a href="#" onclick="history.back(); return false;">Back</a>
                        <a href="/ui">Home</a>
                    </nav>
                </header>
                <main>
                    <h1>Applicant Login</h1>
                    <p>Sign in to search employers and apply for jobs.</p>
                    <section>
                        <form id="login-form">
                            <label>Email
                                <input id="email" required type="email" placeholder="candidate@example.com" />
                            </label>
                            <label>Password
                                <input id="password" required type="password" />
                            </label>
                            <button type="submit">Log In</button>
                        </form>
                        <pre id="out"></pre>
                    </section>
                </main>
                <script>
                    const out = document.getElementById('out');
                    document.getElementById('login-form').onsubmit = async (event) => {
                        event.preventDefault();
                        out.style.display = 'block';
                        out.className = '';
                        out.textContent = 'Signing in...';
                        try {
                            const tokenRes = await fetch('/auth/token', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: new URLSearchParams({
                                    username: document.getElementById('email').value.trim(),
                                    password: document.getElementById('password').value
                                })
                            });
                            const tokenData = await tokenRes.json();
                            if (!tokenRes.ok) {
                                out.className = 'error';
                                out.textContent = JSON.stringify(tokenData, null, 2);
                                return;
                            }
                            sessionStorage.removeItem('applicant_token');
                            sessionStorage.setItem('applicant_token', tokenData.access_token);
                            window.location.href = '/applicant/portal';
                        } catch (error) {
                            out.className = 'error';
                            out.textContent = error.message;
                        }
                    };
                </script>
            </body>
        </html>
        """
    return HTMLResponse(content=with_design(html))


@router.get("/applicant/portal", response_class=HTMLResponse)
def applicant_portal():
    return next_frontend_redirect("/applicant/portal")
    html = """
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Applicant Portal</title>
                <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18212f; background: #f6f8fb; }
                    header { display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; border-bottom: 1px solid #d8dee8; background: white; }
                    header a { color: #1267a8; text-decoration: none; font-weight: 650; margin-left: 14px; }
                    main { max-width: 1100px; margin: 0 auto; padding: 30px 24px 56px; display: grid; gap: 18px; }
                    section { border: 1px solid #d8dee8; border-radius: 8px; background: white; padding: 20px; }
                    h1 { margin: 0; font-size: 30px; letter-spacing: 0; }
                    h2 { margin: 0 0 14px; font-size: 20px; letter-spacing: 0; }
                    label { display: grid; gap: 6px; color: #657184; font-size: 13px; font-weight: 650; }
                    input, textarea { width: 100%; border: 1px solid #d8dee8; border-radius: 6px; padding: 9px 10px; font: inherit; }
                    input { min-height: 42px; }
                    button { min-height: 40px; border: 0; border-radius: 6px; padding: 9px 13px; font: inherit; font-weight: 700; cursor: pointer; background: #1267a8; color: white; }
                    button.secondary { background: #e9eef5; color: #18212f; }
                    .grid { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: end; }
                    .results { display: grid; gap: 10px; margin-top: 14px; }
                    .item { border: 1px solid #d8dee8; border-radius: 8px; padding: 14px; display: flex; justify-content: space-between; gap: 14px; align-items: center; }
                    .item p { margin: 4px 0 0; color: #657184; line-height: 1.4; }
                    .selected { border-color: #1267a8; background: #eef6fd; }
                    .questions { display: grid; gap: 14px; margin-top: 12px; }
                    pre { margin: 0; border: 1px solid #d8dee8; border-radius: 8px; padding: 14px; background: #101828; color: white; overflow: auto; max-height: 320px; display: none; }
                    @media (max-width: 760px) { header { padding: 16px 20px; } main { padding: 22px 16px 42px; } .grid, .item { grid-template-columns: 1fr; display: grid; } }
                </style>
            </head>
            <body>
                <header>
                    <strong>Career Coaching AI</strong>
                    <nav>
                        <a href="#" onclick="history.back(); return false;">Back</a>
                        <a href="/ui">Home</a>
                    </nav>
                </header>
                <main>
                    <h1>Applicant Portal</h1>
                    <section>
                        <h2>1. Find Employer</h2>
                        <div class="grid">
                            <label>Employer Search
                                <input id="company_query" placeholder="Enter employer name, industry, or slug" />
                            </label>
                            <button id="search_companies">Search</button>
                        </div>
                        <div id="companies" class="results"></div>
                    </section>
                    <section>
                        <h2>2. Find Job</h2>
                        <div class="grid">
                            <label>Keyword
                                <input id="job_keyword" placeholder="Backend, nurse, sales, analyst" />
                            </label>
                            <button id="search_jobs">Search Jobs</button>
                        </div>
                        <div id="jobs" class="results"></div>
                    </section>
                    <section>
                        <h2>3. Apply</h2>
                        <label>Selected Job URL
                            <input id="job_url" readonly placeholder="Select a job above" />
                        </label>
                        <div id="questions" class="questions"></div>
                        <label>Resume
                            <input type="file" id="resume" />
                        </label>
                        <button id="submit">Submit Application</button>
                    </section>
                    <pre id="out"></pre>
                </main>

                <script>
                    const out = document.getElementById('out');
                    let selectedCompanyId = null;
                    let selectedJob = null;
                    const showOut = (text) => { out.style.display = 'block'; out.textContent = text; };

                    async function requireApplicantToken() {
                        const token = sessionStorage.getItem('applicant_token');
                        if (!token) {
                            window.location.href = '/applicant/login';
                            return null;
                        }
                        const res = await fetch('/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
                        if (!res.ok) {
                            sessionStorage.removeItem('applicant_token');
                            window.location.href = '/applicant/login';
                            return null;
                        }
                        const user = await res.json();
                        if (user.role !== 'Applicant') {
                            sessionStorage.removeItem('applicant_token');
                            showOut('Please log in with an applicant account.');
                            setTimeout(() => window.location.href = '/applicant/login', 900);
                            return null;
                        }
                        return token;
                    }

                    requireApplicantToken();

                    document.getElementById('search_companies').onclick = async () => {
                        const q = document.getElementById('company_query').value.trim();
                        const res = await fetch(`/companies?q=${encodeURIComponent(q)}`);
                        const companies = await res.json();
                        const container = document.getElementById('companies');
                        container.innerHTML = '';
                        companies.forEach(company => {
                            const item = document.createElement('div');
                            item.className = 'item';
                            item.innerHTML = `<div><strong>${company.name}</strong><p>${company.industry || 'Industry not set'} ${company.size ? '&middot; ' + company.size : ''}</p></div><button>Select</button>`;
                            item.querySelector('button').onclick = () => {
                                selectedCompanyId = company.id;
                                selectedJob = null;
                                document.getElementById('job_url').value = '';
                                document.getElementById('jobs').innerHTML = '';
                                document.getElementById('questions').innerHTML = '';
                                document.querySelectorAll('#companies .item').forEach(el => el.classList.remove('selected'));
                                item.classList.add('selected');
                            };
                            container.appendChild(item);
                        });
                        if (!companies.length) container.innerHTML = '<p>No employers found.</p>';
                    };

                    document.getElementById('search_jobs').onclick = async () => {
                        if (!selectedCompanyId) { showOut('Select an employer first.'); return; }
                        const keyword = document.getElementById('job_keyword').value.trim();
                        const res = await fetch(`/companies/${selectedCompanyId}/jobs?keyword=${encodeURIComponent(keyword)}`);
                        const jobs = await res.json();
                        const container = document.getElementById('jobs');
                        container.innerHTML = '';
                        jobs.forEach(job => {
                            const item = document.createElement('div');
                            item.className = 'item';
                            item.innerHTML = `<div><strong>${job.title}</strong><p>${job.position} ${job.salary_range ? '&middot; ' + job.salary_range : ''}</p></div><button>Select</button>`;
                            item.querySelector('button').onclick = async () => {
                                selectedJob = job;
                                document.getElementById('job_url').value = job.job_url;
                                document.querySelectorAll('#jobs .item').forEach(el => el.classList.remove('selected'));
                                item.classList.add('selected');
                                await loadQuestions();
                            };
                            container.appendChild(item);
                        });
                        if (!jobs.length) container.innerHTML = '<p>No jobs found for this employer.</p>';
                    };

                    async function loadQuestions() {
                        const jobUrl = document.getElementById('job_url').value;
                        const res = await fetch(`/jobs/${encodeURIComponent(jobUrl)}/questions`);
                        if (!res.ok) { showOut('Failed to load questions'); return; }
                        const qs = await res.json();
                        const container = document.getElementById('questions');
                        container.innerHTML = '';
                        qs.forEach(q => {
                            const div = document.createElement('div');
                            div.innerHTML = `<label>Q${q.id}: ${q.text}<textarea data-qid="${q.id}" rows="3"></textarea></label>`;
                            container.appendChild(div);
                        });
                    }

                    document.getElementById('submit').onclick = async () => {
                        const token = await requireApplicantToken();
                        if (!token) return;
                        const jobUrl = document.getElementById('job_url').value;
                        if (!jobUrl) { showOut('Select a job first.'); return; }
                        // fetch job to get job_id
                        const jobRes = await fetch(`/jobs/${encodeURIComponent(jobUrl)}`);
                        if (!jobRes.ok) { showOut('Job not found'); return; }
                        const job = await jobRes.json();
                        const job_id = job.id;

                        const form = new FormData();
                        const answers = [];
                        document.querySelectorAll('#questions textarea').forEach(t => {
                            const qid = parseInt(t.dataset.qid);
                            answers.push({ question_id: qid, answer_text: t.value });
                        });
                        form.append('application_in', JSON.stringify({ job_id, answers }));
                        const resumeEl = document.getElementById('resume');
                        if (resumeEl.files.length === 0) { showOut('Choose a resume file.'); return; }
                        form.append('resume', resumeEl.files[0]);

                        const resp = await fetch('/applications', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: form });
                        const text = await resp.text();
                        if (resp.status === 401) {
                            sessionStorage.removeItem('applicant_token');
                            showOut('Your login expired. Please log in again.');
                            setTimeout(() => window.location.href = '/applicant/login', 900);
                            return;
                        }
                        showOut(`Status: ${resp.status}\n\n${text}`);
                    };
                </script>
            </body>
        </html>
        """
    return HTMLResponse(content=with_design(html))


@router.get("/hr/dashboard", response_class=HTMLResponse)
def hr_dashboard():
    return next_frontend_redirect("/hr/dashboard")
    html = """
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HR Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            header { display: flex; justify-content: space-between; align-items: center; margin: -20px -20px 20px; padding: 18px 32px; border-bottom: 1px solid #ddd; background: white; }
            header a { color: #0066cc; text-decoration: none; font-weight: 700; margin-left: 14px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
            input, textarea, button, select { padding: 8px; margin: 5px 0; }
            label { font-weight: 600; }
            .field-grid { display: grid; grid-template-columns: 190px minmax(280px, 720px); gap: 10px 14px; align-items: start; margin: 8px 0; }
            .field-grid label { padding-top: 12px; }
            .field-grid input, .field-grid textarea, .field-grid select { width: 100%; margin: 0; box-sizing: border-box; }
            .actions { margin-top: 12px; }
            button { background: #0066cc; color: white; cursor: pointer; border: none; border-radius: 4px; }
            button:hover { background: #0052a3; }
            table { border-collapse: collapse; width: 100%; margin-top: 10px; }
            table, th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
            .status { padding: 2px 8px; border-radius: 3px; }
            .submitted { background: #fff3cd; }
            .prequalified { background: #d1ecf1; }
            @media (max-width: 760px) {
                .field-grid { grid-template-columns: 1fr; gap: 4px; }
                .field-grid label { padding-top: 0; }
            }
        </style>
    </head>
    <body>
        <header>
            <strong>HR Dashboard</strong>
            <nav>
                <a href="#" onclick="history.back(); return false;">Back</a>
                <a href="/ui">Home</a>
            </nav>
        </header>
        <main>
        <h1>HR Dashboard</h1>
        <input type="hidden" id="token"/>
        <p id="auth_msg"></p>
        
        <div class="section">
            <h2>1. Create New Job</h2>
            <div class="field-grid">
                <label for="title">Title</label>
                <input type="text" id="title" placeholder="e.g., Senior Backend Engineer"/>
                <label for="position">Position</label>
                <input type="text" id="position" placeholder="e.g., Backend Engineer"/>
                <label for="description">Description</label>
                <textarea id="description" rows="5" placeholder="Job requirements and responsibilities"></textarea>
                <label for="salary">Salary Range</label>
                <input type="text" id="salary" placeholder="e.g., 80k-120k"/>
            </div>
            <div class="actions">
                <button id="create_job">Create Job & Generate Questions</button>
            </div>
            <pre id="job_out" style="background:#f0f0f0; padding:10px; margin-top:10px; max-height:200px; overflow:auto;"></pre>
        </div>

        <div class="section">
            <h2>2. View Job Applications</h2>
            <div class="field-grid">
                <label for="job_select">My Jobs</label>
                <select id="job_select">
                    <option value="">Load or create a job</option>
                </select>
                <label for="job_id">Job ID</label>
                <input type="text" id="job_id" placeholder="Selected job ID"/>
            </div>
            <div class="actions">
                <button id="load_jobs">Refresh Jobs</button>
                <button id="list_apps">List Applications</button>
            </div>
            <table id="apps_table" style="display:none;">
                <thead>
                    <tr>
                        <th>App ID</th>
                        <th>Applicant Email</th>
                        <th>Score</th>
                        <th>Resume Match</th>
                        <th>Answer Score</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="apps_tbody"></tbody>
            </table>
            <div id="apps_msg"></div>
        </div>

        <div class="section">
            <h2>3. Pre-Qualify & Schedule Interview</h2>
            <p>Qualified applications for the selected job appear here after you click List Applications.</p>
            <div class="field-grid">
                <label for="schedule_time">Interview Date/Time</label>
                <input type="datetime-local" id="schedule_time"/>
                <label for="hm_select">Hiring Manager</label>
                <select id="hm_select">
                    <option value="">Load hiring managers</option>
                </select>
            </div>
            <div class="actions">
                <button id="load_hms">Refresh Hiring Managers</button>
            </div>
            <table id="qualified_table" style="display:none;">
                <thead>
                    <tr>
                        <th>App ID</th>
                        <th>Applicant</th>
                        <th>Score</th>
                        <th>Resume Match</th>
                        <th>Answer Score</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="qualified_tbody"></tbody>
            </table>
            <div id="qualified_msg"></div>
            <details style="margin-top:15px;">
                <summary>Manual scheduling fallback</summary>
                <div class="field-grid">
                    <label for="app_id">Application ID</label>
                    <input type="text" id="app_id" placeholder="Enter application ID"/>
                    <label for="hm_id">Hiring Manager ID</label>
                    <input type="text" id="hm_id" placeholder="Enter hiring manager user ID"/>
                </div>
                <div class="actions">
                    <button id="prequalify_btn">Pre-Qualify</button>
                    <button id="schedule_btn">Schedule Interview</button>
                </div>
            </details>
            <pre id="schedule_out" style="background:#f0f0f0; padding:10px; margin-top:10px; max-height:200px; overflow:auto;"></pre>
        </div>
        </main>

        <script>
            const savedToken = sessionStorage.getItem('employer_token') || localStorage.getItem('employer_token') || '';
            document.getElementById('token').value = savedToken;
            if (savedToken) {
                sessionStorage.setItem('employer_token', savedToken);
                localStorage.setItem('employer_token', savedToken);
            }
            const token = () => document.getElementById('token').value.trim();
            const authHeader = () => ({ 'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json' });
            const authMsg = document.getElementById('auth_msg');
            let currentApplications = [];
            let hiringManagers = [];
            const formatScore = (score) => score === null || score === undefined ? 'Pending' : Number(score).toFixed(2);
            const formatApplicationScore = (resumeScore, qaScore) => (
                resumeScore === null || resumeScore === undefined || qaScore === null || qaScore === undefined
                    ? 'Pending'
                    : (Number(resumeScore) * 0.7 + Number(qaScore) * 10 * 0.3).toFixed(2)
            );

            async function requireHrLogin() {
                if (!token()) {
                    authMsg.textContent = 'Please log in as an HR user before creating jobs.';
                    window.location.href = '/employer/login';
                    return false;
                }
                const res = await fetch('/auth/me', { headers: { 'Authorization': 'Bearer ' + token() } });
                if (res.status === 401) {
                    sessionStorage.removeItem('employer_token');
                    localStorage.removeItem('employer_token');
                    window.location.href = '/employer/login';
                    return false;
                }
                const me = await res.json();
                if (!res.ok || me.role !== 'HR') {
                    authMsg.textContent = 'This page requires an HR login. Company admins can manage users from the Company Admin page.';
                    return false;
                }
                authMsg.textContent = 'Signed in as ' + me.email;
                return true;
            }

            async function loadJobs() {
                const msg = document.getElementById('apps_msg');
                if (!await requireHrLogin()) { msg.textContent = 'Please log in as HR.'; return; }
                try {
                    const res = await fetch('/hr/jobs', { headers: authHeader() });
                    const jobs = await res.json();
                    const select = document.getElementById('job_select');
                    select.innerHTML = '<option value="">Select a job</option>';
                    if (!res.ok) {
                        msg.textContent = 'Error loading jobs: ' + JSON.stringify(jobs);
                        return;
                    }
                    jobs.forEach(job => {
                        const option = document.createElement('option');
                        option.value = job.id;
                        option.textContent = `#${job.id} - ${job.title} (${job.job_url})`;
                        select.appendChild(option);
                    });
                    if (jobs.length === 1) {
                        select.value = jobs[0].id;
                        document.getElementById('job_id').value = jobs[0].id;
                        setTimeout(() => document.getElementById('list_apps').onclick(), 0);
                    } else {
                        currentApplications = [];
                        renderPrequalifiedApplications();
                    }
                    msg.textContent = jobs.length ? '' : 'No jobs yet. Create a job first.';
                } catch (e) {
                    msg.textContent = 'Error loading jobs: ' + e.message;
                }
            }

            async function loadHiringManagers() {
                const msg = document.getElementById('qualified_msg');
                if (!await requireHrLogin()) { msg.textContent = 'Please log in as HR.'; return; }
                try {
                    const res = await fetch('/hr/hiring-managers', { headers: authHeader() });
                    const managers = await res.json();
                    const select = document.getElementById('hm_select');
                    hiringManagers = res.ok ? managers : [];
                    select.innerHTML = '<option value="">Select a hiring manager</option>';
                    if (!res.ok) {
                        msg.textContent = 'Error loading hiring managers: ' + JSON.stringify(managers);
                        return;
                    }
                    hiringManagers.forEach(manager => {
                        const option = document.createElement('option');
                        option.value = manager.id;
                        option.textContent = `#${manager.id} - ${manager.name} (${manager.email})`;
                        select.appendChild(option);
                    });
                    if (hiringManagers.length === 1) {
                        select.value = hiringManagers[0].id;
                        document.getElementById('hm_id').value = hiringManagers[0].id;
                    }
                    msg.textContent = hiringManagers.length ? '' : 'No hiring managers found for this company.';
                } catch (e) {
                    msg.textContent = 'Error loading hiring managers: ' + e.message;
                }
            }

            function renderPrequalifiedApplications() {
                const qualified = currentApplications.filter(app => app.status === 'Pre-qualified' || app.status === 'PRE_QUALIFIED');
                const tbody = document.getElementById('qualified_tbody');
                const msg = document.getElementById('qualified_msg');
                tbody.innerHTML = '';
                if (!qualified.length) {
                    document.getElementById('qualified_table').style.display = 'none';
                    msg.textContent = currentApplications.length ? 'No pre-qualified applications for this job yet.' : 'List applications for a job to see pre-qualified candidates here.';
                    return;
                }
                qualified.forEach(app => {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${app.id}</td>
                        <td>${app.applicant_name || app.applicant_email || 'N/A'}<br><small>${app.applicant_email || ''}</small></td>
                        <td>${formatApplicationScore(app.matching_score, app.answer_score)}</td>
                        <td>${formatScore(app.matching_score)}</td>
                        <td>${formatScore(app.answer_score)}</td>
                        <td><button onclick="scheduleApplication(${app.id})">Schedule Interview</button></td>
                    `;
                });
                document.getElementById('qualified_table').style.display = 'table';
                msg.textContent = `${qualified.length} pre-qualified application${qualified.length === 1 ? '' : 's'} ready to schedule.`;
            }

            document.getElementById('load_jobs').onclick = loadJobs;
            document.getElementById('load_hms').onclick = loadHiringManagers;
            document.getElementById('job_select').onchange = () => {
                document.getElementById('job_id').value = document.getElementById('job_select').value;
                currentApplications = [];
                renderPrequalifiedApplications();
                if (document.getElementById('job_select').value) {
                    document.getElementById('list_apps').onclick();
                }
            };
            document.getElementById('hm_select').onchange = () => {
                document.getElementById('hm_id').value = document.getElementById('hm_select').value;
            };

            document.getElementById('create_job').onclick = async () => {
                const out = document.getElementById('job_out');
                if (!await requireHrLogin()) { out.textContent = 'Please log in as HR before creating jobs.'; return; }
                const job_in = {
                    title: document.getElementById('title').value,
                    position: document.getElementById('position').value,
                    description: document.getElementById('description').value,
                    salary_range: document.getElementById('salary').value || null
                };
                try {
                    const res = await fetch('/hr/jobs', { method: 'POST', headers: authHeader(), body: JSON.stringify(job_in) });
                    const data = await res.json();
                    if (res.ok) {
                        document.getElementById('job_id').value = data.id;
                        out.textContent = 'Job created! ID: ' + data.id + '\\nURL: ' + data.job_url + '\\n' + (data.questions_count || '') + ' questions generated.\\n\\n' + JSON.stringify(data, null, 2);
                        await loadJobs();
                        document.getElementById('job_select').value = data.id;
                    } else {
                        out.textContent = 'Error: ' + JSON.stringify(data);
                    }
                } catch (e) {
                    out.textContent = 'Error: ' + e.message;
                }
            };

            document.getElementById('list_apps').onclick = async () => {
                const job_id = document.getElementById('job_id').value || document.getElementById('job_select').value;
                if (!await requireHrLogin()) { document.getElementById('apps_msg').textContent = 'Please log in as HR.'; return; }
                if (!job_id) { document.getElementById('apps_msg').textContent = 'Select a job first.'; return; }
                try {
                    const res = await fetch(`/hr/jobs/${job_id}/applications`, { headers: authHeader() });
                    const apps = await res.json();
                    const tbody = document.getElementById('apps_tbody');
                    tbody.innerHTML = '';
                    currentApplications = res.ok ? apps : [];
                    if (!res.ok) {
                        document.getElementById('apps_msg').textContent = 'Error: ' + JSON.stringify(apps);
                        document.getElementById('apps_table').style.display = 'none';
                        renderPrequalifiedApplications();
                        return;
                    }
                    if (apps.length === 0) {
                        document.getElementById('apps_msg').textContent = 'No applications yet.';
                        document.getElementById('apps_table').style.display = 'none';
                        renderPrequalifiedApplications();
                        return;
                    }
                    apps.forEach(app => {
                        const row = tbody.insertRow();
                        row.innerHTML = `
                            <td>${app.id}</td>
                            <td>${app.applicant_email || 'N/A'}</td>
                            <td>${formatApplicationScore(app.matching_score, app.answer_score)}</td>
                            <td>${formatScore(app.matching_score)}</td>
                            <td>${formatScore(app.answer_score)}</td>
                            <td><span class="status ${app.status.toLowerCase().replace(/-/g, '')}">${app.status}</span></td>
                            <td>
                                <button onclick="prequalifyApp(${app.id})">Qualify</button>
                                <button onclick="rescoreApp(${app.id})">Re-score with AI</button>
                            </td>
                        `;
                    });
                    document.getElementById('apps_table').style.display = 'table';
                    document.getElementById('apps_msg').textContent = '';
                    renderPrequalifiedApplications();
                } catch (e) {
                    document.getElementById('apps_msg').textContent = 'Error: ' + e.message;
                }
            };

            requireHrLogin().then(ok => { if (ok) { loadJobs(); loadHiringManagers(); } });

            window.prequalifyApp = async (app_id) => {
                if (!await requireHrLogin()) { alert('Please log in as HR.'); return; }
                try {
                    const res = await fetch(`/hr/applications/${app_id}/prequalify`, { method: 'POST', headers: authHeader() });
                    if (res.ok) {
                        alert('Application pre-qualified!');
                        document.getElementById('app_id').value = app_id;
                        document.getElementById('list_apps').onclick();
                    }
                } catch (e) {
                    alert('Error: ' + e.message);
                }
            };

            window.rescoreApp = async (app_id) => {
                const msg = document.getElementById('apps_msg');
                if (!await requireHrLogin()) { msg.textContent = 'Please log in as HR.'; return; }
                msg.textContent = 'Re-scoring application #' + app_id + '...';
                try {
                    const res = await fetch(`/hr/applications/${app_id}/rescore`, { method: 'POST', headers: authHeader() });
                    const data = await res.json();
                    if (res.ok) {
                        msg.textContent = `Re-scored application #${app_id}: resume ${Number(data.matching_score).toFixed(2)}, answers ${Number(data.answer_score).toFixed(2)}.`;
                        document.getElementById('list_apps').onclick();
                    } else {
                        msg.textContent = 'Error: ' + JSON.stringify(data);
                    }
                } catch (e) {
                    msg.textContent = 'Error: ' + e.message;
                }
            };

            window.scheduleApplication = async (app_id) => {
                const out = document.getElementById('schedule_out');
                const schedule_time = document.getElementById('schedule_time').value;
                const hm_id = parseInt(document.getElementById('hm_select').value || document.getElementById('hm_id').value);
                if (!await requireHrLogin()) { out.textContent = 'Please log in as HR.'; return; }
                if (!hm_id) { out.textContent = 'Select a hiring manager first.'; return; }
                try {
                    const interview_in = { application_id: parseInt(app_id), hiring_manager_id: hm_id, schedule_time: schedule_time || null };
                    const res = await fetch(`/hr/applications/${app_id}/schedule`, { method: 'POST', headers: authHeader(), body: JSON.stringify(interview_in) });
                    const data = await res.json();
                    if (res.ok) {
                        document.getElementById('app_id').value = app_id;
                        document.getElementById('hm_id').value = hm_id;
                        out.textContent = 'Interview scheduled for application #' + app_id + '!\\n\\n' + JSON.stringify(data, null, 2);
                    } else {
                        out.textContent = 'Error: ' + JSON.stringify(data);
                    }
                } catch (e) {
                    out.textContent = 'Error: ' + e.message;
                }
            };

            document.getElementById('prequalify_btn').onclick = async () => {
                const app_id = document.getElementById('app_id').value;
                if (!await requireHrLogin() || !app_id) { alert('Missing HR login or app ID'); return; }
                await prequalifyApp(app_id);
            };

            document.getElementById('schedule_btn').onclick = async () => {
                const out = document.getElementById('schedule_out');
                const app_id = document.getElementById('app_id').value;
                const schedule_time = document.getElementById('schedule_time').value;
                const hm_id = parseInt(document.getElementById('hm_id').value);
                if (!await requireHrLogin() || !app_id || !hm_id) { out.textContent = 'Missing fields'; return; }
                await scheduleApplication(app_id);
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=with_design(html))


@router.get("/hiring_manager/interviews", response_class=HTMLResponse)
def hiring_manager_interviews():
    return next_frontend_redirect("/hiring_manager/interviews")
    html = """
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hiring Manager - Interviews</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            header { display: flex; justify-content: space-between; align-items: center; margin: -20px -20px 20px; padding: 18px 32px; border-bottom: 1px solid #ddd; background: white; }
            header a { color: #28a745; text-decoration: none; font-weight: 700; margin-left: 14px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
            input, textarea, button, select { padding: 8px; margin: 5px 0; }
            button { background: #28a745; color: white; cursor: pointer; border: none; border-radius: 4px; }
            button:hover { background: #218838; }
            table { border-collapse: collapse; width: 100%; margin-top: 10px; }
            table, th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
            .card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background: #f9f9f9; }
            .verdict { padding: 3px 8px; border-radius: 3px; }
            .hire { background: #d4edda; }
            .reject { background: #f8d7da; }
        </style>
    </head>
    <body>
        <header>
            <strong>Hiring Manager</strong>
            <nav>
                <a href="#" onclick="history.back(); return false;">Back</a>
                <a href="/ui">Home</a>
            </nav>
        </header>
        <main>
        <h1>Hiring Manager - Interview Decisions</h1>
        <label>Bearer Token: <input type="text" id="token" size="80" placeholder="Paste JWT token from /auth/token"/></label>
        <button id="load_interviews">Load My Interviews</button>

        <div id="interviews_container" style="margin-top:20px;"></div>
        </main>

        <script>
            document.getElementById('token').value = sessionStorage.getItem('employer_token') || '';
            const token = () => document.getElementById('token').value.trim();
            const authHeader = () => ({ 'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json' });

            document.getElementById('load_interviews').onclick = async () => {
                if (!token()) { alert('Missing token'); return; }
                const container = document.getElementById('interviews_container');
                container.innerHTML = '<p>Loading...</p>';
                try {
                    const res = await fetch('/interviews', { headers: authHeader() });
                    const interviews = await res.json();
                    container.innerHTML = '';
                    if (interviews.length === 0) {
                        container.innerHTML = '<p>No interviews assigned.</p>';
                        return;
                    }
                    interviews.forEach(iv => {
                        const card = document.createElement('div');
                        card.className = 'card';
                        const verdict = iv.final_verdict ? `<span class="verdict ${iv.final_verdict.toLowerCase()}">${iv.final_verdict}</span>` : '<em>Pending</em>';
                        card.innerHTML = `
                            <h3>Interview #${iv.id}</h3>
                            <p><strong>Application ID:</strong> ${iv.application_id}</p>
                            <p><strong>Scheduled:</strong> ${iv.schedule_time ? new Date(iv.schedule_time).toLocaleString() : 'Not scheduled'}</p>
                            <p><strong>Recommendation:</strong> ${verdict}</p>
                            <p><strong>Manager Notes:</strong> ${iv.manager_comment || 'None'}</p>
                            <hr/>
                            <div>
                                <p><label>Your Comments: <textarea id="comment_${iv.id}" rows="3" cols="60">${iv.manager_comment || ''}</textarea></label></p>
                                <p><label>Recommendation: <select id="verdict_${iv.id}">
                                    <option value="">-- Select --</option>
                                    <option value="Strongly recommend">Strongly recommend</option>
                                    <option value="Acceptable">Acceptable</option>
                                    <option value="Reject">Reject</option>
                                </select></label></p>
                                <button onclick="submitDecision(${iv.id})">Submit Recommendation</button>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                } catch (e) {
                    container.innerHTML = '<p style="color:red;">Error: ' + e.message + '</p>';
                }
            };

            window.submitDecision = async (interview_id) => {
                if (!token()) { alert('Missing token'); return; }
                const comment = document.getElementById('comment_' + interview_id).value;
                const verdict = document.getElementById('verdict_' + interview_id).value;
                if (!verdict) { alert('Please select a recommendation'); return; }
                try {
                    const decision = { manager_comment: comment, final_verdict: verdict };
                    const res = await fetch(`/interviews/${interview_id}/decision`, { method: 'POST', headers: authHeader(), body: JSON.stringify(decision) });
                    if (res.ok) {
                        alert('Recommendation recorded!');
                        document.getElementById('load_interviews').onclick();
                    } else {
                        alert('Error recording recommendation');
                    }
                } catch (e) {
                    alert('Error: ' + e.message);
                }
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=with_design(html))
