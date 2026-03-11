import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="py-16 sm:py-24 border-b border-zinc-800"
    >
      <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* Text column */}
        <div className="flex-1 min-w-0">
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl"
          >
            {siteConfig.name}
          </h1>
          <p className="mt-3 text-lg text-sky-400 font-medium">
            {siteConfig.tagline}
          </p>
          <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
            I design and operate resilient distributed systems. My work focuses
            on Kubernetes platform engineering, observability, and the emerging
            role of AI in infrastructure automation.
          </p>
          <nav aria-label="Profile links" className="mt-8 flex flex-wrap gap-4">
            <Link
              href={siteConfig.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-sky-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-sky-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              View Resume
              <span className="sr-only">(opens in new tab)</span>
            </Link>
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 transition-colors"
            >
              GitHub
              <span className="sr-only">(opens in new tab)</span>
            </Link>
            <Link
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 transition-colors"
            >
              LinkedIn
              <span className="sr-only">(opens in new tab)</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Image column */}
        <div className="flex justify-center md:justify-end md:shrink-0">
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-zinc-950 w-56 sm:w-64 md:w-72">
            <Image
              src={siteConfig.heroImage}
              alt="Michael de la Morena — Platform Architect action figure with accessories: a laptop, Kubernetes dashboard, and Raspberry Pi. Secret Power: Turns chaos into systems."
              width={400}
              height={600}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
