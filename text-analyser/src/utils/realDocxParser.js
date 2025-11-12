/**
 * REAL DOCX Parser - Reads actual formatting from DOCX XML structure
 * This parser directly reads the document.xml and styles.xml from DOCX files
 */

import JSZip from 'jszip';

/**
 * Parse DOCX file and extract real formatting data
 * @param {File} file - The DOCX file to parse
 * @returns {Promise<Object>} Parsed document with formatting info
 */
export async function parseDocxFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = new JSZip();
    const docx = await zip.loadAsync(arrayBuffer);
    
    // Read the main document XML
    const documentXml = await docx.file('word/document.xml')?.async('string');
    if (!documentXml) {
      throw new Error('Invalid DOCX file - missing document.xml');
    }
    
    // Read styles XML
    const stylesXml = await docx.file('word/styles.xml')?.async('string');
    
    // Parse XML
    const parser = new DOMParser();
    const docXmlDom = parser.parseFromString(documentXml, 'text/xml');
    const stylesXmlDom = stylesXml ? parser.parseFromString(stylesXml, 'text/xml') : null;
    
    // Extract styles definitions
    const styles = extractStyles(stylesXmlDom);
    
    // Extract all paragraphs and their formatting
    const elements = extractElements(docXmlDom, styles);
    
    return {
      elements,
      styles,
      totalElements: elements.length
    };
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error(`Failed to parse DOCX file: ${error.message}`);
  }
}

/**
 * Extract style definitions from styles.xml
 * @param {Document} stylesXmlDom - Parsed styles XML
 * @returns {Object} Style definitions
 */
function extractStyles(stylesXmlDom) {
  const styles = {
    defaults: {},
    named: {}
  };
  
  if (!stylesXmlDom) return styles;
  
  // Get default paragraph and run styles
  const docDefaults = stylesXmlDom.getElementsByTagName('w:docDefaults')[0];
  if (docDefaults) {
    const rPrDefault = docDefaults.getElementsByTagName('w:rPrDefault')[0];
    if (rPrDefault) {
      const rPr = rPrDefault.getElementsByTagName('w:rPr')[0];
      if (rPr) {
        styles.defaults = parseRunProperties(rPr);
      }
    }
  }
  
  // Get named styles
  const styleElements = stylesXmlDom.getElementsByTagName('w:style');
  for (let i = 0; i < styleElements.length; i++) {
    const style = styleElements[i];
    const styleId = style.getAttribute('w:styleId');
    const styleName = style.getElementsByTagName('w:name')[0]?.getAttribute('w:val');
    const type = style.getAttribute('w:type');
    
    const rPr = style.getElementsByTagName('w:rPr')[0];
    const pPr = style.getElementsByTagName('w:pPr')[0];
    
    styles.named[styleId] = {
      name: styleName,
      type: type,
      run: rPr ? parseRunProperties(rPr) : {},
      paragraph: pPr ? parseParagraphProperties(pPr) : {}
    };
  }
  
  return styles;
}

/**
 * Parse run (text) properties
 * @param {Element} rPr - Run properties XML element
 * @returns {Object} Formatting properties
 */
function parseRunProperties(rPr) {
  const props = {};
  
  // Font family
  const rFonts = rPr.getElementsByTagName('w:rFonts')[0];
  if (rFonts) {
    props.fontFamily = rFonts.getAttribute('w:ascii') || 
                       rFonts.getAttribute('w:hAnsi') || 
                       rFonts.getAttribute('w:cs');
  }
  
  // Font size (in half-points, so divide by 2)
  const sz = rPr.getElementsByTagName('w:sz')[0];
  if (sz) {
    props.fontSize = parseInt(sz.getAttribute('w:val')) / 2;
  }
  
  // Bold
  const b = rPr.getElementsByTagName('w:b')[0];
  if (b) {
    props.bold = true;
  }
  
  // Italic
  const i = rPr.getElementsByTagName('w:i')[0];
  if (i) {
    props.italic = true;
  }
  
  return props;
}

/**
 * Parse paragraph properties
 * @param {Element} pPr - Paragraph properties XML element
 * @returns {Object} Paragraph formatting
 */
