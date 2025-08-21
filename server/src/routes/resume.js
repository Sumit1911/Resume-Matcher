import express from 'express';
import upload from '../middleware/upload.js';
import { extractTextFromFile } from '../services/textExtractor.js';
import { analyzeResumeMatch } from '../services/geminiService.js';

const router = express.Router();

//analyze resume match
router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        const {jobDescription, resumeText} = req.body;

        if(!jobDescription) {
            return res.status(400).json({
                error: 'Job description is required'
            });
        }

        let finalResumeText = resumeText;

        //if file is uploaded then extract text from it
        if(req.file) {
            try {
                finalResumeText = await extractTextFromFile(req.file);
            } catch(extractError) {
                console.error('Text extraction error:', extractError);
                return res.status(400).json({ 
                    error: 'Failed to extract text from uploaded file. Please try a different file or paste the resume text directly.' 
                });
            }
        }

        if(!finalResumeText || finalResumeText.trim().length === 0) {
            return res.status(400).json({
                error: 'Resume text is required. Please upload a file or paste resume text'
            });
        }

        //analyze resume match using gemini
        const analysis = await analyzeResumeMatch(finalResumeText, jobDescription);

        res.json({
            success: true,
            analysis, 
            resumeText : finalResumeText.substring(0, 500) + '...',
        });
    } catch {
        console.error('Resume analysis error:', error);
        res.status(500).json({
            error : 'failed to analyze resume match',
            message : process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
});

//test endpoint
router.get('/test', (req, res) => {
    res.json({
        message : 'Resume API is working', 
        endpoints : {
            analyze: 'POST/api/resume/analyze'
        }
    });
});


export default router;