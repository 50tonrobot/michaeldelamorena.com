import { render, screen } from "@testing-library/react";
import { TagList } from "@/components/content/TagList";

// Badge uses @base-ui/react internals — render it as a plain span so tests
// stay focused on TagList behaviour rather than Badge implementation details.
jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
}));

describe("TagList", () => {
  describe("structure and accessibility", () => {
    it("renders a list with role='list'", () => {
      render(<TagList tags={["TypeScript"]} />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("has aria-label='Tags'", () => {
      render(<TagList tags={["TypeScript"]} />);
      expect(screen.getByRole("list")).toHaveAttribute("aria-label", "Tags");
    });
  });

  describe("tag rendering", () => {
    it("renders each tag as a Badge inside a list item", () => {
      render(<TagList tags={["TypeScript", "React", "Next.js"]} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
    });

    it("renders the correct number of list items", () => {
      render(<TagList tags={["Go", "Rust", "C++"]} />);
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(3);
    });

    it("renders a single tag without error", () => {
      render(<TagList tags={["Kubernetes"]} />);
      expect(screen.getByText("Kubernetes")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
  });

  describe("empty tags array", () => {
    it("renders an empty ul without crashing when given an empty array", () => {
      render(<TagList tags={[]} />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });
  });

  describe("className prop", () => {
    it("applies a custom className to the ul element", () => {
      render(<TagList tags={["tag"]} className="custom-class" />);
      const list = screen.getByRole("list");
      expect(list.className).toContain("custom-class");
    });

    it("still applies base flex classes alongside the custom className", () => {
      render(<TagList tags={["tag"]} className="my-class" />);
      const list = screen.getByRole("list");
      expect(list.className).toContain("flex");
      expect(list.className).toContain("my-class");
    });

    it("does not throw when className is omitted", () => {
      expect(() => render(<TagList tags={["tag"]} />)).not.toThrow();
    });
  });
});
