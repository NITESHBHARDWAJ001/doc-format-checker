import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdError, MdExpandMore, MdExpandLess, MdAssessment } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ResultsPanel = ({ results, onReanalyze }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedTypes, setExpandedTypes] = useState({});

  if (!results) return null;

  const { totalPages, fileName, issues, summary, accuracy } = results;

  // Prepare data for chart
  const chartData = Object.entries(summary).map(([type, pages]) => ({
    name: type,
    count: pages.length
  }));

  // Color scheme for severity
  const getSeverityColor = (issueType) => {
    const highSeverity = ['Heading Font', 'Heading Font Size'];
    const mediumSeverity = ['Body Font Size', 'Body Font Family', 'Paragraph Alignment'];
    
    if (highSeverity.includes(issueType)) return '#ef4444'; // red-500
    if (mediumSeverity.includes(issueType)) return '#f59e0b'; // amber-500
    return '#10b981'; // green-500
  };

  const toggleTypeExpansion = (type) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <MdAssessment className="text-3xl" />
              <h2 className="text-2xl font-bold">Analysis Results</h2>
            </div>
            <p className="text-primary-100 text-sm truncate max-w-md">
              {fileName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{accuracy}%</div>
            <div className="text-sm text-primary-100">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Accuracy Indicator */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Formatting Score</span>
          <span className="text-sm font-semibold text-gray-900">{accuracy}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              accuracy >= 80 ? 'bg-green-500' :
              accuracy >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
          <span>Total Pages: {totalPages}</span>
          <span>Issues Found: {issues.length}</span>
        </div>
      </div>

      {/* Summary Table */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Issue Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Issue Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Count</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pages Affected</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(summary).map(([type, pages], index) => (
                <motion.tr
                  key={type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-semibold">
                      {pages.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {pages.slice(0, 5).map(page => (
                        <span key={page} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                          {page}
                        </span>
                      ))}
                      {pages.length > 5 && (
                        <span className="px-2 py-1 bg-gray-200 rounded text-xs font-medium">
                          +{pages.length - 5} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`
                      inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                      ${['Heading Font', 'Heading Font Size'].includes(type) 
                        ? 'bg-red-100 text-red-700' 
                        : ['Body Font Size', 'Body Font Family', 'Paragraph Alignment'].includes(type)
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {['Heading Font', 'Heading Font Size'].includes(type) ? 'High' :
                       ['Body Font Size', 'Body Font Family', 'Paragraph Alignment'].includes(type) ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Issues Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSeverityColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Report */}
      <div className="p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full mb-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <MdError className="mr-2 text-red-500" />
            Detailed Report ({issues.length} issues)
          </h3>
          {showDetails ? <MdExpandLess className="text-2xl" /> : <MdExpandMore className="text-2xl" />}
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 max-h-96 overflow-y-auto pr-2"
          >
            {Object.entries(summary).map(([type, pages]) => (
              <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleTypeExpansion(type)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`
                      w-3 h-3 rounded-full
                      ${['Heading Font', 'Heading Font Size'].includes(type) 
                        ? 'bg-red-500' 
                        : ['Body Font Size', 'Body Font Family', 'Paragraph Alignment'].includes(type)
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                      }
                    `}></span>
                    <span className="font-semibold text-gray-800">{type}</span>
                    <span className="text-sm text-gray-500">({pages.length} issues)</span>
                  </div>
                  {expandedTypes[type] ? <MdExpandLess /> : <MdExpandMore />}
                </button>
                
                {expandedTypes[type] && (
                  <div className="p-4 bg-white space-y-2">
                    {issues
                      .filter(issue => issue.type === type)
                      .map((issue, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                            {issue.page}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">{issue.desc}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onReanalyze}
          className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Re-analyze with New Rules
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;
