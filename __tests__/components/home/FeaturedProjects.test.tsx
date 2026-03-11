import { render, screen } from "@testing-library/react";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { getAllProjects } from "@/lib/content";

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

// Stub ProjectCard to keep the tree shallow and assertions focused.
jest.mock("@/components/content/ProjectCard", () => ({
  ProjectCard: ({
    project,
  }: {
    project: { slug: string; frontmatter: { title: string } };
  }) => <div data-testid="project-card">{project.frontmatter.title}</div>,
}));

const mockGetAllProjects = getAllProjects as jest.Mock;

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function buildProject(overrides: {
  slug?: string;
  title?: string;
  featured?: boolean;
} = {}) {
  const { slug = "test-project", title = "Test Project", featured = true } = overrides;
  return {
    slug,
    readingTime: "3 min read",
    frontmatter: {
      title,
      description: "A test project description.",
      date: "2025-01-01",
      tags: ["TypeScript"],
      featured,
      draft: false,
      github: "https://github.com/example/project",
      tech: ["TypeScript", "Node.js"],
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FeaturedProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when there are no featured projects", () => {
    it("returns null when getAllProjects returns an empty array", () => {
      mockGetAllProjects.mockReturnValue([]);
      const { container } = render(<FeaturedProjects />);
      expect(container.firstChild).toBeNull();
    });

    it("returns null when no projects have featured: true", () => {
      mockGetAllProjects.mockReturnValue([
        buildProject({ featured: false }),
        buildProject({ slug: "another", featured: false }),
      ]);
      const { container } = render(<FeaturedProjects />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when featured projects exist", () => {
    beforeEach(() => {
      mockGetAllProjects.mockReturnValue([
        buildProject({ slug: "proj-1", title: "Alpha Project" }),
        buildProject({ slug: "proj-2", title: "Beta Project" }),
      ]);
    });

    it("renders a project card for each featured project", () => {
      render(<FeaturedProjects />);
      const cards = screen.getAllByTestId("project-card");
      expect(cards).toHaveLength(2);
    });

    it("renders the project titles inside the cards", () => {
      render(<FeaturedProjects />);
      expect(screen.getByText("Alpha Project")).toBeInTheDocument();
      expect(screen.getByText("Beta Project")).toBeInTheDocument();
    });

    it("renders the 'All projects' link pointing to /projects", () => {
      render(<FeaturedProjects />);
      const link = screen.getByRole("link", { name: /view all projects/i });
      expect(link).toHaveAttribute("href", "/projects");
    });

    it("'All projects' link has aria-label='View all projects'", () => {
      render(<FeaturedProjects />);
      const link = screen.getByRole("link", { name: "View all projects" });
      expect(link).toHaveAttribute("aria-label", "View all projects");
    });

    it("renders no more than 4 cards even when more featured projects exist", () => {
      mockGetAllProjects.mockReturnValue([
        buildProject({ slug: "p1", title: "Project One" }),
        buildProject({ slug: "p2", title: "Project Two" }),
        buildProject({ slug: "p3", title: "Project Three" }),
        buildProject({ slug: "p4", title: "Project Four" }),
        buildProject({ slug: "p5", title: "Project Five" }),
      ]);
      render(<FeaturedProjects />);
      const cards = screen.getAllByTestId("project-card");
      expect(cards).toHaveLength(4);
    });

    it("renders the section heading 'Featured Projects'", () => {
      render(<FeaturedProjects />);
      expect(
        screen.getByRole("heading", { name: /featured projects/i })
      ).toBeInTheDocument();
    });
  });

  describe("accessible structure", () => {
    beforeEach(() => {
      mockGetAllProjects.mockReturnValue([
        buildProject({ slug: "proj-a", title: "Accessible Project" }),
      ]);
    });

    it("section is labelled by h2 with id='projects-heading'", () => {
      render(<FeaturedProjects />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "projects-heading");
    });

    it("section has aria-labelledby pointing to the h2 id", () => {
      render(<FeaturedProjects />);
      expect(
        document.querySelector('[aria-labelledby="projects-heading"]')
      ).not.toBeNull();
    });
  });
});
