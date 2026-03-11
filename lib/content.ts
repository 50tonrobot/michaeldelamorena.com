import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  BlogPost,
  BlogFrontmatter,
  Project,
  ProjectFrontmatter,
} from "@/types/content";

const contentDir = path.join(process.cwd(), "content");

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Resolves a path and verifies it does not escape the base directory.
 * Returns null if the resolved path is outside baseDir (path traversal guard).
 */
function safeJoin(baseDir: string, ...segments: string[]): string | null {
  // nosemgrep: path-join-resolve-traversal
  // baseDir is always a hardcoded internal path (getBlogDir / getProjectsDir).
  // This function IS the path traversal guard: it resolves and then verifies
  // the result stays within baseDir before returning it.
  const base = path.resolve(baseDir); // nosemgrep: path-join-resolve-traversal
  const resolved = path.resolve(baseDir, ...segments); // nosemgrep: path-join-resolve-traversal
  if (resolved !== base && !resolved.startsWith(base + path.sep)) return null;
  return resolved;
}

function normalizeBlogFrontmatter(data: Record<string, unknown>): BlogFrontmatter {
  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
  };
}

function normalizeProjectFrontmatter(data: Record<string, unknown>): ProjectFrontmatter {
  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    featured: Boolean(data.featured),
    order: typeof data.order === "number" ? data.order : 99,
    draft: data.draft !== undefined ? Boolean(data.draft) : undefined,
  };
}

function getBlogDir(): string {
  return path.join(contentDir, "blog");
}

function getProjectsDir(): string {
  return path.join(contentDir, "projects");
}

export function getAllBlogPosts(): BlogPost[] {
  const dir = getBlogDir();
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = safeJoin(dir, filename);
      if (!filePath) return null;
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = normalizeBlogFrontmatter(data);
      const stats = readingTime(content);

      return {
        slug,
        frontmatter,
        readingTime: stats.text,
      };
    })
    .filter((post): post is BlogPost => post !== null && !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getBlogPostRaw(
  slug: string
): { content: string; frontmatter: BlogFrontmatter } | null {
  if (!isValidSlug(slug)) return null;
  const filePath = safeJoin(getBlogDir(), `${slug}.mdx`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return { content, frontmatter: normalizeBlogFrontmatter(data) };
}

export function getAllProjects(): Project[] {
  const dir = getProjectsDir();
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = safeJoin(dir, filename);
      if (!filePath) return null;
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const frontmatter = normalizeProjectFrontmatter(data);

      return { slug, frontmatter };
    })
    .filter((p): p is Project => p !== null && !p.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99));
}

export function getProjectRaw(
  slug: string
): { content: string; frontmatter: ProjectFrontmatter } | null {
  if (!isValidSlug(slug)) return null;
  const filePath = safeJoin(getProjectsDir(), `${slug}.mdx`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return { content, frontmatter: normalizeProjectFrontmatter(data) };
}
