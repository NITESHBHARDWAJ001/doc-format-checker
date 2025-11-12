import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdUpload, MdDescription, MdClose, MdCheckCircle } from 'react-icons/md';

const FileUpload = ({ onFileSelect, selectedFile, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const validateAndSelectFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (validTypes.includes(file.type) || validExtensions.includes(fileExtension)) {
      onFileSelect(file);
    } else {
      alert('Please upload a valid PDF or Word document (.pdf, .docx, .doc)');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
              relative border-2 border-dashed rounded-xl p-8 cursor-pointer
              transition-all duration-300 ease-in-out
              ${isDragging 
                ? 'border-primary-500 bg-primary-50 scale-105' 
                : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                animate={{ 
                  scale: isDragging ? 1.2 : 1,
                  rotate: isDragging ? 5 : 0 
                }}
                className={`
                  p-4 rounded-full transition-colors
                  ${isDragging ? 'bg-primary-100' : 'bg-white'}
                `}
              >
                <MdUpload className={`
                  text-5xl transition-colors
                  ${isDragging ? 'text-primary-600' : 'text-gray-400'}
                `} />
              </motion.div>

              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  {isDragging ? 'Drop your file here' : 'Upload Document'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag & drop or click to select
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supported formats: PDF, DOCX, DOC
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-2 border-primary-500 bg-primary-50 rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <MdDescription className="text-3xl text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {selectedFile.name}
                    </h3>
                    <MdCheckCircle className="text-primary-600 text-xl flex-shrink-0" />
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center">
                      <span className="font-medium mr-1">Size:</span>
                      {formatFileSize(selectedFile.size)}
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium mr-1">Type:</span>
                      {selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toUpperCase().slice(1)}
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium mr-1">Pages:</span>
                      ~20 (estimated)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRemove}
                className="ml-2 p-2 rounded-lg hover:bg-red-100 transition-colors group flex-shrink-0"
                title="Remove file"
              >
                <MdClose className="text-xl text-gray-500 group-hover:text-red-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
