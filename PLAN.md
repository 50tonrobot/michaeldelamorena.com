# michaeldelamorena.com — Final Build Plan

Author: Michael de la Morena
Purpose: Technical credibility hub for platform engineering and SRE roles
Audience: Engineering managers, staff/principal engineers, CTOs, technical recruiters

---

## Goal

A reader should finish the site thinking:

> "This engineer understands distributed systems, reliability engineering, and the future of infrastructure automation."

Within 30 seconds they should know:
- What problems you solve
- How you think about systems
- Proof you operate real infrastructure
- That you are exploring the future of infrastructure engineering

---

## Technology Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (latest stable) + App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS (latest stable) + shadcn/ui |
| Blog / Projects | MDX via `next-mdx-remote` (latest stable) |
| Analytics | Google Analytics 4 (via `@next/third-parties`) |
| Cookie Consent | Custom cookie banner (GDPR-compliant) |
| Sitemap | Dynamic via `next-sitemap` or App Router Route Handler |
| SEO | Next.js `generateMetadata` + OpenGraph |
| Hosting | Vercel |
| Code highlighting | `rehype-pretty-code` + `shiki` |
| MDX plugins | `rehype-slug`, `rehype-autolink-headings`, `remark-gfm` |

---

## Declared Project Folder Structure

This structure is locked at the start of the project. No files should be created outside it without explicit approval.

```
michaeldelamorena.com/
├── app/
│   ├── layout.tsx                        # Root layout (Analytics, CookieBanner, fonts)
│   ├── page.tsx                          # Home page
│   ├── globals.css                       # Global styles + Tailwind base
│   ├── about/
│   │   └── page.tsx
│   ├── projects/
│   │   ├── page.tsx                      # Projects index
│   │   └── [slug]/
│   │       └── page.tsx                  # Dynamic project page
│   ├── blog/
│   │   ├── page.tsx                      # Blog index
│   │   └── [slug]/
│   │       └── page.tsx                  # Dynamic blog post page
│   ├── resume/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── sitemap.ts                        # Dynamic sitemap (App Router route)
│   └── robots.ts                         # robots.txt route
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── SpecializationGrid.tsx
│   │   ├── CredibilityMetrics.tsx
│   │   ├── FeaturedProjects.tsx
│   │   └── LatestArticles.tsx
│   ├── content/
│   │   ├── ProjectCard.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── TagList.tsx
│   │   └── MDXContent.tsx               # MDX renderer with component overrides
│   ├── resume/
│   │   └── ResumeSection.tsx
│   ├── contact/
│   │   └── ContactLinks.tsx
│   └── shared/
│       ├── CookieBanner.tsx             # GDPR cookie consent
│       ├── SkipToMain.tsx               # Accessibility skip link
│       └── ThemeToggle.tsx              # Light / dark mode toggle
│
├── content/
│   ├── blog/                            # MDX blog posts (add files here to publish)
│   │   ├── reliability-vs-scalability.mdx
│   │   ├── what-makes-a-good-slo.mdx
│   │   ├── platform-engineering-vs-devops.mdx
│   │   ├── kubernetes-homelab-lessons.mdx
│   │   ├── logs-metrics-traces.mdx
│   │   ├── splunk-to-open-observability.mdx
│   │   ├── ai-assisted-development-what-works.mdx
│   │   ├── prompt-injection-risks.mdx
│   │   ├── operating-kubernetes-at-scale.mdx
│   │   └── designing-safe-ai-automation.mdx
│   └── projects/                        # MDX project writeups
│       ├── k3s-homelab.mdx
│       ├── genai-resume-tool.mdx
│       ├── observability-platform.mdx
│       ├── ai-security-experiments.mdx
│       └── crossplane-platform-review.mdx
│
├── lib/
│   ├── content.ts                       # MDX file loader (blog + projects)
│   ├── mdx.ts                           # MDX compilation and plugin config
│   └── site.ts                          # Shared site metadata constants
│
├── public/
│   ├── resume.pdf                       # Downloadable resume
│   ├── headshot.jpg                     # Profile photo
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-default.png                   # Default OpenGraph image
│   └── diagrams/
│       ├── homelab-topology.png
│       ├── observability-stack.png
│       ├── resume-tool-architecture.png
│       └── crossplane-workflow.png
│
├── types/
│   └── content.ts                       # Shared TypeScript types for MDX frontmatter
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
├── .eslintrc.json
├── .prettierrc
├── .env.local                           # GA4 measurement ID (not committed)
├── .env.example                         # Template showing required env vars
├── .gitignore
└── PLAN.md                              # This file
```

