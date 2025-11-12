# 🚀 Quick Start Guide

## Installation

1. **Install dependencies:**
```bash
npm install
```

This will install:
- React & React DOM
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Mammoth.js for DOCX parsing
- All other required packages

2. **Start the development server:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📖 How to Use

### Step 1: Define Formatting Rules
On the left panel, set your desired formatting standards:
- **Heading Font**: Choose the font family for headings (e.g., Times New Roman)
- **Heading Size**: Set the font size in points (e.g., 16pt)
- **Body Font**: Choose the font for paragraph text (e.g., Arial)
- **Body Size**: Set the body text size (e.g., 12pt)
- **Line Spacing**: Select line spacing (1.0, 1.5, 2.0, etc.)
- **Paragraph Alignment**: Choose left, center, right, or justify
- **Image Alignment**: Select left, center, or right

### Step 2: Upload Document
On the right panel:
- Click or drag & drop a **DOCX file** (Word document)
- The app will display file information
- Only `.docx` files are fully supported for now

### Step 3: Analyze
- Click the **"🔍 Analyze Document"** button
- Wait 1-2 seconds while the app parses your document
- The analyzer will:
  - Extract all headings, paragraphs, and images
  - Compare their formatting against your rules
  - Identify exact mismatches

### Step 4: Review Results
The results panel shows:
- **Accuracy Score**: Overall formatting compliance (0-100%)
- **Summary Table**: Issues grouped by type with page numbers
- **Visual Chart**: Bar chart showing issue distribution
- **Detailed Report**: Expandable sections showing each specific issue

### Step 5: Re-analyze (Optional)
- Adjust your formatting rules
- Click **"Re-analyze with New Rules"**
- The same document will be checked against updated rules

## 🎨 Example Workflow

1. You receive a 20-page report that should use:
   - Headings: **Times New Roman, 16pt**
   - Body: **Arial, 12pt**
   - Paragraphs: **Left-aligned**
   - Images: **Centered**

2. Set these rules in the left panel

3. Upload the report (DOCX file)

4. Click Analyze

5. Results show:
   ```
   Issue Type          | Count | Pages Affected
   -------------------|-------|----------------
   Heading Font       |   4   | 4, 5, 8, 9
   Body Font Size     |   3   | 6, 7, 10
   Image Alignment    |   2   | 3, 19
   ```

6. You can see exactly which pages have issues and what's wrong

## 🐛 Troubleshooting

### "Analysis Failed" Error
- **Cause**: Usually happens with PDF files or corrupted DOCX files
- **Solution**: Make sure you're uploading a valid `.docx` file created in Microsoft Word or Google Docs

### No Issues Found (but you know there are issues)
- **Cause**: The tolerance is set to ±2pt for font sizes
- **Solution**: Check if the differences are within this tolerance range

### Page numbers seem off
- **Cause**: Page numbers are estimated based on content distribution
- **Solution**: This is a current limitation of browser-based parsing. For exact page numbers, a backend solution is needed.

### Can't upload PDF
- **Cause**: PDF parsing requires backend processing
- **Solution**: Convert your PDF to DOCX using Word or an online converter

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── FileUpload.jsx       # Drag & drop file upload
│   ├── RulesForm.jsx         # Formatting rules configuration
│   └── ResultsPanel.jsx      # Analysis results display
├── utils/
│   └── documentAnalyzer.js   # Real DOCX parser & validator
├── App.jsx                   # Main app component
└── main.jsx                  # React entry point
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## ❓ FAQ

**Q: Can I use this offline?**
A: Yes! Once you run `npm install` and start the dev server, everything runs locally in your browser.

**Q: Is my document data sent anywhere?**
A: No! All processing happens in your browser. No data is uploaded to any server.

**Q: Why only DOCX files?**
A: DOCX files are ZIP archives containing XML, which browsers can parse easily. PDFs require more complex parsing that works better with backend processing.

**Q: How accurate is the page number estimation?**
A: It's an approximation. For exact page numbers, you'd need to render the document with the exact same settings as Word, which requires backend processing.

---

**Need help?** Open an issue on GitHub or check the main README.md for more details.
