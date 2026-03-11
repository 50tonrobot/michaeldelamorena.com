"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  // Move focus into the dialog when it becomes visible (WCAG 2.4.3)
  useEffect(() => {
    if (visible) {
      acceptRef.current?.focus();
    }
  }, [visible]);

  // Pad the bottom of the page so the fixed banner never obscures scrolled content.
  // We measure the rendered banner height and apply it as padding-bottom on <body>,
  // then clean up when the banner is dismissed or the component unmounts.
  useEffect(() => {
    if (!visible) return;

    function applyPadding() {
      const h = bannerRef.current?.offsetHeight ?? 0;
      document.body.style.paddingBottom = `${h}px`;
    }

    // Apply once after layout and again on resize (banner re-wraps at narrow widths)
    applyPadding();
    const ro = new ResizeObserver(applyPadding);
    if (bannerRef.current) ro.observe(bannerRef.current);

    return () => {
      ro.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  function handleAccept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
    if (typeof window !== "undefined" && "gtag" in window) {
      type GtagWindow = Window & { gtag: (...args: unknown[]) => void };
      (window as unknown as GtagWindow).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }

  function handleDecline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-900 px-4 py-4 shadow-2xl sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p id="cookie-banner-title" className="text-sm font-semibold text-zinc-50">
            Cookie preferences
          </p>
          <p id="cookie-banner-desc" className="mt-1 text-sm text-zinc-400">
            This site uses Google Analytics to understand how visitors interact
            with the content. No personal data is sold or shared.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-50"
          >
            Decline
          </Button>
          <Button
            ref={acceptRef}
            size="sm"
            onClick={handleAccept}
            className="bg-sky-400 text-zinc-950 hover:bg-sky-300"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
