import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Michael de la Morena — Engineering Manager specializing in cloud platform architecture, Kubernetes governance, and large-scale infrastructure modernization.",
};

const technicalProficiencies: Record<string, string[]> = {
  "AI / Automation": ["ChatGPT", "Claude", "MCP Integrations"],
  "Cloud & Containers": [
    "AWS (EKS, EC2, RDS, S3, Lambda, CloudFormation)",
    "GCP",
    "Kubernetes",
    "Docker",
    "Helm",
    "Argo CD",
    "Crossplane",
  ],
  "CI/CD & Platform": ["Harness", "Jenkins", "GitOps", "Infrastructure as Code"],
  "Observability & Security": [
    "EFK",
    "Prometheus",
    "Grafana",
    "Splunk",
    "RUM",
    "HashiCorp Vault/Consul",
    "Secrets Management",
    "Incident Response",
  ],
  "Languages & Databases": ["Python", "JavaScript", "Node.js", "PostgreSQL", "MySQL", "SQL"],
};

const keyAchievements = [
  "Reduced AWS infrastructure costs by 62% ($527K cumulative savings) through query optimization, backend refactoring, rightsizing, and Reserved Instance strategy",
  "Led Kubernetes migration at Shadow Health replacing legacy production systems serving 100,000 monthly users",
  "Built disaster recovery automation at Shadow Health achieving 15-minute recovery times",
  "Developed LLM-assisted engineering workflows using Claude and ChatGPT, reducing developer effort by 40–60% on legacy codebase analysis and refactoring",
];

