// Hoist the mock so it is available before module evaluation
jest.mock("fs");

import fs from "fs";
import { getAllBlogPosts, getBlogPostRaw, getAllProjects, getProjectRaw } from "@/lib/content";

const mockedFs = fs as jest.Mocked<typeof fs>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mdxFixture(frontmatter: Record<string, unknown>, body = "Content here."): string {
  const lines = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  return `---\n${lines}\n---\n${body}`;
}

// ─── getAllBlogPosts ──────────────────────────────────────────────────────────

describe("getAllBlogPosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an empty array when the blog directory does not exist", () => {
    mockedFs.existsSync.mockReturnValue(false);

    const result = getAllBlogPosts();

    expect(result).toEqual([]);
  });

  it("returns an empty array when the directory exists but has no .mdx files", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([] as unknown as ReturnType<typeof fs.readdirSync>);

    const result = getAllBlogPosts();

    expect(result).toEqual([]);
  });

  it("filters out posts with draft: true", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      "published-post.mdx",
      "draft-post.mdx",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    mockedFs.readFileSync.mockImplementation((filePath) => {
      if (String(filePath).includes("published-post")) {
        return mdxFixture({
          title: "Published",
          date: "2025-01-01",
          draft: false,
          tags: [],
          featured: false,
          description: "desc",
        });
      }
      return mdxFixture({
        title: "Draft",
        date: "2025-01-02",
        draft: true,
        tags: [],
        featured: false,
        description: "desc",
      });
    });

    const result = getAllBlogPosts();

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("published-post");
  });

  it("sorts posts by date descending (newest first)", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      "older.mdx",
      "newest.mdx",
      "middle.mdx",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    mockedFs.readFileSync.mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes("older")) {
        return mdxFixture({
          title: "Older",
          date: "2024-01-01",
          draft: false,
          tags: [],
          featured: false,
          description: "desc",
        });
      }
      if (p.includes("newest")) {
        return mdxFixture({
          title: "Newest",
          date: "2025-06-01",
          draft: false,
          tags: [],
          featured: false,
          description: "desc",
        });
      }
      return mdxFixture({
        title: "Middle",
        date: "2025-01-15",
        draft: false,
        tags: [],
        featured: false,
        description: "desc",
      });
    });

    const result = getAllBlogPosts();

    expect(result[0].slug).toBe("newest");
    expect(result[1].slug).toBe("middle");
    expect(result[2].slug).toBe("older");
  });

  it("includes readingTime in each returned post", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      "my-post.mdx",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    mockedFs.readFileSync.mockReturnValue(
      mdxFixture(
        { title: "Post", date: "2025-01-01", draft: false, tags: [], featured: false, description: "d" },
        "A ".repeat(300)
      )
    );

    const result = getAllBlogPosts();

    expect(result[0].readingTime).toBeTruthy();
    expect(typeof result[0].readingTime).toBe("string");
  });
});

// ─── getBlogPostRaw ───────────────────────────────────────────────────────────

describe("getBlogPostRaw", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when the file does not exist", () => {
    mockedFs.existsSync.mockReturnValue(false);

    const result = getBlogPostRaw("nonexistent-slug");

    expect(result).toBeNull();
  });

  it("returns content and frontmatter for a valid slug", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(
      mdxFixture(
        { title: "My Post", date: "2025-03-01", draft: false, tags: ["ts"], featured: false, description: "a desc" },
        "The body content."
      )
    );

    const result = getBlogPostRaw("my-post");

    expect(result).not.toBeNull();
    expect(result!.frontmatter.title).toBe("My Post");
    expect(result!.content).toContain("The body content.");
  });
});

// ─── getAllProjects ───────────────────────────────────────────────────────────

describe("getAllProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an empty array when the projects directory does not exist", () => {
    mockedFs.existsSync.mockReturnValue(false);

    const result = getAllProjects();

    expect(result).toEqual([]);
  });

  it("sorts projects by the order field ascending", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      "project-b.mdx",
      "project-a.mdx",
      "project-c.mdx",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    mockedFs.readFileSync.mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes("project-a")) {
        return mdxFixture({ title: "A", date: "2025-01-01", order: 1, tags: [], featured: false, description: "d" });
      }
      if (p.includes("project-b")) {
        return mdxFixture({ title: "B", date: "2025-01-01", order: 2, tags: [], featured: false, description: "d" });
      }
      return mdxFixture({ title: "C", date: "2025-01-01", order: 3, tags: [], featured: false, description: "d" });
    });

    const result = getAllProjects();

    expect(result[0].slug).toBe("project-a");
    expect(result[1].slug).toBe("project-b");
    expect(result[2].slug).toBe("project-c");
  });

  it("uses 99 as the default order when order field is missing", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      "no-order.mdx",
      "first.mdx",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    mockedFs.readFileSync.mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes("no-order")) {
        return mdxFixture({ title: "No order", date: "2025-01-01", tags: [], featured: false, description: "d" });
      }
      return mdxFixture({ title: "First", date: "2025-01-01", order: 1, tags: [], featured: false, description: "d" });
    });

    const result = getAllProjects();

    expect(result[0].slug).toBe("first");
    expect(result[1].slug).toBe("no-order");
  });

  it("filters out projects with draft: true", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      "live-project.mdx",
      "draft-project.mdx",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    mockedFs.readFileSync.mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes("live-project")) {
        return mdxFixture({ title: "Live", date: "2025-01-01", order: 1, tags: [], featured: false, description: "d" });
      }
      return mdxFixture({ title: "Draft", date: "2025-01-01", order: 2, draft: true, tags: [], featured: false, description: "d" });
    });

    const result = getAllProjects();

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("live-project");
  });
});

// ─── getProjectRaw ────────────────────────────────────────────────────────────

describe("getProjectRaw", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when the project file does not exist", () => {
    mockedFs.existsSync.mockReturnValue(false);

    const result = getProjectRaw("missing-project");

    expect(result).toBeNull();
  });

  it("returns content and frontmatter for a valid project slug", () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(
      mdxFixture(
        { title: "My Project", date: "2025-01-01", order: 1, tags: ["k8s"], featured: true, description: "a project" },
        "Project body."
      )
    );

    const result = getProjectRaw("my-project");

    expect(result).not.toBeNull();
    expect(result!.frontmatter.title).toBe("My Project");
    expect(result!.content).toContain("Project body.");
  });
});
