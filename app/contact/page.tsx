import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Michael de la Morena.",
};

const contactLinks = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/michael-delamorena/",
    href: siteConfig.linkedin,
    description: "Professional profile, experience, and recommendations.",
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/50tonrobot",
    href: siteConfig.github,
    description: "Open source work, homelab configurations, and experiments.",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl">
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <h1 className="text-3xl font-bold text-zinc-50">Contact</h1>
        <p className="mt-3 text-zinc-400 leading-relaxed">
          Open to staff and principal engineering roles in platform engineering,
          site reliability, and cloud infrastructure. Also happy to connect on
          technical topics, speaking opportunities, or collaboration.
        </p>
      </header>

      <section aria-labelledby="contact-links-heading">
        <h2 id="contact-links-heading" className="sr-only">Contact options</h2>
        <ul role="list" className="space-y-4">
          {contactLinks.map(({ label, value, href, description, external }) => (
            <li key={label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  {label}
                </span>
                <Link
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium"
                  aria-label={`${label}: ${value}`}
                >
                  {value}
                </Link>
              </div>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
