# Testing Your DocFormat Inspector

## Create a Test DOCX File

To test the analyzer, create a Word document with intentional formatting issues:

### Test Document Template

**Create a new Word document with:**

#### Page 1-2: Correct Formatting
```
Heading 1: "Introduction" (Times New Roman, 16pt)
Paragraph: "This is the introduction text..." (Arial, 12pt, left-aligned)

Heading 2: "Background" (Times New Roman, 16pt)
Paragraph: "Background information here..." (Arial, 12pt, left-aligned)
```

#### Page 3-4: Introduce Some Errors
```
Heading: "Methods" (Calibri, 14pt) ❌ Wrong font & size
Paragraph: "Methods description..." (Arial, 14pt) ❌ Wrong size

Heading: "Results" (Arial, 16pt) ❌ Wrong font
Paragraph: "Results text..." (Times New Roman, 12pt) ❌ Wrong font
```

#### Page 5-6: More Variety
```
Heading: "Discussion" (Times New Roman, 18pt) ❌ Wrong size
Paragraph (center-aligned): "Centered text..." ❌ Wrong alignment

Heading: "Conclusion" (Verdana, 16pt) ❌ Wrong font
Insert an image (left-aligned) ❌ If rule says center-aligned
```

### Quick Test Steps

1. **Open Microsoft Word or Google Docs**

2. **Create headings** with different fonts:
   - Some in Times New Roman (correct)
   - Some in Arial, Calibri, or Verdana (incorrect)

3. **Create paragraphs** with different sizes:
   - Some at 12pt (correct)
   - Some at 14pt or 11pt (incorrect)

4. **Add images** with different alignments

5. **Save as .docx**

6. **Upload to DocFormat Inspector**

7. **Set rules to:**
   - Heading Font: Times New Roman
   - Heading Size: 16
   - Body Font: Arial
   - Body Size: 12
   - Paragraph Align: left
   - Image Align: center

8. **Click Analyze**

### Expected Results

You should see issues like:
- "Expected Times New Roman, found Calibri in heading 'Methods...'"
- "Expected 16pt, found 14pt in heading 'Methods...'"
- "Expected Arial, found Times New Roman in paragraph '...'"
- "Expected 12pt, found 14pt in paragraph"
- "Expected center alignment, found left for image"

## Sample Documents

You can also download test documents from:
- Microsoft Office Templates
- Google Docs Templates
- Create your own with mixed formatting

## What to Look For

✅ **Working correctly:**
- Issues are reported with specific font names
- Page numbers are shown (estimated)
- Element text previews are displayed
- Summary groups issues by type

⚠️ **Known limitations:**
- Page numbers are estimates
- Some complex Word styles may not be detected
- Line spacing detection is limited

---

**Tip:** Start with a simple 2-3 page document with obvious formatting differences to verify the analyzer is working!
