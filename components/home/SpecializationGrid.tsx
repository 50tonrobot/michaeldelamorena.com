const specializations = [
  {
    title: "Kubernetes Platform Engineering",
    description:
      "Designing and operating scalable, self-service Kubernetes platforms that improve developer velocity across large engineering organizations.",
  },
  {
    title: "Observability & Reliability Engineering",
    description:
      "Building telemetry pipelines, defining SLOs, and establishing error budgets that make reliability measurable and actionable.",
  },
  {
    title: "Cloud Architecture & Cost Optimization",
    description:
      "Architecting cloud-native systems at scale, with a track record of significant infrastructure cost reduction without sacrificing reliability.",
  },
  {
    title: "AI-Assisted Infrastructure Automation",
    description:
      "Exploring how LLMs and AI agents can augment infrastructure operations — from intelligent alerting to automated runbook execution.",
  },
];

export function SpecializationGrid() {
  return (
    <section aria-labelledby="specializations-heading" className="py-16 border-b border-zinc-800">
      <h2 id="specializations-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-8">
        Core Specializations
      </h2>
      <ul role="list" className="grid gap-6 sm:grid-cols-2">
        {specializations.map((item) => (
          <li key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-base font-semibold text-zinc-50">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