---

## MDX Content Model

### Blog Post Frontmatter

Every file in `content/blog/` must use this frontmatter schema:

```mdx
---
title: "Post Title Here"
description: "One sentence summary shown in previews and SEO."
date: "2026-03-09"
tags: ["kubernetes", "reliability", "sre"]
featured: false
draft: false
---
```

- `draft: true` hides the post from index and sitemap without deleting it.
- `featured: true` surfaces the post on the Home page Latest Articles section.
- Adding a new `.mdx` file to `content/blog/` is all that is required to publish a new post.

### Project Page Frontmatter

```mdx
---
title: "Project Title"
description: "One sentence summary."
date: "2026-03-01"
tags: ["kubernetes", "platform-engineering"]
featured: true
order: 1
---
```

- `order` controls display sequence on the Projects index page.
- `featured: true` surfaces the project on the Home page Featured Projects section.

---

## Dynamic Sitemap

`app/sitemap.ts` is a Next.js App Router Route Handler that:

1. Enumerates all static routes (home, about, resume, contact, projects index, blog index)
2. Reads all non-draft MDX files from `content/blog/` and `content/projects/`
3. Returns a combined `MetadataRoute.Sitemap` array

Adding a new MDX file automatically includes it in the sitemap on next build/deploy — no manual step required.

---

## Google Analytics 4 Setup

### Manual Step Required Before Build

Before running the site, you must create a Google Analytics property:

1. Go to https://analytics.google.com
2. Create a new property → Web stream → enter `michaeldelamorena.com`
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)
4. In the project root, add it to `.env.local`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

5. For Vercel deployment, add the same environment variable in the Vercel project settings under **Settings → Environment Variables**.

### Implementation

- Analytics is loaded in `app/layout.tsx` using `@next/third-parties/google` (`GoogleAnalytics` component)
- Analytics script is only injected **after** the user accepts cookies (see Cookie Consent below)
- No tracking fires until consent is granted

---

## Cookie Consent (GDPR)

The `CookieBanner` component:

- Appears on first visit for all users
- Offers **Accept** and **Decline** buttons
- Stores the user's choice in `localStorage` under key `cookie_consent`
- On Accept: sets consent flag, loads Google Analytics
- On Decline: analytics is never loaded; banner is dismissed and preference saved
- On subsequent visits: reads `localStorage`, skips banner if consent already stored
- The banner is keyboard navigable and screen-reader accessible (WCAG 2.2 AA)

---

## Site Architecture (Pages)

```
/                     Home
/about                About
/projects             Projects index
/projects/[slug]      Individual project page
/blog                 Blog index
/blog/[slug]          Individual blog post
/resume               Resume page
/contact              Contact page
```

---

## Page-by-Page Requirements

### Home (`/`)

**Sections in order:**

1. **Hero** — Name, title line, positioning statement
2. **Core Specializations** — 4-card grid
3. **Credibility Metrics** — 4 key numbers
4. **Featured Projects** — 3–4 project cards (featured: true)
5. **Latest Articles** — 3 most recent non-draft blog posts
6. **Call to Action** — Links to Resume, GitHub, LinkedIn, Contact

**Hero copy:**

> Michael de la Morena
> Platform Engineering · Reliability Architecture · Cloud Infrastructure
>
> I design and operate resilient distributed systems. My work focuses on Kubernetes platform engineering, observability, and the emerging role of AI in infrastructure automation.

**Credibility metrics:**

- 20+ years software engineering
- 10+ years cloud infrastructure
- 62% AWS cost reduction achieved
- 40+ Kubernetes clusters governed

**Core specializations:**

- Kubernetes Platform Engineering
- Observability & Reliability Engineering
- Cloud Architecture & Cost Optimization
- AI-Assisted Infrastructure Automation

---

### About (`/about`)

**Sections:**

1. Background — career arc from software development → cloud → platform engineering → AI exploration
2. Engineering Philosophy — 5 core principles
3. Current Exploration — active areas of research

**Engineering philosophy:**

- Reliability is an architectural property
- Observability enables engineering autonomy
- Automation reduces operational risk
- Infrastructure should be self-service
- Platform engineering increases developer velocity

