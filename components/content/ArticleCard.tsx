import Link from "next/link";
import { TagList } from "./TagList";
import type { BlogPost } from "@/types/content";

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const { slug, frontmatter, readingTime } = post;
  const headingId = `article-title-${slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className="group border border-zinc-800 rounded-lg p-6 bg-zinc-900 hover:border-zinc-600 transition-colors"
    >
      <Link
        href={`/blog/${slug}`}
        className="block focus:outline-none focus-visible:outline-2 focus-visible:outline-sky-400 focus-visible:outline-offset-2 rounded-sm"
      >
        <h2
          id={headingId}
          className="text-lg font-semibold text-zinc-50 group-hover:text-sky-400 transition-colors leading-snug"
        >
          {frontmatter.title}
        </h2>
      </Link>
      <div className="mt-2 flex items-center gap-3 text-sm text-zinc-400">
        <time dateTime={frontmatter.date}>
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">·</span>
        <span>{readingTime}</span>
      </div>
      <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-2">
        {frontmatter.description}
      </p>
      {frontmatter.tags.length > 0 && (
        <div className="mt-4">
          <TagList tags={frontmatter.tags} />
        </div>
      )}
    </article>
  );
}
