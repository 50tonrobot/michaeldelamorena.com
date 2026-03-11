"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-50 hover:text-sky-400 transition-colors"
        >
          Michael de la Morena
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors hover:text-sky-400 ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-sky-400"
                  : "text-zinc-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-zinc-50 transition-colors"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div id="mobile-nav">
          <nav
            aria-label="Mobile navigation"
            className="border-t border-zinc-800 bg-zinc-950 px-4 pb-4 pt-2"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block py-2 text-sm transition-colors hover:text-sky-400 ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-sky-400"
                    : "text-zinc-400"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
