import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-zinc-400">
          © {currentYear} Michael de la Morena
        </p>
        <nav aria-label="Social links" className="flex items-center gap-6">
          <Link
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          >
            GitHub<span className="sr-only"> (opens in new tab)</span>
          </Link>
          <Link
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          >
            LinkedIn<span className="sr-only"> (opens in new tab)</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
