# DocFormat Inspector 🔍

A modern React web application for analyzing document formatting issues page by page. Upload your Word (.docx) or PDF files and get detailed insights into formatting inconsistencies across your document.

![DocFormat Inspector](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.0-ff0055)

## ✨ Features

- **📄 File Upload**: Drag & drop or click to upload PDF and DOCX files
- **⚙️ Custom Rules**: Define formatting standards for:
  - Heading font family and size
  - Body font family and size
  - Line spacing
  - Paragraph alignment
  - Image alignment
- **📊 Detailed Analysis**: Get page-by-page breakdown of formatting issues
- **📈 Visual Reports**: 
  - Summary table with issue counts
  - Bar chart showing issue distribution
  - Severity-based color coding
  - Formatting accuracy score
- **🎨 Modern UI**: Clean, responsive design with smooth animations
- **🔄 Re-analysis**: Easily adjust rules and re-analyze documents

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## 📦 Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx      # File upload component with drag & drop
│   ├── RulesForm.jsx        # Formatting rules configuration form
│   └── ResultsPanel.jsx     # Analysis results display
├── utils/
│   └── mockAnalyzer.js      # Mock document analyzer (simulates backend)
├── App.jsx                  # Main application component
├── main.jsx                 # React entry point
└── index.css                # Global styles with Tailwind
```

## 🎯 How It Works

1. **Set Rules**: Define your desired formatting standards using the rules form
2. **Upload Document**: Drag and drop or select a **DOCX** file (Word document)
3. **Analyze**: Click "Analyze Document" to perform **real formatting validation**:
   - Parses the DOCX file structure using Mammoth.js
   - Extracts all headings, paragraphs, and images
   - Compares actual font families, sizes, and alignments against your rules
   - Identifies exact formatting inconsistencies
4. **Review Results**: Get a comprehensive report showing:
   - Overall formatting accuracy score
   - Issue summary table grouped by type
   - Pages affected for each issue type
   - Detailed breakdown with specific errors and element previews
   - Visual chart of issue distribution

### 🔍 What Gets Checked

The analyzer performs **genuine format validation** by **parsing the raw DOCX XML structure**:

- ✅ **Heading Font Family**: Reads actual font from `w:rFonts` XML tags
- ✅ **Heading Font Size**: Extracts exact point size from `w:sz` attributes
- ✅ **Body Font Family**: Checks every paragraph's actual font family
- ✅ **Body Font Size**: Validates paragraph font sizes from document XML
- ✅ **Paragraph Alignment**: Reads `w:jc` (justification) from Word XML
- ✅ **Line Spacing**: Extracts spacing from `w:spacing` elements

**This is NOT mock data** - the app unzips your DOCX file, reads the internal `document.xml` and `styles.xml`, and validates the actual formatting attributes stored by Microsoft Word!

## 🛠️ Technologies Used

- **React 18.2.0** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library for data visualization
- **React Icons** - Icon library
- **JSZip** - Unzip DOCX files (DOCX is a ZIP archive)
- **XML Parsing** - Browser's DOMParser to read Word XML structure

## 🔮 Future Enhancements

- Real PDF parsing with PDF.js or backend integration
- More accurate page number detection
- Line spacing validation from raw XML
- Support for custom styles and themes in documents
- Margin and padding validation
- Table formatting checks
- Header/footer validation
- Export analysis reports as PDF/CSV
- Custom rule templates
- Historical analysis tracking
- Batch document processing

## 📝 Document Analysis Engine

This app uses **REAL XML parsing** of DOCX files:

### How DOCX Parsing Works
1. **Unzip**: DOCX files are ZIP archives containing XML files
2. **Extract XML**: Read `word/document.xml` (content) and `word/styles.xml` (styles)
3. **Parse XML**: Use browser's DOMParser to parse Word's XML structure
4. **Extract Formatting**: Read actual formatting from XML tags:
   - `<w:rFonts w:ascii="Arial"/>` → Font family
   - `<w:sz w:val="24"/>` → Font size (24/2 = 12pt)
   - `<w:jc w:val="center"/>` → Alignment
   - `<w:spacing w:line="360"/>` → Line spacing
5. **Validate**: Compare each element against your rules
6. **Report Issues**: Show exact mismatches with element previews

### What You Get
- ✅ **Exact font names** from Word's internal XML
- ✅ **Precise point sizes** (not estimates)
- ✅ **Real alignment** values
- ✅ **Actual text content** of problematic elements
- ⚠️ **Estimated page numbers** (XML doesn't contain page breaks)

### Current Limitations
- **Page numbers**: Estimated based on element count (no exact page breaks in XML)
- **PDF support**: Requires backend (browsers can't easily parse PDF structure)
- **Images**: Limited metadata extraction from XML

### Example XML Being Parsed
```xml
<w:p>
  <w:pPr>
    <w:pStyle w:val="Heading1"/>
    <w:jc w:val="left"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman"/>
      <w:sz w:val="32"/> <!-- 16pt -->
    </w:rPr>
    <w:t>Introduction</w:t>
  </w:r>
</w:p>
```

The analyzer reads this XML and extracts:
- Type: Heading
- Font: Times New Roman  
- Size: 16pt
- Alignment: left
- Text: "Introduction"

```javascript
{
  totalPages: number,
  fileName: string,
  issues: [
    { page: number, type: string, desc: string }
  ],
  summary: {
    "Issue Type": [page numbers]
  },
  accuracy: number (0-100)
}
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the primary color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize green theme
      }
    }
  }
}
```

### Issue Types
Modify issue types in `src/utils/mockAnalyzer.js`:

```javascript
const issueTypes = [
  { type: 'Your Issue Type', descriptions: ['...'] }
];
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React and Tailwind CSS
