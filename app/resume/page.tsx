import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Michael de la Morena — Platform Engineer and Reliability Architect with 20+ years of experience.",
};

const technicalStack: Record<string, string[]> = {
  "Container Orchestration": ["Kubernetes", "K3s", "Helm", "Kustomize", "Crossplane"],
  "Cloud Platforms": ["AWS", "GCP", "Azure"],
  "Observability": ["Prometheus", "Grafana", "Elasticsearch", "Fluent Bit", "Datadog"],
  "Infrastructure as Code": ["Terraform", "Pulumi", "Ansible"],
  "CI/CD": ["GitHub Actions", "Jenkins", "ArgoCD", "Flux"],
  "Languages & Runtimes": ["TypeScript", "Python", "Go", "Node.js", "Bash"],
  "Databases": ["MongoDB", "PostgreSQL", "Redis"],
  "AI / ML": ["OpenAI API", "Anthropic API", "LangChain", "RAG architectures"],
};

export default function ResumePage() {
  return (
    <div className="max-w-3xl">
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Michael de la Morena</h1>
            <p className="mt-2 text-lg text-sky-400 font-medium">
              Platform Engineer · Reliability Architect
            </p>
          </div>
          <Link
            href={siteConfig.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center rounded-md bg-sky-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-sky-300 transition-colors self-start"
            aria-label="Download resume as PDF"
          >
            Download PDF
          </Link>
        </div>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          20+ years designing and operating distributed systems. Specialized in
          Kubernetes platform engineering, observability architecture, and
          reliability engineering at enterprise scale. Track record of
          significant cost reduction, platform consolidation, and developer
          experience improvement.
        </p>
      </header>

      <section aria-labelledby="achievements-heading" className="mb-12">
        <h2 id="achievements-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6">
          Key Achievements
        </h2>
        <ul role="list" className="space-y-3">
          {[
            "Reduced AWS infrastructure costs by 62% through resource right-sizing, Reserved Instance strategy, and architecture optimization",
            "Governed 40+ Kubernetes clusters across AWS and GCP, spanning ephemeral development environments and enterprise production workloads",
            "Built CI/CD platform supporting 5,000+ applications across a large enterprise engineering organization",
            "Led migration from Splunk to a Kubernetes-native observability stack (Fluent Bit, Elasticsearch, Prometheus, Grafana), eliminating significant licensing costs",
            "Designed and implemented Crossplane-based self-service infrastructure platform enabling product teams to provision cloud resources without platform team involvement",
            "Established SRE practice including SLO framework, error budget policy, and on-call structure across multiple engineering organizations",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stack-heading" className="mb-12">
        <h2 id="stack-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6">
          Technical Stack
        </h2>
        <dl className="space-y-4">
          {Object.entries(technicalStack).map(([category, items]) => (
            <div key={category} className="grid gap-2 sm:grid-cols-[200px_1fr]">
              <dt className="text-sm font-medium text-zinc-400">{category}</dt>
              <dd className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6">
          Experience Highlights
        </h2>
        <div className="space-y-8">
          {[
            {
              role: "Staff Platform Engineer",
              context: "Enterprise SaaS — Cloud Infrastructure",
              period: "Recent",
              highlights: [
                "Led Kubernetes platform architecture across multiple production environments",
                "Established observability standards and SLO framework adopted org-wide",
                "Drove 62% AWS cost reduction through systematic FinOps program",
              ],
            },
            {
              role: "Senior Infrastructure Engineer",
              context: "Growth-Stage Technology Company",
              period: "Prior",
              highlights: [
                "Built and operated CI/CD platform supporting 5,000+ application workloads",
                "Architected multi-cloud Kubernetes strategy using Crossplane",
                "Designed and delivered platform self-service capabilities for developer teams",
              ],
            },
            {
              role: "Cloud Architect / SRE",
              context: "Multiple Organizations",
              period: "Earlier",
              highlights: [
                "20+ years of progressive engineering and infrastructure roles",
                "Transitioned from software development into cloud infrastructure and platform engineering",
                "Built reliable systems across fintech, healthcare, and enterprise software domains",
              ],
            },
          ].map(({ role, context, period, highlights }) => (
            <div key={role} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-50">{role}</h3>
                  <p className="text-sm text-zinc-400">{context}</p>
                </div>
                <span className="text-sm text-zinc-400 sm:shrink-0">{period}</span>
              </div>
              <ul role="list" className="mt-4 space-y-2">
                {highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
