import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import { ClipboardIcon, ClipboardDocumentCheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

import { generateFlowchart } from './services/gemini';
import NeubrutDropdown from './components/NeubrutDropdown';
const MermaidRenderer = lazy(() => import('./components/MermaidRenderer'));


const DIAGRAM_TYPES = {
  FLOWCHART: 'flowchart',
  SEQUENCE: 'sequence',
  CLASS: 'class',
  ERD: 'erd',
  STATE: 'stateDiagram',
  GANTT: 'gantt',
  PIE: 'pie',
  JOURNEY: 'journey',
  GIT: 'gitGraph',
  C4: 'c4',
};

const diagramOptions = [
  { value: 'flowchart', label: 'Flowchart' },
  { value: 'sequence', label: 'Sequence Diagram' },
  { value: 'class', label: 'Class Diagram' },
  { value: 'erd', label: 'ERD' },
  { value: 'state', label: 'State Diagram' },
  { value: 'gantt', label: 'Gantt Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'journey', label: 'User Journey' },
  { value: 'git', label: 'Git Graph' },
  { value: 'c4', label: 'C4 Diagram' }
];

function App() {
  const [description, setDescription] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [diagramType, setDiagramType] = useState(DIAGRAM_TYPES.FLOWCHART);

  const placeholderText = useMemo(() => {
    const placeholders = {
      [DIAGRAM_TYPES.FLOWCHART]: "Describe your flowchart...",
      [DIAGRAM_TYPES.SEQUENCE]: "Describe the sequence of interactions...",
      [DIAGRAM_TYPES.CLASS]: "Describe your class structure...",
      // ...add more placeholders
    };
    return placeholders[diagramType] || "Describe your diagram...";
  }, [diagramType]);

  // prevents excess api calls - debounce
  const debouncedGenerate = useCallback(
    debounce(async (text, type) => {
      setIsLoading(true);
      setError(null);
      try {
        const code = await generateFlowchart(text, type);
        setMermaidCode(code);
      } catch (err) {
        setError('Failed to generate diagram. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const buttonDisabled = useMemo(() => {
    return isLoading || !description.trim();
  }, [isLoading, description]);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const code = await generateFlowchart(description, diagramType);
      setMermaidCode(code);
    } catch (err) {
      setError(`Failed to generate ${diagramType} diagram. Please provide more detailed description.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [description, diagramType]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [mermaidCode]);

  const handleDownload = useCallback(() => {
    try {
      // Get the SVG element
      const svgElement = document.querySelector('.mermaid-viewer svg');
      if (!svgElement) {
        console.error('SVG element not found');
        return;
      }

      // Create a blob from the SVG
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flowchart.svg';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFDEDE] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#93CAED] rounded-full -translate-y-1/2 translate-x-1/2 border-8 border-black" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB6B6] rounded-full translate-y-1/2 -translate-x-1/2 border-8 border-black" />

      {/* Navbar */}
      <nav className="border-b-8 border-black bg-white relative z-10">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-[#93CAED] border-4 border-black rounded-xl rotate-12" />
              <h1 className="text-4xl font-black bg-gradient-to-r from-[#93CAED] to-[#FFB6B6] text-transparent bg-clip-text">
                Flow.AI
              </h1>
            </motion.div>
            
            <div className="flex gap-8">
              {['About', 'Docs', 'GitHub'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="relative font-bold text-xl group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 bg-[#93CAED] -rotate-2 scale-0 group-hover:scale-100 transition-transform origin-left" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-16 relative z-10">
        <motion.div 
          className="max-w-6xl mx-auto space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white border-8 border-black rounded-2xl p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-transform">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <span className="w-8 h-8 bg-[#FFB6B6] border-4 border-black rounded-lg inline-block" />
              Create Your Diagram
            </h2>
            
            <div className="space-y-6">
              <NeubrutDropdown
                value={diagramType}
                onChange={setDiagramType}
                options={diagramOptions}
              />

              <motion.textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 min-h-[200px] bg-white rounded-lg
                         border-4 border-black 
                         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                         transition-all duration-200
                         font-mono text-lg"
                placeholder="Describe your diagram..."
              />

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="px-8 py-3 bg-[#93CAED] 
                           rounded-lg border-4 border-black
                           shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                           transition-all duration-200
                           font-bold text-lg disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : 'Generate Diagram'}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          {mermaidCode && (
            <motion.div 
              className="bg-white border-8 border-black rounded-2xl p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Your Diagram</h2>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="p-2 border-4 border-black rounded-lg hover:bg-gray-100"
                  >
                    {copied ? (
                      <ClipboardDocumentCheckIcon className="w-6 h-6" />
                    ) : (
                      <ClipboardIcon className="w-6 h-6" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="p-2 border-4 border-black rounded-lg hover:bg-gray-100"
                  >
                    <ArrowDownTrayIcon className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <MermaidRenderer chart={mermaidCode} />
              </Suspense>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="bg-red-100 border-4 border-black p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t-8 border-black bg-white relative z-10 mt-24">
        <div className="container mx-auto px-8 py-10">
          <div className="flex justify-between items-center">
            <motion.p 
              className="font-black text-xl"
              whileHover={{ scale: 1.05 }}
            >
              © 2024 Flow.AI
            </motion.p>
            <div className="flex gap-8">
              {['Twitter', 'GitHub', 'Discord'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="font-bold text-lg hover:text-[#93CAED] transition-colors relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
