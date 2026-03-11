import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/content/ProjectCard";
import type { Project } from "@/types/content";

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

function buildMockProject(overrides: Partial<Project> = {}): Project {
  return {
    slug: "test-project",
    frontmatter: {
      title: "Test Project Title",
      description: "A short description of the test project.",
      date: "2025-01-01",
      tags: ["Kubernetes", "Go"],
      featured: false,
      order: 1,
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ProjectCard", () => {
  describe("title link", () => {
    it("renders the project title as a link", () => {
      render(<ProjectCard project={buildMockProject()} />);
      const link = screen.getByRole("link", { name: /test project title/i });
      expect(link).toBeInTheDocument();
    });

    it("links to /projects/[slug]", () => {
      render(<ProjectCard project={buildMockProject({ slug: "my-project" })} />);
      const link = screen.getByRole("link", { name: /test project title/i });
      expect(link).toHaveAttribute("href", "/projects/my-project");
    });

    it("uses the frontmatter title as the visible link text", () => {
      const project = buildMockProject();
      project.frontmatter.title = "k3s Home Lab Orchestrator";
      render(<ProjectCard project={project} />);
      expect(
        screen.getByRole("link", { name: /k3s home lab orchestrator/i })
      ).toBeInTheDocument();
    });
  });

  describe("description", () => {
    it("renders the project description", () => {
      render(<ProjectCard project={buildMockProject()} />);
      expect(
        screen.getByText("A short description of the test project.")
      ).toBeInTheDocument();
    });

    it("renders a different description when the prop changes", () => {
      const project = buildMockProject();
      project.frontmatter.description = "An alternative description.";
      render(<ProjectCard project={project} />);
      expect(screen.getByText("An alternative description.")).toBeInTheDocument();
    });
  });

  describe("tags", () => {
    it("renders tags via TagList when tags are present", () => {
      render(<ProjectCard project={buildMockProject()} />);
      expect(screen.getByRole("list", { name: /tags/i })).toBeInTheDocument();
      expect(screen.getByText("Kubernetes")).toBeInTheDocument();
      expect(screen.getByText("Go")).toBeInTheDocument();
    });

    it("does not render a tag list when tags array is empty", () => {
      const project = buildMockProject();
      project.frontmatter.tags = [];
      render(<ProjectCard project={project} />);
      expect(
        screen.queryByRole("list", { name: /tags/i })
      ).not.toBeInTheDocument();
    });

    it("renders all tags when more than two are supplied", () => {
      const project = buildMockProject();
      project.frontmatter.tags = ["TypeScript", "React", "Next.js", "Tailwind"];
      render(<ProjectCard project={project} />);
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
      expect(screen.getByText("Tailwind")).toBeInTheDocument();
    });
  });

  describe("accessible structure", () => {
    it("wraps the card in an <article> element", () => {
      render(<ProjectCard project={buildMockProject()} />);
      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("title link text matches the frontmatter title (accessible name)", () => {
      const project = buildMockProject();
      project.frontmatter.title = "Personal Engineering Website";
      render(<ProjectCard project={project} />);
      const link = screen.getByRole("link", {
        name: "Personal Engineering Website",
      });
      expect(link).toBeInTheDocument();
    });
  });
});
