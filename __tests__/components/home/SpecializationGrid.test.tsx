import { render, screen } from "@testing-library/react";
import { SpecializationGrid } from "@/components/home/SpecializationGrid";

describe("SpecializationGrid", () => {
  beforeEach(() => {
    render(<SpecializationGrid />);
  });

  describe("card count", () => {
    it("renders exactly 4 specialization cards", () => {
      // Each card is an <li> inside the role="list" ul
      const list = screen.getByRole("list");
      const items = list.querySelectorAll("li");
      expect(items).toHaveLength(4);
    });
  });

  describe("card content", () => {
    it("each card has a visible title", () => {
      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings).toHaveLength(4);
      headings.forEach((heading) => {
        expect(heading.textContent).toBeTruthy();
      });
    });

    it("each card has a non-empty description paragraph", () => {
      // Descriptions are <p> elements inside each <li>
      const list = screen.getByRole("list");
      const paragraphs = list.querySelectorAll("li p");
      expect(paragraphs).toHaveLength(4);
      paragraphs.forEach((p) => {
        expect(p.textContent?.trim().length).toBeGreaterThan(0);
      });
    });

    it("renders the Kubernetes Platform Engineering card", () => {
      expect(
        screen.getByText("Kubernetes Platform Engineering")
      ).toBeInTheDocument();
    });

    it("renders the Observability & Reliability Engineering card", () => {
      expect(
        screen.getByText("Observability & Reliability Engineering")
      ).toBeInTheDocument();
    });

    it("renders the Cloud Architecture & Cost Optimization card", () => {
      expect(
        screen.getByText("Cloud Architecture & Cost Optimization")
      ).toBeInTheDocument();
    });

    it("renders the AI-Assisted Infrastructure Automation card", () => {
      expect(
        screen.getByText("AI-Assisted Infrastructure Automation")
      ).toBeInTheDocument();
    });
  });

  describe("accessible structure", () => {
    it("list has role='list'", () => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("section is labelled by an h2 with id='specializations-heading'", () => {
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "specializations-heading");
    });

    it("section has aria-labelledby pointing to the h2 id", () => {
      // The section wraps everything — check it carries aria-labelledby
      const heading = screen.getByRole("heading", { level: 2, name: /core specializations/i });
      expect(heading).toHaveAttribute("id", "specializations-heading");
      // Confirm the region is discoverable by its label
      expect(
        document.querySelector('[aria-labelledby="specializations-heading"]')
      ).not.toBeNull();
    });
  });
});
