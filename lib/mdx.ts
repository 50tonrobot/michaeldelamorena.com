import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

type CompileMdxOptions = {
  source: string;
  components?: MDXRemoteProps["components"];
};

export async function compileMdxContent({
  source,
  components,
}: CompileMdxOptions): Promise<ReturnType<typeof compileMDX>> {
  return compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor"],
                // ariaLabel is set per-heading by the plugin using the heading
                // text; we provide a prefix so screen readers announce the
                // purpose ("Link to section: Heading Text") rather than just
                // repeating the heading text as a bare link.
                ariaLabel: "Link to section",
              },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark",
                light: "github-light",
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });
}
