import type { Plugin } from 'unified';
import type { Root, Code } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that converts fenced mermaid code blocks into
 * <MermaidDiagram chart="..." /> MDX JSX elements before rehype-pretty-code
 * processes them. This avoids template-literal prop serialization issues with
 * next-mdx-remote RSC and keeps mermaid blocks out of the syntax highlighter.
 */
const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === undefined) return;

      const mermaidNode: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: 'MermaidDiagram',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'chart',
            value: node.value,
          },
        ],
        children: [],
      };

      parent.children.splice(index, 1, mermaidNode as never);
    });
  };
};

export default remarkMermaid;