interface ExperienceRole {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

const experience: ExperienceRole[] = [
  {
    role: "Sr. Engineer (SRE)",
    company: "Walt Disney World (TEKSystems)",
    location: "Gainesville, FL",
    period: "2025–Present",
    highlights: [],
  },
  {
    role: "Staff Engineer",
    company: "Fracture",
    location: "Gainesville, FL",
    period: "2023–2025",
    highlights: [
      "Directed migration to AWS EKS with Transit Gateway automation, improving scalability and network reliability.",
      "Reduced AWS spend by 62% ($527K cumulative savings) through query optimization, backend refactoring, and rightsizing.",
      "Guided Postgres 10→14 upgrade under tight timelines, improving database stability and performance.",
      "Implemented Shopify EventBridge integration for event-driven architecture.",
      "Transitioned observability from Splunk + RUM to a Kubernetes-native stack (EFK + Prometheus/Grafana) with Helm-driven automation.",
      "Developed LLM-assisted workflows using Claude and ChatGPT to analyze legacy codebases and guide refactoring, reducing developer effort by 40–60%.",
    ],
  },
  {
    role: "Engineering Manager",
    company: "Fracture",
    location: "Gainesville, FL",
    period: "2022–2023",
    highlights: [
      "Directed migration to Shopify and Kubernetes, improving scalability and performance.",
      "Oversaw transition from WordPress to Contentful, reducing time-to-publish.",
      "Championed database migration and observability improvements (Splunk + RUM).",
      "Led internal tech talks, office hours, and engineering discussions on Platform Engineering, SRE, and Cloud Architecture.",
    ],
  },
  {
    role: "Software Developer 4",
    company: "Fracture",
    location: "Gainesville, FL",
    period: "2020–2022",
    highlights: [
      "Designed secure Kubernetes deployment automation, reducing lead times and improving reliability.",
      "Championed Helm and CI/CD pipeline adoption, standardizing deployments across teams.",
    ],
  },
  {
    role: "Cloud Design Engineer",
    company: "TEKSystems (Disney Parks)",
    location: "Orlando, FL",
    period: "2019–2020",
    highlights: [
      "Designed scalable reference architectures and led technical debt reduction initiatives.",
      "Improved CI/CD architecture supporting thousands of pipelines and mitigated base image supply chain risks.",
      "Built Python tooling to audit AWS instances across accounts; delivered Elasticsearch provisioning and incident response training.",
    ],
  },
  {
    role: "Systems Architect / Cloud Systems Engineer",
    company: "Shadow Health",
    location: "Gainesville, FL",
    period: "2017–2019",
    highlights: [
      "Led migration to Kubernetes, replacing legacy production systems serving 100,000 monthly users.",
      "Designed modular CI/CD pipelines (Jenkins, Helm) with canary/blue-green deployments.",
      "Built disaster recovery automation achieving 15-minute recovery times.",
      "Directed Kubernetes gameday scenarios and a 5-week training program enabling engineers to independently migrate applications.",
      "Implemented RBAC and HashiCorp Vault for secure secrets management.",
    ],
  },
  {
    role: "Developer",
    company: "Mobile Nations / Smartphone Experts",
    location: "Key Biscayne, FL",
    period: "2010–2017",
    highlights: [
      "Built mass email marketing system generating $15K/month in new revenue.",
      "Deployed Sphinx search engine across properties enabling unified site-wide search.",
      "Improved e-commerce operations with custom Node.js tools and PHP cart refactoring.",
    ],
  },
];

const additionalExperience = [
  "Software Developer | Market Leverage",
  "Programmer I | Solution: Unitech",
  "Help Desk Technician | Gainsco Auto Insurance",
  "Web Developer | Miami-Dade College",
];

export default function ResumePage() {
  return (
    <div className="max-w-3xl">
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Michael de la Morena</h1>
            <p className="mt-2 text-lg text-sky-400 font-medium">
              Engineering Manager · Cloud Infrastructure &amp; Platform Engineering
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
          Engineering leader specializing in cloud platform architecture, Kubernetes governance, and
          large-scale infrastructure modernization. Led multi-cluster enterprise environments,
          reduced cloud spend by 62% ($527K cumulative savings), and accelerated service onboarding
          through automation and standardized provisioning. Experienced in aligning platform
          engineering with business outcomes, strengthening enterprise security posture and
          governance controls, and enabling developer velocity at scale. Hands-on across AWS, GCP,
          Kubernetes, Harness, and Crossplane, while actively integrating LLM-assisted engineering
          workflows, prompt engineering techniques, and agent-based automation.
        </p>
      </header>

      <section aria-labelledby="achievements-heading" className="mb-12">
        <h2
          id="achievements-heading"
          className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6"
        >
          Key Achievements
        </h2>
        <ul role="list" className="space-y-3">
          {keyAchievements.map((item) => (
            <li key={item} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="proficiencies-heading" className="mb-12">
        <h2
          id="proficiencies-heading"
          className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6"
        >
          Technical Proficiencies
        </h2>
        <dl className="space-y-4">
          {Object.entries(technicalProficiencies).map(([category, items]) => (
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

      <section aria-labelledby="experience-heading" className="mb-12">
        <h2
          id="experience-heading"
          className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6"
        >
          Experience
        </h2>
        <div className="space-y-8">
          {experience.map(({ role, company, location, period, highlights }) => (
            <div key={`${role}-${company}`} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-50">{role}</h3>
                  <p className="text-sm text-zinc-400">
                    {company} &mdash; {location}
                  </p>
                </div>
                <span className="text-sm text-zinc-400 sm:shrink-0">{period}</span>
              </div>
              {highlights.length > 0 && (
                <ul role="list" className="mt-4 space-y-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600"
                        aria-hidden="true"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="additional-experience-heading" className="mb-12">
        <h2
          id="additional-experience-heading"
          className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6"
        >
          Additional Experience
        </h2>
        <ul role="list" className="space-y-2">
          {additionalExperience.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="education-heading">
        <h2
          id="education-heading"
          className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6"
        >
          Education
        </h2>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-zinc-50">
                B.S., Computer Information Systems (Enterprise Computing)
              </h3>
              <p className="text-sm text-zinc-400">DeVry University &mdash; Miramar, FL</p>
              <p className="mt-1 text-sm text-zinc-400">Summa Cum Laude, 4.0 GPA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
