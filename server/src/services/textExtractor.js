import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';

export async function extractTextFromFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const filePath = file.path;
  const fileExtension = path.extname(file.originalname).toLowerCase();

  try {
    let extractedText = '';

    switch (fileExtension) {
      case '.pdf':
        extractedText = await extractFromPDF(filePath);
        break;
        
      case '.docx':
        extractedText = await extractFromDOCX(filePath);
        break;
      
      case '.doc':
        extractedText = await extractFromDOC(filePath);
        break;
      
      case '.txt':
        extractedText = await extractFromTXT(filePath);
        break;
      
      default:
        throw new Error(`Unsupported file type: ${fileExtension}. Supported formats: PDF, DOCX, DOC, TXT`);
    }

    // Clean up the uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the file. The file may be empty or corrupted.');
    }

    return extractedText.trim();

  } catch (error) {
    // Clean up the uploaded file in case of error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
}

async function extractFromPDF(filePath) {
  try {
    // Check if file exists first
    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file not found');
    }

    console.log('Attempting PDF extraction from:', filePath);

    // Try multiple PDF parsing approaches
    let extractedText = null;
    
    // Method 1: Try pdf-parse/lib/pdf-parse with better error handling
    try {
      extractedText = await tryPdfParseLib(filePath);
      console.log('PDF extraction successful with pdf-parse/lib');
    } catch (error1) {
      console.log('pdf-parse/lib failed:', error1.message);
      
      // Method 2: Try pdf2pic + OCR approach
      try {
        extractedText = await tryPdf2Pic(filePath);
        console.log('PDF extraction successful with pdf2pic');
      } catch (error2) {
        console.log('pdf2pic failed:', error2.message);
        
        // Method 3: Try basic buffer reading with pdf-parse
        try {
          extractedText = await tryBasicPdfParse(filePath);
          console.log('PDF extraction successful with basic pdf-parse');
        } catch (error3) {
          console.log('All PDF methods failed');
          throw new Error('Unable to extract text from PDF. Please try converting to DOCX or paste the text directly.');
        }
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text content found in PDF. The PDF might be image-based or password protected.');
    }

    console.log('Successfully extracted PDF text, length:', extractedText.length);
    return extractedText;

  } catch (error) {
    console.error('PDF extraction error:', error.message);
    throw error;
  }
}

async function tryPdfParseLib(filePath) {
  // Dynamic import to avoid the ENOENT error on startup
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  
  // Try to require the lib version directly
  const pdfParse = require('pdf-parse/lib/pdf-parse');
  
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  
  return data.text;
}

async function tryBasicPdfParse(filePath) {
  // Try the standard pdf-parse but with better error handling
  const pdfParse = await import('pdf-parse');
  const parser = pdfParse.default || pdfParse;
  
  const dataBuffer = fs.readFileSync(filePath);
  const data = await parser(dataBuffer, {
    // Options to handle problematic PDFs
    max: 0, // parse all pages
    version: 'v1.10.100'
  });
  
  return data.text;
}

async function tryPdf2Pic(filePath) {
  // This is a fallback method - requires pdf2pic
  // For now, we'll throw an error suggesting alternative
  throw new Error('Advanced PDF processing not available. Please convert PDF to text or DOCX format.');
}

async function extractFromDOCX(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('DOCX file not found');
    }
    
    console.log('Extracting text from DOCX file:', filePath);
    const result = await mammoth.extractRawText({ path: filePath });
    
    if (!result || !result.value) {
      throw new Error('No text content found in DOCX file');
    }
    
    console.log('Successfully extracted text from DOCX, length:', result.value.length);
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error.message);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

async function extractFromDOC(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('DOC file not found');
    }
    
    console.log('Extracting text from DOC file:', filePath);
    const result = await mammoth.extractRawText({ path: filePath });
    
    if (!result || !result.value) {
      throw new Error('No text content found in DOC file');
    }
    
    console.log('Successfully extracted text from DOC, length:', result.value.length);
    return result.value;
  } catch (error) {
    console.error('DOC extraction error:', error.message);
    throw new Error(`Failed to extract text from DOC: ${error.message}. Please convert to DOCX format for better support.`);
  }
}

async function extractFromTXT(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('TXT file not found');
    }
    
    console.log('Reading TXT file:', filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content || content.trim().length === 0) {
      throw new Error('TXT file is empty');
    }
    
    console.log('Successfully read TXT file, length:', content.length);
    return content;
  } catch (error) {
    console.error('TXT extraction error:', error.message);
    throw new Error(`Failed to read TXT file: ${error.message}`);
  }
}

// Helper function to validate file type
export function isValidFileType(filename) {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const extension = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(extension);
}

// Helper function to get readable file size
export function getFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}