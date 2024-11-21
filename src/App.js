import { motion } from 'framer-motion';
import { useState } from 'react';
import { ClipboardIcon, ClipboardDocumentCheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MermaidRenderer from './components/MermaidRenderer';
import { generateFlowchart } from './services/gemini';

function App() {
  const [description, setDescription] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const code = await generateFlowchart(description);
      setMermaidCode(code);
    } catch (err) {
      setError('Failed to generate flowchart. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
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
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          <motion.h1 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            AI Flowchart Generator
          </motion.h1>
          
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg border border-white/10"
          >
            <h2 className="text-xl mb-4 font-semibold">Describe Your Flowchart</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-black/20 backdrop-blur-sm text-white rounded-lg p-4 mb-4 
                focus:ring-2 focus:ring-white/20 focus:outline-none border border-white/10
                transition-all duration-300 resize-none"
              placeholder="Describe your flowchart here..."
            />
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !description.trim()}
                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 
                  rounded-lg transition duration-300 backdrop-blur-sm border border-white/10
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⚡</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  'Generate Flowchart'
                )}
              </button>
              {error && (
                <span className="text-red-400 text-sm">{error}</span>
              )}
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mermaid Code Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mermaid Code</h2>
                {mermaidCode && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 text-sm text-white/70 hover:text-white
                      transition duration-300 group"
                  >
                    {copied ? (
                      <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-400" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5 group-hover:text-white/90" />
                    )}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                )}
              </div>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm h-[400px] overflow-auto
                border border-white/10 transition-all duration-300">
                <pre className="whitespace-pre-wrap break-words">
                  <code className="text-white/90">
                    {mermaidCode || 'Your mermaid code will appear here'}
                  </code>
                </pre>
              </div>
            </motion.div>

            {/* Flowchart Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg border border-white/10 h-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Flowchart Preview</h2>
                {mermaidCode && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 text-sm text-white/70 hover:text-white
                      transition duration-300 group"
                    title="Download SVG"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 group-hover:text-white/90" />
                    <span>Download</span>
                  </button>
                )}
              </div>
              <div className="h-[400px] relative mermaid-viewer">
                {mermaidCode ? (
                  <MermaidRenderer chart={mermaidCode} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/60 text-center">Your flowchart will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
