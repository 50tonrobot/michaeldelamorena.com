import Link from "next/link";
import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/content/ProjectCard";

export function FeaturedProjects() {
  const featured = getAllProjects()
    .filter((p) => p.frontmatter.featured)
    .slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="projects-heading" className="py-16 border-b border-zinc-800">
      <div className="flex items-center justify-between mb-8">
        <h2 id="projects-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Featured Projects
        </h2>
        <Link
          href="/projects"
          className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          aria-label="View all projects"
        >
          All projects →
        </Link>
      </div>
      <ul role="list" className="grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
