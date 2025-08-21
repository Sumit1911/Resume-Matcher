// backend/src/middleware/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { isValidFileType } from '../services/textExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${extension}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (isValidFileType(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
});

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum file size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files. Only one file is allowed.'
      });
    }
    return res.status(400).json({
      error: `Upload error: ${error.message}`
    });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: error.message
    });
  }
  
  next(error);
};

export default upload;