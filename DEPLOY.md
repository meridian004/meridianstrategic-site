# MSR Deploy Handoff

Runbook to move this repo from your laptop → GitHub → Netlify → `meridianstrategic.io`. Each step is 1–3 commands. Nothing in this repo touches DNS automatically — that step is yours.

---

## Current state (what's already done)

| Item | Status |
|---|---|
| Git repo initialized, `main` branch | Clean — 2 commits |
| Build passes (`npx astro check` + `npx astro build`) | 0 errors, 0 warnings, 1 hint |
| `netlify.toml` | Present — build cmd, publish dir, security headers |
| `.gitignore` | Present — excludes `node_modules/`, `dist/`, `.env` |
| `README.md` | Present |
| OG image (`public/og-default.png`) | Generated, 1200×630, on-brand |
| Nav links | All in-page anchors, zero 404s |
| Squarespace registrar | Confirmed — domain owned |
| Google Cloud DNS zone | Confirmed — active, Workspace MX intact |
| Web hosting records (A/AAAA/CNAME) | **Empty** — clean slate for Netlify |

---

## Step 1 — Push to GitHub

You need `gh` CLI installed locally (sandbox can't install it — proxy blocked). One-time: `brew install gh`.

| # | Command | Purpose |
|---|---|---|
| 1 | `cd ~/Desktop/meridianstrategic.io` | Enter repo |
| 2 | `gh auth login` | One-time — browser auth |
| 3 | `gh repo create meridianstrategic-site --public --source=. --push` | Create remote + push `main` |

The repo name `meridianstrategic-site` is a suggestion — change if you want. Keep `--public` if you want Netlify's free tier to deploy without extra GitHub app config.

After push, confirm:

```bash
gh repo view --web        # opens the new repo in browser
git remote -v             # should show origin → github.com/<you>/meridianstrategic-site
```

---

## Step 2 — Connect Netlify to the repo

Two paths. Use the web UI — it's faster, avoids CLI auth dance.

### Web UI path (recommended)

1. `app.netlify.com` → **Add new site** → **Import an existing project**
2. Pick **GitHub** → authorize → select `meridianstrategic-site`
3. Netlify auto-detects `netlify.toml`. Leave defaults:
   - Build command: `npm run build` *(from toml)*
   - Publish directory: `dist` *(from toml)*
   - Node version: 22 *(from toml)*
4. **Deploy site** → wait ~30s → you get `https://<random>.netlify.app`

### CLI path (if you prefer)

```bash
npm install -g netlify-cli
netlify login
netlify init      # pick "Create & configure a new site"
netlify deploy --prod
```

---

## Step 3 — DNS cutover (Google Cloud DNS)

Your registrar is Squarespace, but nameservers point to Google Cloud DNS. You edit records **at Google Cloud DNS**, not Squarespace.

**What you are touching:**

| Record | Purpose | Add or replace |
|---|---|---|
| `A @` | Apex → Netlify load balancer | Add |
| `CNAME www` | `www.meridianstrategic.io` → Netlify | Add |

**What you MUST NOT touch:**

| Record | Why |
|---|---|
| `MX` | Google Workspace email |
| `TXT` with `v=spf1` | SPF — email auth |
| `TXT` with `google-site-verification` | Workspace ownership |
| `CNAME` for DKIM selectors (if present) | Email signing |

### 3a — Get the exact Netlify IP / hostname

In Netlify dashboard → **Domain management** → **Add custom domain** → enter `meridianstrategic.io`.
Netlify will show the **two records to add**. They look like:

| Host | Type | Value |
|---|---|---|
| `@` (apex) | `A` | `75.2.60.5` *(Netlify load balancer — verify in their UI)* |
| `www` | `CNAME` | `<your-site>.netlify.app` |

**Use the values Netlify shows you, not the ones above** — Netlify sometimes changes load-balancer IPs.

### 3b — Add the records in Google Cloud DNS

1. `console.cloud.google.com` → **Network Services** → **Cloud DNS**
2. Select your `meridianstrategic.io` zone
3. **Add record set** → Type `A`, Name blank (apex), IPv4 `<value from Netlify>`
4. **Add record set** → Type `CNAME`, Name `www`, Canonical `<your-site>.netlify.app.` (trailing dot)
5. Save

### 3c — Verify + enable HTTPS

```bash
dig meridianstrategic.io +short       # should show Netlify IP
dig www.meridianstrategic.io +short   # should show *.netlify.app
```

In Netlify → Domain management → **Verify DNS configuration** → once green, click **Provision certificate** (Let's Encrypt, free, automatic renewal).

Propagation: usually 5–30 minutes. Sometimes up to 48 hours at the edge.

---

## Step 4 — Post-deploy smoke test

| Check | How |
|---|---|
| Site loads over HTTPS | `curl -I https://meridianstrategic.io` → 200 |
| `www` redirects to apex | Netlify setting: **Primary domain = apex**, forces www→apex |
| OG image resolves | `https://meridianstrategic.io/og-default.png` → 200 |
| Email still works | Send yourself a test from another account → Gmail inbox |
| Anchor nav scrolls correctly | Click Capabilities / Approach / Insights / Contact in header |

---

## Step 5 — Future deploys

Every `git push origin main` triggers a Netlify build automatically. No manual deploy needed.

```bash
git add -A
git commit -m "Your message"
git push
# → Netlify builds in ~40s → live
```

Rollback: Netlify → Deploys → click any previous deploy → **Publish deploy**. Instant.

---

## Gotchas + known gaps

| Issue | Impact | Fix later |
|---|---|---|
| Google Fonts loaded from CDN (external request) | ~100ms on first paint | Self-host fonts in `public/fonts/` if Lighthouse score matters |
| No 404 page | Unknown paths get Netlify default | Add `src/pages/404.astro` |
| Single page — all routes anchor into index | Fine for launch | Add real subpages when you have more content |
| No analytics | You won't see traffic | Plausible / Fathom / Netlify Analytics — your call |
| Insights cards are placeholder copy | Not shippable as-is | Replace with real writing before sharing the URL |
| Founder bio uses "Wes" generically | Needs your real track record | 2–3 sentence edit in `src/components/FounderBio.astro` |
