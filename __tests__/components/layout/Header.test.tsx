import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock next/link to render a plain anchor so href assertions work
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

// Mock lucide-react icons so they render predictably
jest.mock("lucide-react", () => ({
  Menu: () => <svg data-testid="icon-menu" />,
  X: () => <svg data-testid="icon-x" />,
}));

import { usePathname } from "next/navigation";

const mockUsePathname = usePathname as jest.Mock;

function renderHeader(pathname = "/") {
  mockUsePathname.mockReturnValue(pathname);
  return render(<Header />);
}

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("site name link", () => {
    it("renders the site name as a link to /", () => {
      renderHeader();
      const siteNameLink = screen.getByRole("link", {
        name: /michael de la morena/i,
      });
      expect(siteNameLink).toBeInTheDocument();
      expect(siteNameLink).toHaveAttribute("href", "/");
    });
  });

  describe("desktop navigation", () => {
    const expectedLinks = [
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "/contact" },
    ];

    it("renders all 5 nav links", () => {
      renderHeader();
      const desktopNav = screen.getByRole("navigation", {
        name: /main navigation/i,
      });
      const links = desktopNav.querySelectorAll("a");
      expect(links).toHaveLength(5);
    });

    it.each(expectedLinks)(
      "renders '$label' link with correct href '$href'",
      ({ label, href }) => {
        renderHeader();
        const desktopNav = screen.getByRole("navigation", {
          name: /main navigation/i,
        });
        const link = Array.from(desktopNav.querySelectorAll("a")).find(
          (a) => a.textContent === label
        );
        expect(link).toBeDefined();
        expect(link).toHaveAttribute("href", href);
      }
    );
  });

  describe("mobile menu", () => {
    it("mobile nav is hidden by default", () => {
      renderHeader();
      const mobileNav = screen.queryByRole("navigation", {
        name: /mobile navigation/i,
      });
      expect(mobileNav).not.toBeInTheDocument();
    });

    it("hamburger button has aria-expanded=false by default", () => {
      renderHeader();
      const hamburger = screen.getByRole("button", {
        name: /open navigation menu/i,
      });
      expect(hamburger).toHaveAttribute("aria-expanded", "false");
    });

    it("shows menu icon when closed", () => {
      renderHeader();
      expect(screen.getByTestId("icon-menu")).toBeInTheDocument();
    });

    it("clicking hamburger opens the mobile nav", () => {
      renderHeader();
      const hamburger = screen.getByRole("button");
      fireEvent.click(hamburger);

      const mobileNav = screen.getByRole("navigation", {
        name: /mobile navigation/i,
      });
      expect(mobileNav).toBeInTheDocument();
    });

    it("aria-expanded becomes true after hamburger click", () => {
      renderHeader();
      const hamburger = screen.getByRole("button");
      fireEvent.click(hamburger);

      expect(hamburger).toHaveAttribute("aria-expanded", "true");
    });

    it("shows X icon and 'close' label after opening menu", () => {
      renderHeader();
      const hamburger = screen.getByRole("button");
      fireEvent.click(hamburger);

      expect(screen.getByTestId("icon-x")).toBeInTheDocument();
      expect(hamburger).toHaveAttribute("aria-label", "Close navigation menu");
    });

    it("clicking a mobile nav link closes the menu", () => {
      renderHeader("/");
      const hamburger = screen.getByRole("button");
      fireEvent.click(hamburger);

      // Mobile nav should now be visible
      const mobileNav = screen.getByRole("navigation", {
        name: /mobile navigation/i,
      });
      expect(mobileNav).toBeInTheDocument();

      // Click the first mobile nav link
      const firstLink = mobileNav.querySelector("a") as HTMLAnchorElement;
      fireEvent.click(firstLink);

      // Mobile nav should now be closed
      expect(
        screen.queryByRole("navigation", { name: /mobile navigation/i })
      ).not.toBeInTheDocument();
    });

    it("pressing Escape closes the mobile menu", () => {
      renderHeader();
      const hamburger = screen.getByRole("button");
      fireEvent.click(hamburger);

      expect(
        screen.getByRole("navigation", { name: /mobile navigation/i })
      ).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(
        screen.queryByRole("navigation", { name: /mobile navigation/i })
      ).not.toBeInTheDocument();
    });

    it("aria-controls points to mobile-nav id", () => {
      renderHeader();
      const hamburger = screen.getByRole("button");
      expect(hamburger).toHaveAttribute("aria-controls", "mobile-nav");
    });
  });

  describe("active link styling", () => {
    it("applies active class to link matching current pathname exactly", () => {
      renderHeader("/blog");
      const desktopNav = screen.getByRole("navigation", {
        name: /main navigation/i,
      });
      const blogLink = Array.from(desktopNav.querySelectorAll("a")).find(
        (a) => a.textContent === "Blog"
      ) as HTMLAnchorElement;

      expect(blogLink.className).toContain("text-sky-400");
    });

    it("applies active class to link when pathname starts with that href", () => {
      renderHeader("/blog/my-post");
      const desktopNav = screen.getByRole("navigation", {
        name: /main navigation/i,
      });
      const blogLink = Array.from(desktopNav.querySelectorAll("a")).find(
        (a) => a.textContent === "Blog"
      ) as HTMLAnchorElement;

      expect(blogLink.className).toContain("text-sky-400");
    });

    it("applies inactive class to non-matching links", () => {
      renderHeader("/blog");
      const desktopNav = screen.getByRole("navigation", {
        name: /main navigation/i,
      });
      const aboutLink = Array.from(desktopNav.querySelectorAll("a")).find(
        (a) => a.textContent === "About"
      ) as HTMLAnchorElement;

      // Non-active links carry text-zinc-400 (not the bare text-sky-400 active colour)
      expect(aboutLink.className).toContain("text-zinc-400");
      // The active colour should NOT appear as a standalone class token
      // (hover:text-sky-400 is present on all links; we check for the bare token)
      const classTokens = aboutLink.className.split(" ");
      expect(classTokens).not.toContain("text-sky-400");
    });
  });
});
