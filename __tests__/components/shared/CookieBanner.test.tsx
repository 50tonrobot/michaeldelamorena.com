import { render, screen, fireEvent, act } from "@testing-library/react";
import { CookieBanner } from "@/components/shared/CookieBanner";

// Mock @base-ui/react/button so ButtonPrimitive renders a real <button>
jest.mock("@base-ui/react/button", () => ({
  Button: ({
    children,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

// Provide a localStorage mock backed by a plain object
function setupLocalStorageMock(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };

  const localStorageMock = {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((k) => delete store[k]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
  };

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
}

describe("CookieBanner", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("visibility based on localStorage state", () => {
    it("does NOT render when cookie_consent is already set in localStorage", () => {
      setupLocalStorageMock({ cookie_consent: "accepted" });
      render(<CookieBanner />);
      expect(
        screen.queryByRole("dialog", { name: /cookie preferences/i })
      ).not.toBeInTheDocument();
    });

    it("does NOT render when cookie_consent is 'declined'", () => {
      setupLocalStorageMock({ cookie_consent: "declined" });
      render(<CookieBanner />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders when no consent value is stored", () => {
      setupLocalStorageMock({});
      render(<CookieBanner />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    beforeEach(() => {
      setupLocalStorageMock({});
      render(<CookieBanner />);
    });

    it("has role='dialog'", () => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-labelledby referencing the title element", () => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "cookie-banner-title");
    });

    it("has aria-describedby referencing the description element", () => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute(
        "aria-describedby",
        "cookie-banner-desc"
      );
    });

    it("the title element has the correct id", () => {
      const title = document.getElementById("cookie-banner-title");
      expect(title).not.toBeNull();
      expect(title?.textContent).toMatch(/cookie preferences/i);
    });
  });

  describe("Accept button", () => {
    it("sets localStorage cookie_consent to 'accepted'", () => {
      const storage = setupLocalStorageMock({});
      render(<CookieBanner />);

      fireEvent.click(screen.getByRole("button", { name: /accept/i }));

      expect(storage.setItem).toHaveBeenCalledWith(
        "cookie_consent",
        "accepted"
      );
    });

    it("hides the banner after accepting", () => {
      setupLocalStorageMock({});
      render(<CookieBanner />);

      fireEvent.click(screen.getByRole("button", { name: /accept/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Decline button", () => {
    it("sets localStorage cookie_consent to 'declined'", () => {
      const storage = setupLocalStorageMock({});
      render(<CookieBanner />);

      fireEvent.click(screen.getByRole("button", { name: /decline/i }));

      expect(storage.setItem).toHaveBeenCalledWith(
        "cookie_consent",
        "declined"
      );
    });

    it("hides the banner after declining", () => {
      setupLocalStorageMock({});
      render(<CookieBanner />);

      fireEvent.click(screen.getByRole("button", { name: /decline/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("gtag integration on accept", () => {
    it("calls window.gtag with consent update when accepting", () => {
      setupLocalStorageMock({});
      const mockGtag = jest.fn();
      Object.defineProperty(window, "gtag", {
        value: mockGtag,
        writable: true,
        configurable: true,
      });

      render(<CookieBanner />);
      fireEvent.click(screen.getByRole("button", { name: /accept/i }));

      expect(mockGtag).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "granted",
      });
    });

    it("does NOT throw when gtag is not on window when accepting", () => {
      setupLocalStorageMock({});
      // Ensure gtag is absent
      const win = window as unknown as Record<string, unknown>;
      delete win.gtag;

      render(<CookieBanner />);
      expect(() => {
        fireEvent.click(screen.getByRole("button", { name: /accept/i }));
      }).not.toThrow();
    });
  });
});