function parseParagraphProperties(pPr) {
  const props = {};
  
  // Alignment
  const jc = pPr.getElementsByTagName('w:jc')[0];
  if (jc) {
    const alignment = jc.getAttribute('w:val');
    props.alignment = alignment === 'both' ? 'justify' : alignment;
  }
  
  // Spacing
  const spacing = pPr.getElementsByTagName('w:spacing')[0];
  if (spacing) {
    const line = spacing.getAttribute('w:line');
    const lineRule = spacing.getAttribute('w:lineRule');
    if (line) {
      // Convert to line spacing multiplier
      if (lineRule === 'auto') {
        props.lineSpacing = parseInt(line) / 240; // 240 = single spacing
      }
    }
  }
  
  return props;
}

/**
 * Extract all document elements with their formatting
 * @param {Document} docXmlDom - Parsed document XML
 * @param {Object} styles - Style definitions
 * @returns {Array} Array of formatted elements
 */
function extractElements(docXmlDom, styles) {
  const elements = [];
  const body = docXmlDom.getElementsByTagName('w:body')[0];
  
  if (!body) return elements;
  
  const paragraphs = body.getElementsByTagName('w:p');
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const element = parseParagraph(paragraph, styles, i);
    
    if (element) {
      elements.push(element);
    }
  }
  
  return elements;
}

/**
 * Parse a single paragraph element
 * @param {Element} paragraph - Paragraph XML element
 * @param {Object} styles - Style definitions
 * @param {number} index - Paragraph index
 * @returns {Object|null} Parsed paragraph data
 */
function parseParagraph(paragraph, styles, index) {
  // Get paragraph properties
  const pPr = paragraph.getElementsByTagName('w:pPr')[0];
  let isHeading = false;
  let paragraphStyle = null;
  let paragraphProps = {};
  
  if (pPr) {
    // Check if it's a heading
    const pStyle = pPr.getElementsByTagName('w:pStyle')[0];
    if (pStyle) {
      const styleId = pStyle.getAttribute('w:val');
      paragraphStyle = styles.named[styleId];
      
      // Check if it's a heading style
      if (styleId && (
        styleId.toLowerCase().includes('heading') || 
        styleId.toLowerCase().includes('title') ||
        /^heading\d+$/i.test(styleId)
      )) {
        isHeading = true;
      }
    }
    
    // Parse local paragraph properties
    paragraphProps = parseParagraphProperties(pPr);
  }
  
  // Get text content and run properties
  const runs = paragraph.getElementsByTagName('w:r');
  let text = '';
  let runProps = { ...styles.defaults };
  
  for (let j = 0; j < runs.length; j++) {
    const run = runs[j];
    
    // Get run properties
    const rPr = run.getElementsByTagName('w:rPr')[0];
    if (rPr) {
      runProps = { ...runProps, ...parseRunProperties(rPr) };
    }
    
    // Apply style properties
    if (paragraphStyle && paragraphStyle.run) {
      runProps = { ...paragraphStyle.run, ...runProps };
    }
    
    // Get text
    const textElements = run.getElementsByTagName('w:t');
    for (let k = 0; k < textElements.length; k++) {
      text += textElements[k].textContent;
    }
  }
  
  // Skip empty paragraphs
  if (!text.trim()) {
    return null;
  }
  
  // Merge paragraph properties with style
  if (paragraphStyle && paragraphStyle.paragraph) {
    paragraphProps = { ...paragraphStyle.paragraph, ...paragraphProps };
  }
  
  return {
    index: index + 1,
    type: isHeading ? 'heading' : 'paragraph',
    text: text.trim(),
    fontFamily: runProps.fontFamily || 'Unknown',
    fontSize: runProps.fontSize || null,
    bold: runProps.bold || false,
    italic: runProps.italic || false,
    alignment: paragraphProps.alignment || 'left',
    lineSpacing: paragraphProps.lineSpacing || null,
    styleId: paragraphStyle?.name || null
  };
}

/**
 * Normalize font family name for comparison
 * @param {string} fontFamily - Font family name
 * @returns {string} Normalized font name
 */
export function normalizeFontFamily(fontFamily) {
  if (!fontFamily || fontFamily === 'Unknown') return 'Unknown';
  return fontFamily.trim();
}

/**
 * Check if two font families match
 * @param {string} expected - Expected font
 * @param {string} actual - Actual font
 * @returns {boolean} Whether they match
 */
export function fontsMatch(expected, actual) {
  if (actual === 'Unknown') return true; // Skip unknown
  
  const norm1 = normalizeFontFamily(expected).toLowerCase();
  const norm2 = normalizeFontFamily(actual).toLowerCase();
  
  return norm1 === norm2;
}
