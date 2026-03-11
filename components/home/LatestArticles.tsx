import Link from "next/link";
import { getAllBlogPosts } from "@/lib/content";
import { ArticleCard } from "@/components/content/ArticleCard";

export function LatestArticles() {
  const latest = getAllBlogPosts().slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section aria-labelledby="articles-heading" className="py-16 border-b border-zinc-800">
      <div className="flex items-center justify-between mb-8">
        <h2 id="articles-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Latest Articles
        </h2>
        <Link
          href="/blog"
          className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          aria-label="View all articles"
        >
          All articles →
        </Link>
      </div>
      <ul role="list" className="space-y-4">
        {latest.map((post) => (
          <li key={post.slug}>
            <ArticleCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
