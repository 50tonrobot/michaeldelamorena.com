import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/content";
import { ArticleCard } from "@/components/content/ArticleCard";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Technical writing on platform engineering, Kubernetes, observability, and AI infrastructure by ${siteConfig.name}.`,
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-50">Blog</h1>
        <p className="mt-3 text-zinc-400 max-w-2xl">
          Technical writing on platform engineering, reliability architecture,
          observability, and AI-assisted infrastructure.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-zinc-400">No posts published yet.</p>
      ) : (
        <section aria-label="Blog posts">
          <ul role="list" className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <ArticleCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
