import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProjects, getProjectRaw } from "@/lib/content";
import { MDXContent } from "@/components/content/MDXContent";
import { TagList } from "@/components/content/TagList";
import { siteConfig } from "@/lib/site";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectRaw(slug);
  if (!project) return {};

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      type: "article",
      url: `${siteConfig.url}/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectRaw(slug);
  if (!project) notFound();

  const { content, frontmatter } = project;

  return (
    <article>
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <Link
          href="/projects"
          className="inline-block mb-6 text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          aria-label="Back to all projects"
        >
          ← Projects
        </Link>
        <h1 className="text-3xl font-bold text-zinc-50 leading-tight">
          {frontmatter.title}
        </h1>
        <p className="mt-3 text-zinc-400 max-w-2xl leading-relaxed">
          {frontmatter.description}
        </p>
        {frontmatter.tags.length > 0 && (
          <div className="mt-4">
            <TagList tags={frontmatter.tags} />
          </div>
        )}
      </header>

      <MDXContent source={content} />

      <footer className="mt-12 pt-8 border-t border-zinc-800">
        <Link
          href="/projects"
          className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          aria-label="Back to all projects"
        >
          ← Back to all projects
        </Link>
      </footer>
    </article>
  );
}
