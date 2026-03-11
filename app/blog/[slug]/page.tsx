import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import readingTime from "reading-time";
import { getAllBlogPosts, getBlogPostRaw } from "@/lib/content";
import { MDXContent } from "@/components/content/MDXContent";
import { TagList } from "@/components/content/TagList";
import { siteConfig } from "@/lib/site";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostRaw(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      url: `${siteConfig.url}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getBlogPostRaw(slug);
  if (!post) notFound();

  const { content, frontmatter } = post;
  const stats = readingTime(content);

  return (
    <article>
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <Link
          href="/blog"
          className="inline-block mb-6 text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          aria-label="Back to all blog posts"
        >
          ← Blog
        </Link>
        <h1 className="text-3xl font-bold text-zinc-50 leading-tight">
          {frontmatter.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{stats.text}</span>
        </div>
        {frontmatter.tags.length > 0 && (
          <div className="mt-4">
            <TagList tags={frontmatter.tags} />
          </div>
        )}
      </header>

      <MDXContent source={content} />

      <footer className="mt-12 pt-8 border-t border-zinc-800">
        <Link
          href="/blog"
          className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          aria-label="Back to all blog posts"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
