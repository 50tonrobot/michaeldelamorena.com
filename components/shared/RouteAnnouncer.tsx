"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Announces route changes to screen readers via an aria-live region.
 * This compensates for Next.js App Router not including a built-in
 * route announcer (WCAG 4.1.3 / WCAG 2.4.2).
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const announcerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!announcerRef.current) return;
    // Derive the page title from the document after navigation settles.
    // A short delay lets Next.js update <title> before we read it.
    const timer = setTimeout(() => {
      const title = document.title || pathname;
      if (announcerRef.current) {
        announcerRef.current.textContent = `Navigated to ${title}`;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <p
      ref={announcerRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
