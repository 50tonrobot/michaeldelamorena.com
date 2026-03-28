const metrics = [
  { value: "20+", label: "Years of engineering & technical leadership" },
  { value: "15 min", label: "Disaster recovery RTA achieved" },
  { value: "62%", label: "AWS cost reduction achieved" },
  { value: "$527K", label: "AWS infrastructure savings delivered" },
];

export function CredibilityMetrics() {
  return (
    <section aria-labelledby="metrics-heading" className="py-16 border-b border-zinc-800">
      <h2 id="metrics-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-8">
        By the Numbers
      </h2>
      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <dd className="text-3xl font-bold text-sky-400">{metric.value}</dd>
            <dt className="mt-2 text-sm text-zinc-400 leading-snug">{metric.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
