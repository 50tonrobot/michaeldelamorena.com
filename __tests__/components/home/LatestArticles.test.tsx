import { render, screen } from "@testing-library/react";
import { LatestArticles } from "@/components/home/LatestArticles";
import { getAllBlogPosts } from "@/lib/content";

// Render next/link as a plain anchor so href and attribute assertions work in jsdom.
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

// Mock the content module to avoid filesystem access.
jest.mock("@/lib/content", () => ({
  getAllBlogPosts: jest.fn(),
  getAllProjects: jest.fn(),
}));

// Stub ArticleCard to keep the tree shallow and assertions focused.
jest.mock("@/components/content/ArticleCard", () => ({
  ArticleCard: ({
    post,
  }: {
    post: { slug: string; frontmatter: { title: string } };
  }) => <div data-testid="article-card">{post.frontmatter.title}</div>,
}));

const mockGetAllBlogPosts = getAllBlogPosts as jest.Mock;

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function buildPost(overrides: { slug?: string; title?: string } = {}) {
  const { slug = "test-post", title = "Test Post Title" } = overrides;
  return {
    slug,
    readingTime: "4 min read",
    frontmatter: {
      title,
      description: "A short post description.",
      date: "2025-06-01",
      tags: ["TypeScript"],
      featured: false,
      draft: false,
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LatestArticles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when there are no posts", () => {
    it("returns null when getAllBlogPosts returns an empty array", () => {
      mockGetAllBlogPosts.mockReturnValue([]);
      const { container } = render(<LatestArticles />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when posts exist", () => {
    it("renders an article card for each post (up to 3)", () => {
      mockGetAllBlogPosts.mockReturnValue([
        buildPost({ slug: "post-1", title: "First Post" }),
        buildPost({ slug: "post-2", title: "Second Post" }),
        buildPost({ slug: "post-3", title: "Third Post" }),
      ]);
      render(<LatestArticles />);
      const cards = screen.getAllByTestId("article-card");
      expect(cards).toHaveLength(3);
    });

    it("renders only up to 3 article cards even when more posts exist", () => {
      mockGetAllBlogPosts.mockReturnValue([
        buildPost({ slug: "post-1", title: "First Post" }),
        buildPost({ slug: "post-2", title: "Second Post" }),
        buildPost({ slug: "post-3", title: "Third Post" }),
        buildPost({ slug: "post-4", title: "Fourth Post" }),
        buildPost({ slug: "post-5", title: "Fifth Post" }),
      ]);
      render(<LatestArticles />);
      const cards = screen.getAllByTestId("article-card");
      expect(cards).toHaveLength(3);
    });

    it("renders the post titles inside the cards", () => {
      mockGetAllBlogPosts.mockReturnValue([
        buildPost({ slug: "post-a", title: "Alpha Article" }),
        buildPost({ slug: "post-b", title: "Beta Article" }),
      ]);
      render(<LatestArticles />);
      expect(screen.getByText("Alpha Article")).toBeInTheDocument();
      expect(screen.getByText("Beta Article")).toBeInTheDocument();
    });

    it("renders the 'All articles' link pointing to /blog", () => {
      mockGetAllBlogPosts.mockReturnValue([buildPost()]);
      render(<LatestArticles />);
      const link = screen.getByRole("link", { name: /view all articles/i });
      expect(link).toHaveAttribute("href", "/blog");
    });

    it("'All articles' link has aria-label='View all articles'", () => {
      mockGetAllBlogPosts.mockReturnValue([buildPost()]);
      render(<LatestArticles />);
      const link = screen.getByRole("link", { name: "View all articles" });
      expect(link).toHaveAttribute("aria-label", "View all articles");
    });

    it("renders the section heading 'Latest Articles'", () => {
      mockGetAllBlogPosts.mockReturnValue([buildPost()]);
      render(<LatestArticles />);
      expect(
        screen.getByRole("heading", { name: /latest articles/i })
      ).toBeInTheDocument();
    });
  });

  describe("accessible structure", () => {
    beforeEach(() => {
      mockGetAllBlogPosts.mockReturnValue([
        buildPost({ slug: "acc-post", title: "Accessible Article" }),
      ]);
    });

    it("section is labelled by h2 with id='articles-heading'", () => {
      render(<LatestArticles />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "articles-heading");
    });

    it("section has aria-labelledby pointing to the h2 id", () => {
      render(<LatestArticles />);
      expect(
        document.querySelector('[aria-labelledby="articles-heading"]')
      ).not.toBeNull();
    });
  });
});