---

### Projects Index (`/projects`)

- Grid of all non-draft project MDX files
- Ordered by `order` frontmatter field
- Each card shows: title, description, tags

### Project Page (`/projects/[slug]`)

Each project MDX file covers:

- Problem statement
- Architecture overview
- Technologies used
- Design decisions
- Challenges encountered
- Lessons learned

**Projects (initial set):**

| Slug | Title |
|---|---|
| `k3s-homelab` | Kubernetes Homelab Cluster |
| `genai-resume-tool` | GenAI Resume Alignment Tool |
| `observability-platform` | Observability Platform Migration |
| `ai-security-experiments` | AI Security Experiments |
| `crossplane-platform-review` | Crossplane Platform Review |

---

### Blog Index (`/blog`)

- Lists all non-draft posts, sorted by date descending
- Each card shows: title, date, description, tags
- Filter by tag (optional enhancement, Phase 4)

### Blog Post (`/blog/[slug]`)

- Full MDX rendered content
- Syntax-highlighted code blocks via `rehype-pretty-code`
- Reading time estimate
- Tag list
- Back to blog link

**Initial blog posts:**

| Slug | Title | Category |
|---|---|---|
| `reliability-vs-scalability` | Reliability vs Scalability: Why Engineers Confuse Them | Reliability |
| `what-makes-a-good-slo` | What Makes a Good SLO | Reliability |
| `platform-engineering-vs-devops` | Platform Engineering vs DevOps | Platform |
| `operating-kubernetes-at-scale` | Operating Kubernetes Clusters at Scale | Platform |
| `kubernetes-homelab-lessons` | Lessons from Running a Kubernetes Homelab | Platform |
| `logs-metrics-traces` | Logs, Metrics, and Traces: When Each Matters | Observability |
| `splunk-to-open-observability` | Migrating from Splunk to an Open Observability Stack | Observability |
| `ai-assisted-development-what-works` | AI-Assisted Development: What Actually Works | AI |
| `prompt-injection-risks` | Prompt Injection Attacks Against LLM Applications | AI |
| `designing-safe-ai-automation` | Designing Safe AI Automation for Infrastructure | AI |

---

### Resume (`/resume`)

- Downloadable PDF link (`/resume.pdf`)
- Web version with: career summary, key achievements, leadership experience, technical stack
- Clean print stylesheet

### Contact (`/contact`)

- Email address
- LinkedIn profile link
- GitHub profile link
- Optional: simple contact form (no backend required — use mailto or a form service)

---

## Design System

### Core Principles

- Minimal, readable, fast-loading
- Dark mode first (with light mode support via Tailwind `dark:` classes)
- Text-focused — no decorative animations
- Tone: technical, calm, precise, senior, practical

### Typography

- Heading font: `Inter` or `Geist` (system-appropriate)
- Body font: same family, regular weight, comfortable line height
- Code font: `JetBrains Mono` or `Geist Mono`

### Color Palette

- Background: `zinc-950` (dark) / `zinc-50` (light)
- Surface: `zinc-900` / `zinc-100`
- Text primary: `zinc-50` / `zinc-900`
- Text muted: `zinc-400` / `zinc-600`
- Accent: `sky-400` (links, highlights)
- Border: `zinc-800` / `zinc-200`

### Responsive Breakpoints (Tailwind defaults)

| Breakpoint | Min-width | Target |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

All layouts must be verified and usable at all breakpoints. Mobile is the baseline.

---

## Accessibility Requirements (WCAG 2.2 AA)

All pages must comply with WCAG 2.2 AA. Non-negotiable requirements:

- **Skip to main content** link as the first focusable element on every page
- **Keyboard navigation** throughout — all interactive elements reachable via Tab
- **Focus indicators** — visible focus ring on all interactive elements (never `outline: none` without replacement)
- **Color contrast** — minimum 4.5:1 for body text, 3:1 for large text and UI components
- **Alt text** — all `<img>` elements have descriptive `alt` attributes; decorative images use `alt=""`
- **Semantic HTML** — correct heading hierarchy (`h1` → `h2` → `h3`), landmark regions (`<main>`, `<nav>`, `<footer>`, `<header>`)
- **ARIA labels** — icon-only buttons and links must have `aria-label`
- **Cookie banner** — keyboard navigable, focus trapped while open, announces via `role="dialog"` and `aria-labelledby`
- **Mobile nav** — `aria-expanded`, `aria-controls`, proper focus management on open/close
- **Dark/light mode** — tested in both; contrast requirements apply to both themes

