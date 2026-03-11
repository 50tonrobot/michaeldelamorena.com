import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Platform engineer and reliability architect with 20+ years of experience designing distributed systems, Kubernetes platforms, and observability stacks.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <h1 className="text-3xl font-bold text-zinc-50">About</h1>
        <p className="mt-3 text-zinc-400 leading-relaxed">
          Platform engineer and reliability architect with 20+ years designing
          distributed systems, Kubernetes infrastructure, and observability
          platforms.
        </p>
      </header>

      <section aria-labelledby="background-heading" className="mb-12">
        <h2 id="background-heading" className="text-xl font-semibold text-zinc-50 mb-4">
          Background
        </h2>
        <div className="space-y-4 text-zinc-400 leading-relaxed">
          <p>
            I started as a software developer writing application code across a
            range of domains. Over time I gravitated toward the infrastructure
            layer — the systems that determine whether applications are
            available, observable, and scalable. That shift turned into a career
            focused on cloud infrastructure, platform engineering, and
            reliability architecture.
          </p>
          <p>
            Across roles at enterprise and growth-stage organizations, I have
            designed and operated infrastructure that supports thousands of
            applications, governed 40+ Kubernetes clusters, led migrations from
            costly proprietary tooling to open-source observability stacks, and
            built the CI/CD platforms that engineering organizations depend on
            daily.
          </p>
          <p>
            More recently, I have been exploring how AI-assisted workflows
            change the nature of infrastructure work — from intelligent alerting
            and automated diagnostics to agent-driven remediation. That
            exploration runs alongside a deep interest in AI security: the
            vulnerabilities that appear when LLMs are integrated into production
            systems.
          </p>
        </div>
      </section>

      <section aria-labelledby="philosophy-heading" className="mb-12">
        <h2 id="philosophy-heading" className="text-xl font-semibold text-zinc-50 mb-4">
          Engineering Philosophy
        </h2>
        <ul role="list" className="space-y-4">
          {[
            {
              principle: "Reliability is an architectural property.",
              detail:
                "It cannot be added after a system is designed. Reliability must be designed in from the start — through redundancy, graceful degradation, and clearly defined SLOs.",
            },
            {
              principle: "Observability enables engineering autonomy.",
              detail:
                "When engineers can understand system behavior without asking an expert, they move faster and resolve incidents independently. Observability is a force multiplier.",
            },
            {
              principle: "Automation reduces operational risk.",
              detail:
                "Manual processes introduce variance and fatigue. Well-designed automation eliminates entire categories of human error.",
            },
            {
              principle: "Infrastructure should be self-service.",
              detail:
                "Platform teams exist to remove friction from product engineering. If developers need to open a ticket to provision infrastructure, the platform has failed.",
            },
            {
              principle: "Platform engineering increases developer velocity.",
              detail:
                "The measure of a good platform team is not the quality of the platform itself — it is the speed and confidence with which product engineers ship.",
            },
          ].map(({ principle, detail }) => (
            <li key={principle} className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              <p className="font-semibold text-zinc-50">{principle}</p>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="exploration-heading">
        <h2 id="exploration-heading" className="text-xl font-semibold text-zinc-50 mb-4">
          Current Areas of Exploration
        </h2>
        <ul role="list" className="grid gap-3 sm:grid-cols-2">
          {[
            "AI-assisted development workflows",
            "Agent-driven infrastructure operations",
            "AI security vulnerabilities in LLM applications",
            "Reliability engineering practices and SRE tooling",
          ].map((area) => (
            <li
              key={area}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300"
            >
              {area}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
