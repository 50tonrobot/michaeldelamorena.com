# michaeldelamorena.com

Personal portfolio and blog. Built with Next.js 16 App Router, deployed to a self-hosted k3s homelab, and served through Cloudflare's edge network.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSG) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Content | MDX files via `next-mdx-remote` |
| Runtime | Node.js (standalone Docker image) |
| Container registry | Private registry (host provided via `REGISTRY_DOMAIN`) |
| Orchestration | k3s (Kubernetes) on Raspberry Pi nodes |
| Ingress | Traefik with cert-manager / Let's Encrypt |
| WAF | OWASP ModSecurity CRS (inspector mode) |
| CDN / proxy | Cloudflare (proxied, Cache Rules configured) |
| Architecture | `linux/arm64` (Raspberry Pi cluster) |

## Site Structure

All pages are statically generated at build time (`generateStaticParams` — no ISR, no server-side rendering). Content only changes on deploy.

```
/                   Home — hero, specializations, featured projects
/about              About
/blog               Blog index
/blog/[slug]        Blog posts (MDX in content/blog/)
/projects           Projects index
/projects/[slug]    Project case studies (MDX in content/projects/)
/resume             Resume / CV
/contact            Contact
```

## Content

Drop MDX files into the appropriate directory. Frontmatter schema is defined in `types/content.ts`.

```
content/
  blog/        Blog posts — set draft: false to publish
  projects/    Project case studies — set featured: true to surface on home page
```

The sitemap (`/sitemap.xml`) and robots file (`/robots.txt`) are generated automatically from `app/sitemap.ts` and `app/robots.ts`.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Updating the Resume

Export the resume from Pages, then run `scripts/update-resume <file.pdf>`. The tool normalizes accessibility metadata, writes it to the Longhorn volume, and purges the Cloudflare cache so the new version is live immediately; no redeploy is needed. Served at `https://michaeldelamorena.com/resume.pdf`.

> Cache purge requires `CLOUDFLARE_CACHE_PURGE_TOKEN` in your environment (a Zone → Cache Purge token for `michaeldelamorena.com`). Without it the upload still succeeds, but the new PDF may be cached at the edge for up to ~24h.

## Deployment

```bash
scripts/deploy
```

The script:
1. Reads `NEXT_PUBLIC_GA_MEASUREMENT_ID` from `.env.local`
2. Loads registry credentials from the environment (`REGISTRY_DOMAIN`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD` — export them or add to `~/.zshrc`; no defaults are baked into the script)
3. Bumps the patch version from the latest `v*` git tag
4. Builds a `linux/arm64` Docker image with the GA ID baked in at build time
5. Pushes `<image>:<version>` and `<image>:latest` to the private registry
6. Creates a git tag
7. Runs `helm upgrade --install` into the `michaeldelamorena-com` namespace
8. Purges the Cloudflare edge cache (if `CLOUDFLARE_CACHE_PURGE_TOKEN` and `CLOUDFLARE_ZONE_ID_MDLM` are set)

**Versioning:** patch = bug fix, minor = new feature, major = breaking change. The script auto-increments patch. For minor/major, tag manually (`git tag v1.x.0`) before running.

**Required environment variables** (export or add to `~/.zshrc`):

```bash
REGISTRY_DOMAIN=...                # private container registry host
REGISTRY_USERNAME=...
REGISTRY_PASSWORD=...
CLOUDFLARE_CACHE_PURGE_TOKEN=...   # Zone.Cache Purge token scoped to michaeldelamorena.com
CLOUDFLARE_ZONE_ID_MDLM=...        # this site's Cloudflare zone id (never commit the real value)
```

See `.env.example` for the full list.

## Infrastructure

```
Browser
  └─ Cloudflare edge  (CDN, DDoS, Cache Rules)
       └─ Router  (port-forwards 443 → Pi-hole)
            └─ Pi-hole / nginx  (TLS passthrough via ssl_preread SNI)
                 └─ k3s / Traefik  (TLS termination, Let's Encrypt cert)
                      └─ ModSecurity  (OWASP CRS WAF, inspector mode)
                           └─ michaeldelamorena-com pods  (Next.js standalone, arm64)
```

**ModSecurity — inspector mode:** Traefik's modsecurity plugin forwards each request to the ModSecurity sidecar for a pass/fail decision before routing to the app. ModSecurity proxies to an unreachable port (`127.0.0.1:65535`) — a refused connection is remapped to 200 (pass); a rule match returns 403 (block). The app pods never receive blocked requests.

**Cloudflare caching:** Both `michaeldelamorena.com` and `www` are orange-clouded. Cache Rules are configured to cache everything (HTML pages use `s-maxage=3600`; `/_next/static/*` uses `max-age=31536000, immutable`). The deploy script purges the edge cache after every Helm rollout so stale HTML is never served post-deploy.

**Helm chart:** `helm/michaeldelamorena-com/` — namespace `michaeldelamorena-com`, HPA (1–5 replicas), Traefik ingress with TLS.

## Testing

```bash
npm test                    # run all tests
npm test -- --coverage      # with coverage report
```

Minimum 80% statement coverage on all files in `components/` and `lib/`. All 158 baseline tests must remain passing.

## Security

- `semgrep scan --config=auto --severity=WARNING --severity=ERROR` must return 0 findings before every deploy
- All filesystem paths built from URL parameters use `safeJoin` + `isValidSlug` (see `lib/content.ts`)
- CSP, X-Frame-Options, and other security headers are set in `next.config.ts`
- Never weaken the CSP — add new external origins to the specific directive rather than broadening `default-src`
