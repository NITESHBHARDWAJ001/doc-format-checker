/**
 * Real Document Format Analyzer
 * Uses actual DOCX XML parsing to check formatting
 */

import { parseDocxFile, fontsMatch, normalizeFontFamily } from './realDocxParser';

/**
 * Analyze document formatting against rules
 * @param {File} file - Uploaded DOCX file
 * @param {Object} rules - Formatting rules to check against
 * @returns {Promise<Object>} Analysis results with real issues
 */
export async function analyzeDocument(file, rules) {
  const issues = [];
  
  try {
    // Check file type
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExtension !== '.docx' && fileExtension !== '.doc') {
      throw new Error('Only DOCX files are supported. Please upload a .docx file.');
    }
    
    // Parse the DOCX file and extract real formatting
    console.log('Parsing DOCX file...');
    const parsedDoc = await parseDocxFile(file);
    console.log('Parsed elements:', parsedDoc.elements);
    
    if (!parsedDoc.elements || parsedDoc.elements.length === 0) {
      throw new Error('No content found in document. The file might be empty or corrupted.');
    }
    
    // Expected values from rules (convert to numbers)
    const expectedHeadingFont = rules.headingFont;
    const expectedHeadingSize = parseInt(rules.headingSize);
    const expectedBodyFont = rules.bodyFont;
    const expectedBodySize = parseInt(rules.bodySize);
    const expectedLineSpacing = parseFloat(rules.lineSpacing);
    const expectedParaAlign = rules.paragraphAlign;
    
    // Estimate pages (approximately 30 elements per page)
    const elementsPerPage = 30;
    
    // Process each element
    parsedDoc.elements.forEach((element) => {
      const estimatedPage = Math.ceil(element.index / elementsPerPage);
      
      if (element.type === 'heading') {
        // Check heading font family
        if (element.fontFamily && !fontsMatch(expectedHeadingFont, element.fontFamily)) {
          issues.push({
            page: estimatedPage,
            type: 'Heading Font',
            desc: `Expected "${expectedHeadingFont}", found "${normalizeFontFamily(element.fontFamily)}" in heading: "${element.text.substring(0, 50)}${element.text.length > 50 ? '...' : ''}"`
          });
        }
        
        // Check heading font size
        if (element.fontSize && element.fontSize !== expectedHeadingSize) {
          issues.push({
            page: estimatedPage,
            type: 'Heading Font Size',
            desc: `Expected ${expectedHeadingSize}pt, found ${element.fontSize}pt in heading: "${element.text.substring(0, 50)}${element.text.length > 50 ? '...' : ''}"`
          });
        }
        
      } else if (element.type === 'paragraph') {
        // Check body font family
        if (element.fontFamily && !fontsMatch(expectedBodyFont, element.fontFamily)) {
          issues.push({
            page: estimatedPage,
            type: 'Body Font Family',
            desc: `Expected "${expectedBodyFont}", found "${normalizeFontFamily(element.fontFamily)}" in text: "${element.text.substring(0, 50)}${element.text.length > 50 ? '...' : ''}"`
          });
        }
        
        // Check body font size
        if (element.fontSize && element.fontSize !== expectedBodySize) {
          issues.push({
            page: estimatedPage,
            type: 'Body Font Size',
            desc: `Expected ${expectedBodySize}pt, found ${element.fontSize}pt in text: "${element.text.substring(0, 50)}${element.text.length > 50 ? '...' : ''}"`
          });
        }
        
        // Check paragraph alignment
        if (element.alignment && element.alignment !== expectedParaAlign) {
          issues.push({
            page: estimatedPage,
            type: 'Paragraph Alignment',
            desc: `Expected "${expectedParaAlign}" alignment, found "${element.alignment}" in text: "${element.text.substring(0, 40)}..."`
          });
        }
        
        // Check line spacing (if available)
        if (element.lineSpacing && Math.abs(element.lineSpacing - expectedLineSpacing) > 0.1) {
          issues.push({
            page: estimatedPage,
            type: 'Line Spacing',
            desc: `Expected ${expectedLineSpacing} line spacing, found ${element.lineSpacing.toFixed(1)}`
          });
        }
      }
    });
    
    // Sort issues by page
    issues.sort((a, b) => a.page - b.page);
    
    // Generate summary - group issues by type
    const summary = {};
    issues.forEach(issue => {
      if (!summary[issue.type]) {
        summary[issue.type] = [];
      }
      if (!summary[issue.type].includes(issue.page)) {
        summary[issue.type].push(issue.page);
      }
    });
    
    // Sort page numbers in each category
    Object.keys(summary).forEach(key => {
      summary[key].sort((a, b) => a - b);
    });
    
    // Calculate total pages
    const totalPages = Math.max(
      ...issues.map(i => i.page),
      Math.ceil(parsedDoc.elements.length / elementsPerPage),
      1
    );
    
    // Calculate accuracy score
    const totalChecks = parsedDoc.elements.length * 3; // Each element checked for 3 things
    const accuracy = Math.max(0, Math.min(100, Math.round(((totalChecks - issues.length) / totalChecks) * 100)));
    
    console.log('Analysis complete:', {
      totalElements: parsedDoc.elements.length,
      totalIssues: issues.length,
      accuracy: accuracy + '%'
    });
    
    return {
      totalPages,
      fileName: file.name,
      fileSize: file.size,
      issues,
      summary,
      accuracy,
      timestamp: new Date().toISOString(),
      documentStats: {
        totalElements: parsedDoc.elements.length,
        headings: parsedDoc.elements.filter(e => e.type === 'heading').length,
        paragraphs: parsedDoc.elements.filter(e => e.type === 'paragraph').length
      }
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

/**
 * Get issue severity level
 */
export function getIssueSeverity(issueType) {
  const highSeverity = ['Heading Font', 'Heading Font Size'];
  const mediumSeverity = ['Body Font Size', 'Body Font Family', 'Paragraph Alignment'];
  
  if (highSeverity.includes(issueType)) return 'high';
  if (mediumSeverity.includes(issueType)) return 'medium';
  return 'low';
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
