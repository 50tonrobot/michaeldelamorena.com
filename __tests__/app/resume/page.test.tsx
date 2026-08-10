import { render, screen } from "@testing-library/react";
import ResumePage from "@/app/resume/page";
import { siteConfig } from "@/lib/site";

describe("ResumePage", () => {
  beforeEach(() => {
    render(<ResumePage />);
  });

  it("renders the name as the h1", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /michael de la morena/i })
    ).toBeInTheDocument();
  });

  it("links to the resume PDF via siteConfig.resumePdf", () => {
    const link = screen.getByRole("link", { name: /résumé \(pdf\)/i });
    expect(link).toHaveAttribute("href", siteConfig.resumePdf);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("includes sr-only opens-in-new-tab text on the download link", () => {
    const link = screen.getByRole("link", { name: /résumé \(pdf\)/i });
    expect(link.querySelector(".sr-only")?.textContent).toContain(
      "opens in new tab"
    );
  });

  it("does NOT hardcode resume body content (single source of truth)", () => {
    expect(screen.queryByText(/Technical Proficiencies/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Key Achievements/i)).not.toBeInTheDocument();
  });
});
