import { compileMdxContent } from "@/lib/mdx";
import Link from "next/link";
import type { ReactNode } from "react";
import { MermaidDiagram } from "@/components/content/MermaidDiagram";

interface MDXContentProps {
  source: string;
}

const mdxComponents = {
  MermaidDiagram,
  // MDX `# Heading` (h1) is intentionally remapped to h2 to prevent duplicate
  // <h1> elements — each page already has exactly one <h1> in its header.
  h1: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-10 mb-4 text-2xl font-semibold text-zinc-50 border-b border-zinc-800 pb-2">
      {children}
    </h2>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-10 mb-4 text-2xl font-semibold text-zinc-50 border-b border-zinc-800 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">{children}</h3>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="mt-6 mb-2 text-lg font-semibold text-zinc-50">{children}</h4>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-4 text-zinc-300 leading-relaxed">{children}</p>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string;
    children?: ReactNode;
  }) => {
    const isExternal = href?.startsWith("http");
    return isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors"
      >
        {children}
      </a>
    ) : (
      <Link
        href={href ?? "#"}
        className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-zinc-300 [&_li]:leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-zinc-300 [&_li]:leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="text-zinc-300">{children}</li>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-6 border-l-4 border-sky-400 pl-4 italic text-zinc-400">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-zinc-800" />,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic text-zinc-300">{children}</em>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-sky-300">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <div className="my-6">{children}</div>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="my-6 rounded-lg border border-zinc-800 max-w-full"
    />
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-800 text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => (
    <thead className="bg-zinc-900">{children}</thead>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="px-4 py-2 text-left font-semibold text-zinc-300">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="px-4 py-2 text-zinc-400 border-t border-zinc-800">
      {children}
    </td>
  ),
};

export async function MDXContent({ source }: MDXContentProps) {
  const { content } = await compileMdxContent({
    source,
    components: mdxComponents,
  });

  return <div className="max-w-2xl">{content}</div>;
}
