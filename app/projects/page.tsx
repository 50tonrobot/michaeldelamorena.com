import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/content/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Platform engineering and infrastructure projects including Kubernetes homelab, observability platforms, and AI-assisted tooling.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-50">Projects</h1>
        <p className="mt-3 text-zinc-400 max-w-2xl">
          Platform engineering, infrastructure architecture, and AI experiments
          — each with a problem statement, architecture overview, and lessons
          learned.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-zinc-400">No projects published yet.</p>
      ) : (
        <section aria-label="Projects">
          <ul role="list" className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