The `a11y-auditor` agent runs automatically after all frontend work and must clear before the work is considered done.

---

## SEO

- `generateMetadata` used on every page with title, description, OpenGraph, Twitter card
- `app/sitemap.ts` dynamic sitemap (see above)
- `app/robots.ts` robots.txt route
- Canonical URLs on all pages
- OpenGraph images: default `/og-default.png`; blog/project pages can define their own

---

## Build Phases

### Phase 0: Manual Prerequisite — Google Analytics ✅ COMPLETE

> **Do this before starting Phase 1.**

- [x] Create Google Analytics 4 property at https://analytics.google.com
- [x] Add Web stream for `michaeldelamorena.com`
- [x] Copy Measurement ID (`G-XXXXXXXXXX`)
- [x] Save to `.env.local` as `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- [x] Copy `.env.local` to `.env.example` with the value redacted (`G-XXXXXXXXXX`)
- [x] Add `.env.local` to `.gitignore`

---

### Phase 1: Foundation 🚧 IN PROGRESS

**Deliverables:** Runnable skeleton with layout, navigation, and all static pages

- [x] 1. Initialize Next.js 16.1.6 project with TypeScript strict mode
- [x] 2. Install and configure Tailwind CSS v4
- [x] 3. Install and configure shadcn/ui (button, badge, separator)
- [x] 4. Create `types/content.ts`, `lib/site.ts`, `lib/mdx.ts`, `lib/content.ts`
- [x] 5. Create `app/sitemap.ts` and `app/robots.ts`
- [x] 6. Seed `content/blog/` and `content/projects/` with placeholder MDX files
- [x] 7. Create root `app/layout.tsx` with fonts, dark mode, `SkipToMain`, `CookieBanner`, `Header`, `Footer`
- [x] 8. Implement `CookieBanner` component with localStorage consent + GA loading
- [x] 9. Build `Header` with responsive mobile nav (`aria-expanded`, keyboard nav)
- [x] 10. Build `Footer` with GitHub, LinkedIn, email links
- [x] 11. Scaffold all page routes as empty shells: `/`, `/about`, `/projects`, `/blog`, `/resume`, `/contact`

**Agent pipeline:** `frontend-component-builder` ✅ → `testing-agent` ✅ (64 tests, all pass) → `a11y-auditor` ✅ (6 violations found and fixed, all pages WCAG 2.2 AA)

### Phase 1 ✅ COMPLETE

---

### Phase 2: Content Engine 🚧 IN PROGRESS

**Deliverables:** MDX loading, blog/project dynamic routes working end-to-end

- [x] 1. Install `next-mdx-remote`, `rehype-pretty-code`, `rehype-slug`, `rehype-autolink-headings`, `remark-gfm`, `shiki` (done in Phase 1)
- [x] 2. Create `lib/mdx.ts` — MDX compilation with all plugins configured (done in Phase 1)
- [x] 3. Create `lib/content.ts` — blog/project loaders (done in Phase 1)
- [x] 4. Create `types/content.ts` — shared TypeScript types (done in Phase 1)
- [x] 5. Create `app/sitemap.ts` — dynamic sitemap (done in Phase 1)
- [x] 6. Create `app/robots.ts` (done in Phase 1)
- [x] 7. Implement `app/blog/page.tsx` — blog index with article cards
- [x] 8. Implement `app/blog/[slug]/page.tsx` — dynamic blog post with `generateStaticParams`
- [x] 9. Implement `app/projects/page.tsx` — projects index with project cards
- [x] 10. Implement `app/projects/[slug]/page.tsx` — dynamic project page with `generateStaticParams`
- [x] 11. Create `components/content/MDXContent.tsx` — MDX renderer with custom element overrides
- [x] 12. Create `components/content/ArticleCard.tsx`, `ProjectCard.tsx`, `TagList.tsx`

**Agent pipeline:** `enterprise-code-architect` (lib/ + types/) ✅ → `frontend-component-builder` (pages) ✅ → `testing-agent` ✅ (94 tests, all pass) → `a11y-auditor` ✅ (4 violations found and fixed)

### Phase 2 ✅ COMPLETE

---

### Phase 3: Page Content 🚧 IN PROGRESS

**Deliverables:** All pages fully implemented with real content

- [x] 1. Build Home page — Hero, Specializations, Metrics, Featured Projects, Latest Articles, CTA
- [x] 2. Build About page — background, philosophy, current exploration
- [x] 3. Build Resume page — downloadable PDF link + web version of resume content
- [x] 4. Build Contact page — links + optional mailto form
- [x] 5. Create remaining 4 project MDX files in `content/projects/`
- [x] 6. Create remaining 9 blog post MDX files in `content/blog/`
- [x] 7. Add `public/michael-delamorena-resume-2026-03.pdf` — resume PDF added; all links updated via `siteConfig.resumePdf`
- [x] 8. Add `public/hero-action-figure.jpg` — action figure hero image added; Hero updated to two-column layout with Next.js Image optimization
- [x] 9. Add `public/og-default.png` — generated via Playwright script (1200×630, dark zinc palette)

**Agent pipeline:** `frontend-component-builder` ✅ → `a11y-auditor` ✅ (4 violations fixed) → `testing-agent` ✅ (158 tests, all pass) → `design-review` (pending — run when ready)

### Phase 3 ✅ COMPLETE (one optional manual asset remaining: og-default.png)

---

### Phase 4: Polish and Launch 🚧 IN PROGRESS

**Deliverables:** Production-ready site deployed to Vercel

- [x] 1. Responsive layout verified at 375px / 768px / 1280px — 2 issues fixed (cookie banner body padding, MDX prose width)
- [x] 2. Security scan — 0 critical/high; 2 medium fixed (CSP headers, slug validation + frontmatter hardening)
- [x] 3. Final code review — approved; 4 improvements applied (package name, dead code, type consistency, frontmatter validation)
- [x] 4. 158 tests passing
- [x] 5. Add `output: 'standalone'` to `next.config.ts` for Docker builds
- [x] 6. Create `Dockerfile` (multi-stage, `linux/arm64`, standalone Next.js output, non-root UID 1001)
- [x] 7. Create `.dockerignore`
- [x] 8. Create Helm chart at `helm/michaeldelamorena-com/` — 2 replicas, Traefik ingress, cert-manager TLS, Pi-friendly resource limits
- [x] 9. Create `scripts/deploy` — auto-increments semver, builds arm64 image, pushes to registry, tags git, deploys via Helm
- [ ] 10. Push to GitHub
- [ ] 11. Deploy: run `scripts/deploy` to build, push, and install on k3s
- [ ] 12. Verify sitemap at `https://michaeldelamorena.com/sitemap.xml`
- [ ] 13. Submit sitemap to Google Search Console

