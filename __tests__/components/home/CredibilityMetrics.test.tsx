import { render, screen } from "@testing-library/react";
import { CredibilityMetrics } from "@/components/home/CredibilityMetrics";

describe("CredibilityMetrics", () => {
  beforeEach(() => {
    render(<CredibilityMetrics />);
  });

  describe("metric count", () => {
    it("renders exactly 4 metric items", () => {
      // Each metric is a <div> inside the <dl>; count via dt elements
      const terms = document.querySelectorAll("dt");
      expect(terms).toHaveLength(4);
    });
  });

  describe("dl / dt / dd semantics", () => {
    it("uses a <dl> element as the container", () => {
      const dl = document.querySelector("dl");
      expect(dl).not.toBeNull();
    });

    it("each metric has a <dt> label", () => {
      const terms = document.querySelectorAll("dt");
      terms.forEach((dt) => {
        expect(dt.textContent?.trim().length).toBeGreaterThan(0);
      });
    });

    it("each metric has a <dd> value", () => {
      const details = document.querySelectorAll("dd");
      expect(details).toHaveLength(4);
      details.forEach((dd) => {
        expect(dd.textContent?.trim().length).toBeGreaterThan(0);
      });
    });

    it("renders the same number of dt and dd elements", () => {
      const terms = document.querySelectorAll("dt");
      const details = document.querySelectorAll("dd");
      expect(terms.length).toBe(details.length);
    });
  });

  describe("specific metric values", () => {
    it("renders the '62%' AWS cost reduction metric", () => {
      expect(screen.getByText("62%")).toBeInTheDocument();
    });

    it("renders the '15 min' disaster recovery metric", () => {
      expect(screen.getByText("15 min")).toBeInTheDocument();
    });

    it("renders the '20+' years software engineering metric", () => {
      expect(screen.getByText("20+")).toBeInTheDocument();
    });

    it("renders the '$527K' AWS savings metric", () => {
      expect(screen.getByText("$527K")).toBeInTheDocument();
    });
  });

  describe("metric labels", () => {
    it("renders the AWS cost reduction label", () => {
      expect(screen.getByText("AWS cost reduction achieved")).toBeInTheDocument();
    });

    it("renders the disaster recovery label", () => {
      expect(screen.getByText("Disaster recovery RTA achieved")).toBeInTheDocument();
    });
  });

  describe("accessible structure", () => {
    it("section is labelled by an h2 with id='metrics-heading'", () => {
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "metrics-heading");
    });

    it("section has aria-labelledby pointing to the h2 id", () => {
      expect(
        document.querySelector('[aria-labelledby="metrics-heading"]')
      ).not.toBeNull();
    });
  });
});
