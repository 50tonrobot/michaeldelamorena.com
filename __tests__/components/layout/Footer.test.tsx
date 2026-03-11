import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site";

// Mock next/link to render a plain anchor so attribute assertions work
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    target,
    rel,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} target={target} rel={rel} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  describe("social links rendering", () => {
    it("renders the GitHub link", () => {
      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    });

    it("renders the LinkedIn link", () => {
      expect(
        screen.getByRole("link", { name: /linkedin/i })
      ).toBeInTheDocument();
    });

  });

  describe("link href values from siteConfig", () => {
    it("GitHub link points to siteConfig.github", () => {
      const link = screen.getByRole("link", { name: /github/i });
      expect(link).toHaveAttribute("href", siteConfig.github);
    });

    it("LinkedIn link points to siteConfig.linkedin", () => {
      const link = screen.getByRole("link", { name: /linkedin/i });
      expect(link).toHaveAttribute("href", siteConfig.linkedin);
    });

  });

  describe("external link security", () => {
    it("GitHub link has rel='noopener noreferrer'", () => {
      const link = screen.getByRole("link", { name: /github/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("LinkedIn link has rel='noopener noreferrer'", () => {
      const link = screen.getByRole("link", { name: /linkedin/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("GitHub link opens in a new tab", () => {
      const link = screen.getByRole("link", { name: /github/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("LinkedIn link opens in a new tab", () => {
      const link = screen.getByRole("link", { name: /linkedin/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

  });

  describe("sr-only '(opens in new tab)' text for external links", () => {
    it("GitHub link contains sr-only '(opens in new tab)' text", () => {
      const link = screen.getByRole("link", { name: /github/i });
      const srOnly = link.querySelector(".sr-only");
      expect(srOnly).toBeInTheDocument();
      expect(srOnly?.textContent).toContain("opens in new tab");
    });

    it("LinkedIn link contains sr-only '(opens in new tab)' text", () => {
      const link = screen.getByRole("link", { name: /linkedin/i });
      const srOnly = link.querySelector(".sr-only");
      expect(srOnly).toBeInTheDocument();
      expect(srOnly?.textContent).toContain("opens in new tab");
    });
  });

  describe("copyright notice", () => {
    it("displays the copyright symbol with a year", () => {
      const footer = screen.getByRole("contentinfo");
      expect(footer.textContent).toMatch(/©\s*\d{4}/);
    });

    it("displays the author name in the copyright notice", () => {
      expect(
        screen.getByText(/michael de la morena/i, { selector: "p" })
      ).toBeInTheDocument();
    });
  });

  describe("social links navigation landmark", () => {
    it("social links are inside a nav with accessible label", () => {
      const nav = screen.getByRole("navigation", { name: /social links/i });
      expect(nav).toBeInTheDocument();
    });
  });
});
