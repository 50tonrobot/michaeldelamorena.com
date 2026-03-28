'use client';

import { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!chart) return;

      const mermaid = (await import('mermaid')).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          background: '#09090b',
          primaryColor: '#1e3a5f',
          primaryTextColor: '#f4f4f5',
          primaryBorderColor: '#38bdf8',
          lineColor: '#71717a',
          secondaryColor: '#18181b',
          tertiaryColor: '#18181b',
          edgeLabelBackground: '#09090b',
          clusterBkg: '#18181b',
          clusterBorder: '#3f3f46',
          titleColor: '#f4f4f5',
          nodeTextColor: '#f4f4f5',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: '14px',
        },
      });

      if (!ref.current || cancelled) return;

      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      const { svg } = await mermaid.render(id, chart.trim());

      if (!ref.current || cancelled) return;
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'text/html');
      const svgEl = doc.querySelector('svg');
      if (svgEl) ref.current.replaceChildren(svgEl);
    }

    render().catch(console.error);
    return () => { cancelled = true; };
  }, [chart]);

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-6"
      aria-label="Architecture diagram"
    />
  );
}
