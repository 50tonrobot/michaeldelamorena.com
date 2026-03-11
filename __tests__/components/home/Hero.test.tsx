import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/Hero";
import { siteConfig } from "@/lib/site";

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

// Render next/image as a plain img so src and alt assertions work in jsdom.
jest.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }
  ) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("Hero", () => {
  beforeEach(() => {
    render(<Hero />);
  });

  describe("site identity", () => {
    it("renders the site name from siteConfig", () => {
      expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
    });

    it("renders the tagline from siteConfig", () => {
      expect(screen.getByText(siteConfig.tagline)).toBeInTheDocument();
    });
  });

  describe("positioning statement", () => {
    it("renders the positioning statement text", () => {
      expect(
        screen.getByText(/I design and operate resilient distributed systems/i)
      ).toBeInTheDocument();
    });
  });

  describe("hero image", () => {
    it("renders an image with a non-empty alt attribute", () => {
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
    });

    it("renders the image with src from siteConfig.heroImage", () => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", siteConfig.heroImage);
    });
  });

  describe("navigation links", () => {
    it("renders a View Resume link pointing to siteConfig.resumePdf", () => {
      const link = screen.getByRole("link", { name: /view resume/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", siteConfig.resumePdf);
    });

    it("renders a GitHub link pointing to the siteConfig github URL", () => {
      const link = screen.getByRole("link", { name: /github/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", siteConfig.github);
    });

    it("renders a LinkedIn link pointing to the siteConfig linkedin URL", () => {
      const link = screen.getByRole("link", { name: /linkedin/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", siteConfig.linkedin);
    });

    it("renders a Contact link pointing to /contact", () => {
      const link = screen.getByRole("link", { name: /contact/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  describe("external link security attributes", () => {
    it("View Resume link has target='_blank'", () => {
      const link = screen.getByRole("link", { name: /view resume/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("View Resume link has rel='noopener noreferrer'", () => {
      const link = screen.getByRole("link", { name: /view resume/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("GitHub link has target='_blank'", () => {
      const link = screen.getByRole("link", { name: /github/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("GitHub link has rel='noopener noreferrer'", () => {
      const link = screen.getByRole("link", { name: /github/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("LinkedIn link has target='_blank'", () => {
      const link = screen.getByRole("link", { name: /linkedin/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("LinkedIn link has rel='noopener noreferrer'", () => {
      const link = screen.getByRole("link", { name: /linkedin/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("sr-only '(opens in new tab)' text for external links", () => {
    it("View Resume link contains sr-only '(opens in new tab)' text", () => {
      const link = screen.getByRole("link", { name: /view resume/i });
      const srOnly = link.querySelector(".sr-only");
      expect(srOnly).toBeInTheDocument();
      expect(srOnly?.textContent).toContain("opens in new tab");
    });

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

  describe("accessible structure", () => {
    it("nav has aria-label='Profile links'", () => {
      const nav = screen.getByRole("navigation", { name: "Profile links" });
      expect(nav).toBeInTheDocument();
    });

    it("section is labelled by the h1 heading", () => {
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveAttribute("id", "hero-heading");
    });
  });
});