**Deployment stack:** Docker → `registry.example.internal` → Helm → k3s (aarch64) → Traefik ingress → cert-manager TLS → `michaeldelamorena.com`

**Note on GA Measurement ID:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` is inlined at Next.js build time. It is passed as a Docker `--build-arg` (read from `.env.local` by `scripts/deploy`) and baked into the image. It does not need a Kubernetes Secret.

---

## Adding New Blog Posts (Ongoing Workflow)

To publish a new blog post after launch:

1. Create a new `.mdx` file in `content/blog/` following the frontmatter schema above
2. Set `draft: false` when ready to publish
3. Commit and push — Vercel rebuilds automatically
4. The post appears in the blog index and sitemap on next build

No code changes required. No configuration changes required.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Yes (after Phase 0) | Google Analytics 4 Measurement ID |

---

## Minimum Viable Launch Checklist

- [ ] Phase 0 complete: GA4 property created, Measurement ID in `.env.local`
- [ ] Home page with all 6 sections
- [ ] About page
- [ ] Projects index + at least 3 project pages
- [ ] Blog index + at least 3 blog posts
- [ ] Resume page + downloadable PDF
- [ ] Contact page
- [ ] Dynamic sitemap verified at `/sitemap.xml`
- [ ] Cookie consent banner working
- [ ] Analytics firing after accept, not firing after decline
- [ ] WCAG 2.2 AA cleared by `a11y-auditor`
- [ ] Responsive layout verified at 375px, 768px, 1280px
- [ ] Security scan passed
- [ ] Deployed to Vercel with custom domain
- [ ] Sitemap submitted to Google Search Console
