import { render, screen } from "@testing-library/react";
import { ArticleCard } from "@/components/content/ArticleCard";
import type { BlogPost } from "@/types/content";

// Render next/link as a plain anchor so href assertions work in jsdom.
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Badge uses @base-ui/react internals — stub it out so TagList renders cleanly.
jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
}));

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function buildMockPost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: "test-article",
    readingTime: "5 min read",
    frontmatter: {
      title: "Test Article Title",
      description: "A short description of the test article.",
      date: "2025-06-15",
      tags: ["TypeScript", "Next.js"],
      featured: false,
      draft: false,
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ArticleCard", () => {
  describe("title link", () => {
    it("renders the post title as a link", () => {
      render(<ArticleCard post={buildMockPost()} />);
      const link = screen.getByRole("link", { name: /test article title/i });
      expect(link).toBeInTheDocument();
    });

    it("links to /blog/[slug]", () => {
      render(<ArticleCard post={buildMockPost({ slug: "my-post" })} />);
      const link = screen.getByRole("link", { name: /test article title/i });
      expect(link).toHaveAttribute("href", "/blog/my-post");
    });

    it("uses the frontmatter title as the visible link text", () => {
      const post = buildMockPost();
      post.frontmatter.title = "Kubernetes Networking Deep Dive";
      render(<ArticleCard post={post} />);
      expect(
        screen.getByRole("link", { name: /kubernetes networking deep dive/i })
      ).toBeInTheDocument();
    });
  });

  describe("formatted date", () => {
    it("renders the date formatted as 'Month Day, Year'", () => {
      // "2025-06-15" → "June 15, 2025" (en-US locale)
      render(<ArticleCard post={buildMockPost()} />);
      // toLocaleDateString output varies slightly across Node versions; match
      // the year and month name to keep the test robust.
      expect(screen.getByText(/june/i)).toBeInTheDocument();
      expect(screen.getByText(/2025/)).toBeInTheDocument();
    });

    it("renders a <time> element with the raw ISO date as dateTime", () => {
      render(<ArticleCard post={buildMockPost()} />);
      const time = document.querySelector("time");
      expect(time).not.toBeNull();
      expect(time).toHaveAttribute("dateTime", "2025-06-15");
    });
  });

  describe("reading time", () => {
    it("renders the reading time text", () => {
      render(<ArticleCard post={buildMockPost({ readingTime: "7 min read" })} />);
      expect(screen.getByText("7 min read")).toBeInTheDocument();
    });
  });

  describe("description", () => {
    it("renders the post description", () => {
      render(<ArticleCard post={buildMockPost()} />);
      expect(
        screen.getByText("A short description of the test article.")
      ).toBeInTheDocument();
    });
  });

  describe("tags", () => {
    it("renders tags via TagList when tags are present", () => {
      render(<ArticleCard post={buildMockPost()} />);
      // TagList renders a ul with aria-label="Tags"
      expect(screen.getByRole("list", { name: /tags/i })).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
    });

    it("does not render a tag list when tags array is empty", () => {
      const post = buildMockPost();
      post.frontmatter.tags = [];
      render(<ArticleCard post={post} />);
      expect(
        screen.queryByRole("list", { name: /tags/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("accessible structure", () => {
    it("wraps the card in an <article> element", () => {
      render(<ArticleCard post={buildMockPost()} />);
      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("title link text matches the frontmatter title (accessible name)", () => {
      const post = buildMockPost();
      post.frontmatter.title = "Go Concurrency Patterns";
      render(<ArticleCard post={post} />);
      const link = screen.getByRole("link", { name: "Go Concurrency Patterns" });
      expect(link).toBeInTheDocument();
    });
  });
});
