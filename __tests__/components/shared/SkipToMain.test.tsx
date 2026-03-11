import { render, screen } from "@testing-library/react";
import { SkipToMain } from "@/components/shared/SkipToMain";

describe("SkipToMain", () => {
  it("renders a link element", () => {
    render(<SkipToMain />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });

  it("has href pointing to #main-content", () => {
    render(<SkipToMain />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("has accessible text 'Skip to main content'", () => {
    render(<SkipToMain />);
    const link = screen.getByText("Skip to main content");
    expect(link).toBeInTheDocument();
  });

  it("is queryable by accessible name", () => {
    render(<SkipToMain />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
  });

  it("applies the sr-only class for visual hiding", () => {
    render(<SkipToMain />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("sr-only");
  });
});
