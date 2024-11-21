import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#ffffff',
    lineColor: '#ffffff',
    secondaryColor: '#006100',
    tertiaryColor: '#fff',
  },
  flowchart: {
    curve: 'linear',
    padding: 10,
    nodeSpacing: 50,
    rankSpacing: 50,
    htmlLabels: true,
    useMaxWidth: true,
  },
  er: {
    useMaxWidth: true,
  }
});

function MermaidRenderer({ chart }) {
  const mermaidRef = useRef(null);

  useEffect(() => {
    let timeoutId;

    const renderDiagram = async () => {
      if (!chart || !mermaidRef.current) return;

      try {
        mermaidRef.current.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'mermaid-container';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        mermaidRef.current.appendChild(container);

        timeoutId = setTimeout(async () => {
          try {
            const { svg } = await mermaid.render('mermaid-diagram', chart);
            container.innerHTML = svg;

            const svgElement = container.querySelector('svg');
            if (svgElement) {
              svgElement.style.maxWidth = '100%';
              svgElement.style.height = 'auto';
              svgElement.style.maxHeight = '100%';
              svgElement.classList.add('mermaid-svg');
            }
          } catch (error) {
            console.error('Mermaid rendering error:', error);
            container.innerHTML = `
              <div class="text-red-400 text-center">
                <p>Failed to render diagram</p>
                <p class="text-sm opacity-75">Please try adjusting the flowchart description</p>
              </div>
            `;
          }
        }, 100);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    renderDiagram();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [chart]);

  return (
    <div 
      ref={mermaidRef} 
      className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg p-4"
      style={{ 
        minHeight: '400px',
        maxHeight: '600px',
      }}
    />
  );
}

export default MermaidRenderer; 