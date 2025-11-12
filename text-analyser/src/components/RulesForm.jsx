import React from 'react';
import { MdTextFields, MdFormatLineSpacing, MdFormatAlignLeft } from 'react-icons/md';

const RulesForm = ({ rules, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...rules, [field]: value });
  };

  const fontFamilies = [
    'Times New Roman',
    'Arial',
    'Calibri',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Courier New'
  ];

  const alignments = ['left', 'center', 'right', 'justify'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <MdTextFields className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Formatting Rules</h2>
      </div>

      <div className="space-y-6">
        {/* Heading Font Section */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Heading Format
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={rules.headingFont}
                onChange={(e) => handleChange('headingFont', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size (pt)
              </label>
              <input
                type="number"
                min="8"
                max="72"
                value={rules.headingSize}
                onChange={(e) => handleChange('headingSize', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Body Font Section */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Body Text Format
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={rules.bodyFont}
                onChange={(e) => handleChange('bodyFont', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size (pt)
              </label>
              <input
                type="number"
                min="8"
                max="24"
                value={rules.bodySize}
                onChange={(e) => handleChange('bodySize', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Spacing and Alignment Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide flex items-center">
            <MdFormatLineSpacing className="mr-2" />
            Spacing & Alignment
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Line Spacing
              </label>
              <select
                value={rules.lineSpacing}
                onChange={(e) => handleChange('lineSpacing', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              >
                <option value="1.0">Single (1.0)</option>
                <option value="1.15">1.15</option>
                <option value="1.5">1.5</option>
                <option value="2.0">Double (2.0)</option>
                <option value="2.5">2.5</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MdFormatAlignLeft className="mr-1" />
                Paragraph Alignment
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {alignments.map(align => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => handleChange('paragraphAlign', align)}
                    className={`
                      px-4 py-2.5 rounded-lg border-2 font-medium capitalize transition-all
                      ${rules.paragraphAlign === align
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                      }
                    `}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Alignment
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['left', 'center', 'right'].map(align => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => handleChange('imageAlign', align)}
                    className={`
                      px-4 py-2.5 rounded-lg border-2 font-medium capitalize transition-all
                      ${rules.imageAlign === align
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                      }
                    `}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <strong>💡 How it works:</strong> The analyzer will parse your DOCX file and check:
        </p>
        <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
          <li>All heading elements against your heading font and size rules</li>
          <li>All paragraph text against your body font and size rules</li>
          <li>Paragraph and image alignment throughout the document</li>
          <li>Line spacing consistency (where detectable)</li>
        </ul>
        <p className="text-xs text-blue-600 mt-3">
          <strong>Note:</strong> Currently supports DOCX files. PDF support requires backend processing.
        </p>
      </div>
    </div>
  );
};

export default RulesForm;
