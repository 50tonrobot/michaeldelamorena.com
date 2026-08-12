# michaeldelamorena.com — Project Standards

This file is read by Claude Code at the start of every session. All agents and direct edits must comply.

---

## Security — Non-Negotiable Patterns

### 1. Path traversal — always use `safeJoin`

Any code that constructs a filesystem path from a variable **must** use `safeJoin` from `lib/content.ts`, not `path.join` or `path.resolve` directly.

```typescript
// ✅ CORRECT
const filePath = safeJoin(baseDir, userControlledSegment);
if (!filePath) return null;

// ❌ WRONG — triggers semgrep path-join-resolve-traversal
const filePath = path.join(baseDir, userControlledSegment);
```

`safeJoin` resolves the path and verifies it stays within `baseDir` before returning. The two `nosemgrep` inline comments inside `safeJoin` itself are intentional — they suppress false positives on the *prevention code*, not on an actual vulnerability.

### 2. Slug validation — always call `isValidSlug` before path construction

Any function that accepts a `slug` string from a URL parameter must validate it before use:

```typescript
if (!isValidSlug(slug)) return null;
const filePath = safeJoin(contentDir, `${slug}.mdx`);
if (!filePath || !fs.existsSync(filePath)) return null;
```

### 3. Frontmatter — never use `as` casts on `gray-matter` output

`gray-matter` returns `Record<string, unknown>`. Always use the normalizer functions:

```typescript
// ✅ CORRECT
const frontmatter = normalizeBlogFrontmatter(data);
const frontmatter = normalizeProjectFrontmatter(data);

// ❌ WRONG — unsafe cast, crashes if frontmatter field is missing or wrong type
const frontmatter = data as BlogFrontmatter;
```

Both normalizers are in `lib/content.ts`. If a new content type is added, create an equivalent normalizer using `String()`, `Boolean()`, `Array.isArray()` coercions — no `as` casts.

### 4. Security headers — always present in `next.config.ts`

The `headers()` function in `next.config.ts` defines the Content Security Policy and security headers. **Do not remove or weaken it.** If a new external resource origin is added (new CDN, new font, new analytics), add it to the appropriate CSP directive rather than broadening `default-src`.

Current trusted origins:
- Scripts: `https://www.googletagmanager.com`
- Styles: `https://fonts.googleapis.com`
- Fonts: `https://fonts.gstatic.com`
- Connections: `https://www.google-analytics.com`, `https://region1.google-analytics.com`

### 5. External links — always include `rel="noopener noreferrer"` with `target="_blank"`

Every `<Link>` or `<a>` with `target="_blank"` must have `rel="noopener noreferrer"`. Also add `<span className="sr-only">(opens in new tab)</span>` for screen reader users.

### 6. Private infrastructure identifiers — never hardcode; read from the environment

**This repository is public.** No private infrastructure identifier may be committed as a literal — not in code, scripts, Helm values, docs, or MDX content. This includes:

- **Cloudflare zone / account IDs** → read from `CLOUDFLARE_ZONE_ID_MDLM` (never a literal 32-hex fallback)
- **Private container-registry hostnames** → read from `REGISTRY_DOMAIN` (the Helm `image.repository` default is a placeholder; the deploy script overrides it via `--set`)
- **Registry usernames** → read from `REGISTRY_USERNAME` (no default in `scripts/deploy`)
- **Internal IPs / VLANs / host addresses** (e.g. `192.168.x.x`) → redact from docs and blog content; use example ranges

```bash
# ✅ CORRECT — required from env, no literal fallback
CF_ZONE_ID="${CLOUDFLARE_ZONE_ID_MDLM:-}"
: "${REGISTRY_DOMAIN:?set REGISTRY_DOMAIN}"

# ❌ WRONG — literal infra identifier baked into a public repo
CF_ZONE_ID="${CLOUDFLARE_ZONE_ID_MDLM:-<real-32-hex-zone-id>}"
REGISTRY_DOMAIN="${REGISTRY_DOMAIN:-<real-private-registry-host>}"
```

These are not credentials on their own, but publishing them discloses infrastructure and is treated as a leak. This is enforced at commit time by the **gitleaks pre-commit hook** (`.githooks/pre-commit` + `.gitleaks.toml`) — the hook is wired automatically via the `prepare` npm script (`git config core.hooksPath .githooks`). A verified false positive may be suppressed with `# gitleaks:allow` on the line, with a reason.

---

## semgrep

Run `semgrep scan --config=auto --severity=WARNING --severity=ERROR` before every deployment. Expected result: **0 findings**.

Suppressing a finding with `// nosemgrep` is acceptable only when:
1. The finding is a verified false positive
2. The suppression comment explains why it is safe
3. The suppressed line is inside a security control (not in application logic)

---

## Deployment

**To deploy a new version:**
```bash
source ~/.zshrc   # ensure REGISTRY_DOMAIN, REGISTRY_USERNAME, REGISTRY_PASSWORD are set
scripts/deploy
```

The script auto-increments the patch version from the latest `v*` git tag, builds a `linux/arm64` Docker image, pushes to the private registry (`REGISTRY_DOMAIN`), creates the git tag, and runs `helm upgrade --install`.

**Helm chart:** `helm/michaeldelamorena-com/` — namespace `michaeldelamorena-com`, 2 replicas, Traefik ingress, cert-manager TLS for `michaeldelamorena.com`.

**GA Measurement ID:** Baked into the image at build time via Docker `--build-arg`. The deploy script reads it from `.env.local`. Do NOT add it as a Kubernetes Secret or runtime env var — it is a `NEXT_PUBLIC_` variable and must be present at `next build` time.

**Versioning:** patch = bug fix, minor = new feature, major = breaking change. Run `git tag v1.x.x` manually before deploying minor/major releases, or let `scripts/deploy` auto-increment patch.

---

## Content System

### Adding blog posts
Drop a `.mdx` file in `content/blog/` following the frontmatter schema in `types/content.ts`. Set `draft: false` to publish. The sitemap and blog index update automatically on next build.

### Adding projects
Drop a `.mdx` file in `content/projects/`. Set `order` to control display sequence. Set `featured: true` to surface on the home page.

### MDX heading convention
Use `##` (h2) as the top-level heading inside MDX files. The page template renders the title as the `<h1>`. Using `#` (h1) in MDX is handled gracefully by the `MDXContent` component but should be avoided.

---

## Stack Versions (always use latest stable)

| Package | Current |
|---|---|
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.x (strict mode) |
| Tailwind CSS | 4.x |
| next-mdx-remote | 6.x |

Always verify with `npm view <package> version` before pinning a new dependency.

---

## Test Coverage

Minimum 80% statement coverage on all files in `components/` and `lib/`. Run `npm test -- --coverage` to verify. All 158 baseline tests must remain passing after any change.
