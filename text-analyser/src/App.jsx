import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDescription, MdAutoAwesome } from 'react-icons/md';
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import FileUpload from './components/FileUpload';
import RulesForm from './components/RulesForm';
import ResultsPanel from './components/ResultsPanel';
import { analyzeDocument } from './utils/documentAnalyzer';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const [rules, setRules] = useState({
    headingFont: 'Times New Roman',
    headingSize: '16',
    bodyFont: 'Arial',
    bodySize: '12',
    lineSpacing: '1.5',
    paragraphAlign: 'left',
    imageAlign: 'center'
  });

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResults(null); // Clear previous results
    setError(null); // Clear previous errors
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResults(null);
    setError(null);

    try {
      const analysisResults = await analyzeDocument(selectedFile, rules);
      setResults(analysisResults);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = () => {
    setResults(null);
    // Keep the file, just allow user to change rules and re-analyze
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <MdDescription className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                DocFormat Inspector
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Analyze document formatting issues page by page
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Rules Form */}
          <div className="space-y-6">
            <RulesForm rules={rules} onChange={setRules} />
          </div>

          {/* Right Column - File Upload & Results */}
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <MdAutoAwesome className="text-2xl text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Document Upload</h2>
              </div>

              <FileUpload
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveFile}
              />

              {/* Analyze Button */}
              <div className="mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className={`
                    w-full px-6 py-4 rounded-xl font-semibold text-lg
                    transition-all duration-300 shadow-md
                    ${selectedFile && !isAnalyzing
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center space-x-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing Document...</span>
                    </span>
                  ) : (
                    '🔍 Analyze Document'
                  )}
                </button>

                {!selectedFile && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Please upload a document to begin analysis
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 mb-1">Analysis Failed</h4>
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-xs text-red-600 mt-2">
                      💡 Tip: Currently, only DOCX files are fully supported. PDF analysis requires backend processing.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results Panel */}
            <AnimatePresence>
              {results && (
                <ResultsPanel results={results} onReanalyze={handleReanalyze} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Set Rules</h4>
                <p className="text-sm text-gray-600">
                  Define your desired formatting standards for headings, body text, spacing, and alignment.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Upload Document</h4>
                <p className="text-sm text-gray-600">
                  Upload your Word (.docx) or PDF file for comprehensive formatting analysis.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Review Results</h4>
                <p className="text-sm text-gray-600">
                  Get a detailed page-by-page breakdown of all formatting issues found in your document.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              DocFormat Inspector • Built with React & Tailwind CSS • {new Date().getFullYear()}
            </p>
            
            {/* Developer Credit */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-sm font-semibold text-gray-700">
                Developed by <span className="text-primary-600">Nitesh Sharma</span>
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.linkedin.com/in/nitesh-sharma-5b4115306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-110"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
                
                <a
                  href="https://www.instagram.com/nitesh_bhardwaj0001?igsh=ejc3NjBvZGU1ZTBr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors transform hover:scale-110"
                  aria-label="Instagram Profile"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                
                <a
                  href="https://github.com/NITESHBHARDWAJ001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors transform hover:scale-110"
                  aria-label="GitHub Profile"
                >
                  <FaGithub className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
