import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Michael de la Morena — Engineering Manager specializing in cloud platform architecture, Kubernetes governance, and large-scale infrastructure modernization.",
};

export default function ResumePage(): React.ReactElement {
  return (
    <div className="max-w-3xl">
      <header className="mb-8 border-b border-zinc-800 pb-8">
        <h1 className="text-3xl font-bold text-zinc-50">Michael de la Morena</h1>
        <p className="mt-2 text-lg text-sky-400 font-medium">
          Engineering Manager · Cloud Infrastructure &amp; Platform Engineering
        </p>
      </header>

      <p className="text-zinc-400 leading-relaxed">
        Engineering leader specializing in cloud platform architecture, Kubernetes
        governance, and large-scale infrastructure modernization. My full,
        up-to-date resume is available as a PDF.
      </p>

      <a
        href={siteConfig.resumePdf}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center rounded-md bg-sky-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-sky-300 transition-colors"
      >
        View / Download résumé (PDF)
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    </div>
  );
}
