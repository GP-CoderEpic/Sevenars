import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

// Function to extract text from a PDF
async function extractTextFromPDF(filePath) {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const textContent = [];

    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const text = await page.getTextContent();
        textContent.push(text.items.map(item => item.str).join(' '));
    }
    return textContent.join('\n');
}

// Function to create a PDF from the original text
async function createPDFFromText(text, outputPdfPath) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
    const textSize = 12;
    const margin = 50;

    let yPosition = page.getHeight() - margin;

    // Split the text into lines and add each to the page
    const lines = text.split('\n');
    for (let line of lines) {
        if (yPosition < margin) {
            page.addPage();
            yPosition = page.getHeight() - margin;
        }
        page.drawText(line, { x: margin, y: yPosition, font, size: textSize });
        yPosition -= textSize + 2; // Line height
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, pdfBytes);
    console.log("New PDF created at: ${outputPdfPath}");
}

// Main process to extract text and generate the new PDF
async function processPDF(inputPdfPath, outputPdfPath) {
    // Step 1: Extract text from the original PDF
    const originalText = await extractTextFromPDF(inputPdfPath);
    console.log('Extracted Text:');
    console.log(originalText);

    // Step 2: Use the original text to create a new PDF
    await createPDFFromText(originalText, outputPdfPath);
}

// Example usage
const inputPdf = 'input.pdf'; // Replace with your input PDF file path
const outputPdf = 'output.pdf'; // Replace with desired output PDF file path

processPDF(inputPdf, outputPdf);