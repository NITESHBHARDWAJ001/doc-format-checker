# Test Document Instructions - Copy & Paste into Word

## Create Test Document with Intentional Errors

### Step 1: Open Microsoft Word
Create a new blank document

### Step 2: Copy and paste this content into Word:

---
[START COPYING FROM HERE]

Test Document for Format Checker

This is the introduction paragraph. It should be in Arial font, 12pt, left-aligned.

Methods and Analysis

This section has some formatting errors. Change this heading to Calibri font and 14pt size.

The methods paragraph is written here. Change this paragraph to Verdana font to create an error.

Results Section

This is the results text. Change this to 14pt font size (instead of 12pt).

Some paragraphs should be center-aligned but are left-aligned. Center-align this paragraph to test alignment checking.

Conclusion

This is the final paragraph in Arial 12pt as expected.

[STOP COPYING HERE]

---

### Step 3: Apply These Formats

1. **First Heading "Test Document for Format Checker":**
   - Font: Times New Roman
   - Size: 16pt
   - Style: Make it Heading 1

2. **First paragraph "This is the introduction...":**
   - Font: Arial
   - Size: 12pt
   - Alignment: Left

3. **Second Heading "Methods and Analysis":**
   - Font: Calibri (❌ ERROR - should be Times New Roman)
   - Size: 14pt (❌ ERROR - should be 16pt)
   - Style: Make it Heading 2

4. **Second paragraph "The methods paragraph...":**
   - Font: Verdana (❌ ERROR - should be Arial)
   - Size: 12pt

5. **Third Heading "Results Section":**
   - Font: Times New Roman (✅ CORRECT)
   - Size: 16pt (✅ CORRECT)
   - Style: Make it Heading 1

6. **Third paragraph "This is the results text...":**
   - Font: Arial (✅ CORRECT)
   - Size: 14pt (❌ ERROR - should be 12pt)

7. **Fourth paragraph "Some paragraphs should...":**
   - Font: Arial
   - Size: 12pt
   - Alignment: Center (❌ ERROR - should be left)

8. **Last Heading "Conclusion":**
   - Font: Times New Roman (✅ CORRECT)
   - Size: 16pt (✅ CORRECT)

9. **Last paragraph:**
   - Font: Arial (✅ CORRECT)
   - Size: 12pt (✅ CORRECT)

### Step 4: Save the Document
- File > Save As
- Name: `test-format-errors.docx`
- Format: **Word Document (.docx)**

### Step 5: Test in the App

Upload this file with these rules:
- Heading Font: **Times New Roman**
- Heading Size: **16**
- Body Font: **Arial**
- Body Size: **12**
- Paragraph Alignment: **left**
- Image Alignment: **center**

**Expected Results:**
You should see exactly **5 errors**:
1. ❌ Heading Font - "Methods and Analysis" (Calibri instead of Times New Roman)
2. ❌ Heading Font Size - "Methods and Analysis" (14pt instead of 16pt)
3. ❌ Body Font Family - methods paragraph (Verdana instead of Arial)
4. ❌ Body Font Size - results paragraph (14pt instead of 12pt)
5. ❌ Paragraph Alignment - center-aligned paragraph (center instead of left)
