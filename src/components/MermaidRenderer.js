import { memo, useEffect, useRef, useMemo } from 'react';
import mermaid from 'mermaid';

const MermaidRenderer = memo(({ chart, type }) => {
  const elementRef = useRef(null);

  // Memoize configuration
  const mermaidConfig = useMemo(() => ({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    [type]: {
      diagramPadding: 8,
      useMaxWidth: true,
      htmlLabels: true
    }
  }), [type]);

  // Progressive loading with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            renderDiagram();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [chart]);

  const renderDiagram = async () => {
    if (!elementRef.current || !chart) return;

    try {
      mermaid.initialize(mermaidConfig);
      const id = `mermaid-${Date.now()}`;
      elementRef.current.innerHTML = '';
      const { svg } = await mermaid.render(id, chart);
      elementRef.current.innerHTML = svg;
    } catch (error) {
      console.error('Mermaid rendering failed:', error);
      elementRef.current.innerHTML = `
        <div class="text-red-500 p-4">
          Failed to render diagram: ${error.message}
        </div>`;
    }
  };

  return (
    <div 
      ref={elementRef}
      className="mermaid-viewer w-full overflow-auto bg-gray-900 rounded-lg p-4"
    />
  );
});

export default MermaidRenderer;